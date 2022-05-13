import React, { Component } from "react";
import { connect } from "react-redux";
import { State } from "../../../store/types";
import { circleLayout, studiesToGeoJson } from "../layer-utils";
import diagnosisSymbols from "../symbols/diagnosis";
import setupEffects from "../effects";
import { selectDiagnosisFilters, selectDiagnosisStudies } from "../../../store/reducers/diagnosis-reducer";
import {
    selectFilters,
    selectRegion,
    selectSelection,
    selectTheme,
    selectViewData,
    selectIsSidebarOpen,
} from "../../../store/reducers/base-reducer";
import * as R from "ramda";
import { resolveResistanceStatus } from "../prevention/ResistanceStatus/utils";
import { buildDiagnosisFilters } from "../studies-filters";
import { resolveMapTypeSymbols, studySelector } from "./utils";
import { DIAGNOSIS_STATUS } from "./GeneDeletions/utils";
import {
    fetchDiagnosisStudiesRequest,
    setDiagnosisFilteredStudiesAction,
    setDiagnosisStudySelection,
} from "../../../store/actions/diagnosis-actions";

import { setSelection, setSidebarOpen, setViewData } from "../../../store/actions/base-actions";
import { DiagnosisStudy } from "../../../../domain/entities/DiagnosisStudy";
import SitePopover from "../common/SitePopover";
import DiagnosisSelectionChart from "./DiagnosisSelectionChart";
import Hidden from "../../hidden/Hidden";

const DIAGNOSIS = "diagnosis";
const DIAGNOSIS_LAYER_ID = "diagnosis-layer";
const DIAGNOSIS_SOURCE_ID = "diagnosis-source";

const layer: any = (symbols: any) => ({
    id: DIAGNOSIS_LAYER_ID,
    type: "circle",
    layout: circleLayout,
    paint: symbols || diagnosisSymbols,
    source: DIAGNOSIS_SOURCE_ID,
});

const mapStateToProps = (state: State) => ({
    studies: selectDiagnosisStudies(state),
    theme: selectTheme(state),
    filters: selectFilters(state),
    diagnosisFilters: selectDiagnosisFilters(state),
    region: selectRegion(state),
    selection: selectSelection(state),
    viewData: selectViewData(state),
    sidebarOpen: selectIsSidebarOpen(state),
});

const mapDispatchToProps = {
    fetchDiagnosisStudies: fetchDiagnosisStudiesRequest,
    setFilteredStudies: setDiagnosisFilteredStudiesAction,
    setDiagnosisStudySelection: setDiagnosisStudySelection,
    setSelection: setSelection,
    setSidebarOpen: setSidebarOpen,
    setViewData: setViewData,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

type OwnProps = {
    map: mapboxgl.Map;
};
type Props = StateProps & DispatchProps & OwnProps;

class DiagnosisLayer extends Component<Props> {
    componentDidMount() {
        this.loadStudiesIfRequired();
        this.mountLayer();
    }

    componentDidUpdate(prevProps: Props) {
        this.loadStudiesIfRequired();

        const {
            diagnosisFilters: { mapType, surveyTypes, patientType, deletionType },
            filters,
            region,
        } = this.props;

        this.mountLayer(prevProps);
        this.renderLayer();
        const mapTypeChange = prevProps.diagnosisFilters.mapType !== mapType;
        const yearChange = prevProps.filters[0] !== filters[0] || prevProps.filters[1] !== filters[1];
        const surveyTypesChange = prevProps.diagnosisFilters.surveyTypes.length !== surveyTypes.length;
        const patientTypeChange = prevProps.diagnosisFilters.patientType !== patientType;
        const deletionTypeChange = prevProps.diagnosisFilters.deletionType !== deletionType;
        const countryChange = prevProps.region !== region;
        if (
            mapTypeChange ||
            yearChange ||
            countryChange ||
            surveyTypesChange ||
            patientTypeChange ||
            deletionTypeChange
        ) {
            this.filterSource();
            this.applyMapTypeSymbols();
        }
    }

    loadStudiesIfRequired() {
        const { theme } = this.props;

        if (theme === DIAGNOSIS) {
            this.props.fetchDiagnosisStudies();
        }
    }

    componentWillUnmount() {
        this.renderLayer();
    }

    setupGeoJsonData = (studies: any[]) => {
        const groupedStudies = R.groupBy(R.path<string>(["SITE_ID"]), studies);
        const filteredStudies = R.values(groupedStudies).map(group =>
            studySelector(group, this.props.diagnosisFilters.mapType, this.props.diagnosisFilters.deletionType)
        );

        return filteredStudies.map(study => {
            const percentage = parseFloat(study["MORTALITY_ADJUSTED"]);
            return {
                ...study,
                CONFIRMATION_STATUS: resolveResistanceStatus(percentage),
                DIAGNOSIS_PFHRP2_STATUS:
                    study.HRP2_POSITIVE > 0 ? DIAGNOSIS_STATUS.CONFIRMED : DIAGNOSIS_STATUS.NOT_IDENTIFIED,
                DIAGNOSIS_PFHRP2_PFHRP3_STATUS:
                    study.HRP2_HRP3_PROPORTION_DELETION > 0
                        ? DIAGNOSIS_STATUS.CONFIRMED
                        : DIAGNOSIS_STATUS.NOT_IDENTIFIED,
            };
        });
    };

    buildFilters = () => {
        const { diagnosisFilters, filters, region } = this.props;
        return buildDiagnosisFilters(diagnosisFilters, filters, region);
    };

    filterStudies = (studies: DiagnosisStudy[]) => {
        const filters = this.buildFilters();
        return filters.reduce((studies, filter) => studies.filter(filter), studies);
    };

    filterSource = () => {
        const { studies } = this.props;
        const source: any = this.props.map.getSource(DIAGNOSIS_SOURCE_ID);
        if (source) {
            const filteredStudies = this.filterStudies(studies);
            this.props.setFilteredStudies(filteredStudies);
            const geoStudies = this.setupGeoJsonData(filteredStudies);
            source.setData(studiesToGeoJson(geoStudies));
        }
    };

    mountLayer(prevProps?: Props) {
        const { studies } = this.props;
        if (!prevProps || prevProps.studies.length !== studies.length) {
            if (this.props.map.getSource(DIAGNOSIS_SOURCE_ID)) {
                this.props.map.removeLayer(DIAGNOSIS_LAYER_ID);
                this.props.map.removeSource(DIAGNOSIS_SOURCE_ID);
            }
            const filteredStudies = this.filterStudies(studies);
            this.props.setFilteredStudies(filteredStudies);
            const geoStudies = this.setupGeoJsonData(filteredStudies);

            const source: any = {
                type: "geojson",
                data: studiesToGeoJson(geoStudies),
            };
            this.props.map.addSource(DIAGNOSIS_SOURCE_ID, source);
            this.props.map.addLayer(layer(resolveMapTypeSymbols()));

            setupEffects(this.props.map, DIAGNOSIS_SOURCE_ID, DIAGNOSIS_LAYER_ID);
            this.setupPopover();
            this.renderLayer();
        }
    }

    onMouseOverListener = (e: any) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
        const selection = {
            ISO_2_CODE: e.features[0].properties.ISO_2_CODE,
            SITE_ID: e.features[0].properties.SITE_ID,
            coordinates: coordinates,
        };
        setTimeout(() => {
            this.props.setSelection(selection);
        }, 100);
    };

    onMouseLeaveListener = (e: any) => {
        this.props.map.getCanvas().style.cursor = "";
        setTimeout(() => {
            this.props.setSelection(null);
            if (this.props.sidebarOpen) {
                setSidebarOpen(true);
            }
        }, 100);
    };

    setupPopover = () => {
        this.props.map.on("mouseover", DIAGNOSIS_LAYER_ID, this.onMouseOverListener);
       /* this.props.map.on("click", () => {
            if (!this.props.sidebarOpen) {
                this.props.setSidebarOpen(true);
            }
            setTimeout(() => {
                this.props.setViewData(this.props.selection);
            }, 100);
        });*/
       /* this.props.map.on(
            "mouseenter",
            DIAGNOSIS_LAYER_ID,
            () => (this.props.map.getCanvas().style.cursor = "pointer")
        );*/

        this.props.map.on("mouseout", DIAGNOSIS_LAYER_ID, this.onMouseLeaveListener);
    };

    renderLayer = () => {
        if (this.props.map.getLayer(DIAGNOSIS_LAYER_ID)) {
            if (this.props.theme === DIAGNOSIS) {
                this.props.map.setLayoutProperty(DIAGNOSIS_LAYER_ID, "visibility", "visible");
            } else {
                this.props.map.setLayoutProperty(DIAGNOSIS_LAYER_ID, "visibility", "none");
            }
        }
    };

    applyMapTypeSymbols = () => {
        const layer = this.props.map.getLayer(DIAGNOSIS_LAYER_ID);
        const mapTypeSymbols = resolveMapTypeSymbols();
        if (layer && mapTypeSymbols) {
            this.props.map.setPaintProperty(DIAGNOSIS_LAYER_ID, "circle-radius", mapTypeSymbols["circle-radius"]);
            this.props.map.setPaintProperty(DIAGNOSIS_LAYER_ID, "circle-color", mapTypeSymbols["circle-color"]);
            this.props.map.setPaintProperty(
                DIAGNOSIS_LAYER_ID,
                "circle-stroke-color",
                mapTypeSymbols["circle-stroke-color"]
            );
        }
    };

    render() {
        const { studies, selection, viewData, setSidebarOpen, sidebarOpen } = this.props;
        /*if (viewData === null) {
            setSidebarOpen(false);
        }*/
        console.log(selection)
        console.log(viewData)
        console.log(sidebarOpen)
        //selection === null
       if (viewData === null && selection === null) {
            setSidebarOpen(false);
            this.props.setDiagnosisStudySelection([]);
            return <div />;
        }
        if(selection === null) {
            return <div />;
        }
        const filteredStudies = this.filterStudies(studies).filter(study => study.SITE_ID === selection.SITE_ID);

        this.props.setDiagnosisStudySelection(filteredStudies);

        if (filteredStudies.length === 0) {
            return <div />;
        }

        return (
            this.props.theme === "diagnosis" && (
                <Hidden smDown>
                    <SitePopover map={this.props.map} layer={DIAGNOSIS_LAYER_ID}>
                        <DiagnosisSelectionChart studies={filteredStudies} popup={true} />
                    </SitePopover>
                </Hidden>
            )
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(DiagnosisLayer);
