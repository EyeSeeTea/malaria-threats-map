import React, { Component } from "react";
import { connect } from "react-redux";
import { State } from "../../../store/types";
import { circleLayout, studiesToGeoJson, getCountryStudies } from "../layer-utils";
import diagnosisSymbols from "../symbols/diagnosis";
import setupEffects from "../effects";
import { selectDiagnosisFilters, selectDiagnosisStudies } from "../../../store/reducers/diagnosis-reducer";
import {
    selectCountryMode,
    selectFilters,
    selectRegion,
    selectSelection,
    selectTheme,
    selectViewData,
} from "../../../store/reducers/base-reducer";
import * as R from "ramda";
import { resolveResistanceStatus } from "../prevention/ResistanceStatus/utils";
import { buildDiagnosisFilters } from "../studies-filters";
import { resolveMapTypeSymbols, studySelector } from "./utils";
import { DIAGNOSIS_STATUS } from "./GeneDeletions/utils";
import { selectCountries } from "../../../store/reducers/country-layer-reducer";
import {
    fetchDiagnosisStudiesRequest,
    setDiagnosisFilteredStudiesAction,
    setDiagnosisStudySelection
} from "../../../store/actions/diagnosis-actions";

import { setSelection, setSidebarOpen } from "../../../store/actions/base-actions";
import { DiagnosisStudy } from "../../../../domain/entities/DiagnosisStudy";
import SitePopover from "../common/SitePopover";
import DiagnosisSelectionChart from "./DiagnosisSelectionChart";

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
    countries: selectCountries(state),
    countryMode: selectCountryMode(state),
    selection: selectSelection(state),
    viewData: selectViewData(state),
});

const mapDispatchToProps = {
    fetchDiagnosisStudies: fetchDiagnosisStudiesRequest,
    setFilteredStudies: setDiagnosisFilteredStudiesAction,
    setDiagnosisStudySelection: setDiagnosisStudySelection,
    setSelection: setSelection,
    setSidebarOpen: setSidebarOpen,
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
            countryMode,
            countries,
        } = this.props;

        this.mountLayer(prevProps);
        this.renderLayer();
        const mapTypeChange = prevProps.diagnosisFilters.mapType !== mapType;
        const yearChange = prevProps.filters[0] !== filters[0] || prevProps.filters[1] !== filters[1];
        const surveyTypesChange = prevProps.diagnosisFilters.surveyTypes.length !== surveyTypes.length;
        const patientTypeChange = prevProps.diagnosisFilters.patientType !== patientType;
        const deletionTypeChange = prevProps.diagnosisFilters.deletionType !== deletionType;
        const countryChange = prevProps.region !== region;
        const countryModeChange = prevProps.countryMode !== countryMode;
        const countriesChange = prevProps.countries.length !== countries.length;
        if (
            mapTypeChange ||
            yearChange ||
            countryChange ||
            surveyTypesChange ||
            patientTypeChange ||
            deletionTypeChange ||
            countryModeChange ||
            countriesChange
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
        const { studies, countryMode } = this.props;
        const source: any = this.props.map.getSource(DIAGNOSIS_SOURCE_ID);
        if (source) {
            const filteredStudies = this.filterStudies(studies);
            this.props.setFilteredStudies(filteredStudies);
            const geoStudies = this.setupGeoJsonData(filteredStudies);
            const countryStudies = getCountryStudies(filteredStudies, this.props.countries, DIAGNOSIS);
            const data = countryMode ? countryStudies : geoStudies;
            source.setData(studiesToGeoJson(data));
        }
    };

    mountLayer(prevProps?: Props) {
        const { studies, countryMode } = this.props;
        if (!prevProps || prevProps.studies.length !== studies.length) {
            if (this.props.map.getSource(DIAGNOSIS_SOURCE_ID)) {
                this.props.map.removeLayer(DIAGNOSIS_LAYER_ID);
                this.props.map.removeSource(DIAGNOSIS_SOURCE_ID);
            }
            const filteredStudies = this.filterStudies(studies);
            this.props.setFilteredStudies(filteredStudies);
            const geoStudies = this.setupGeoJsonData(filteredStudies);
            const countryStudies = getCountryStudies(filteredStudies, this.props.countries, DIAGNOSIS);

            const data = countryMode ? countryStudies : geoStudies;

            const source: any = {
                type: "geojson",
                data: studiesToGeoJson(data),
            };
            this.props.map.addSource(DIAGNOSIS_SOURCE_ID, source);
            this.props.map.addLayer(layer(resolveMapTypeSymbols(countryMode)));

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

    setupPopover = () => {
        this.props.map.on("mouseover", DIAGNOSIS_LAYER_ID, this.onMouseOverListener);
        this.props.map.on(
            "mouseenter",
            DIAGNOSIS_LAYER_ID,
            () => (this.props.map.getCanvas().style.cursor = "pointer")
        );
        this.props.map.on("mouseleave", DIAGNOSIS_LAYER_ID, () => (this.props.map.getCanvas().style.cursor = ""));
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
        const { countryMode } = this.props;
        const layer = this.props.map.getLayer(DIAGNOSIS_LAYER_ID);
        const mapTypeSymbols = resolveMapTypeSymbols(countryMode);
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
        const { studies, countryMode, selection, viewData, setSidebarOpen } = this.props;
        if (viewData === null) {
            setSidebarOpen(false);
        }
        if (selection === null) {
            setSidebarOpen(false);
            return <div />;
        }
        const filteredStudies = this.filterStudies(studies).filter(study =>
            countryMode ? study.ISO2 === selection.ISO_2_CODE : study.SITE_ID === selection.SITE_ID
        );
        
        this.props.setDiagnosisStudySelection(filteredStudies);

        if (filteredStudies.length === 0) {
            return <div />;
        }

        return (
            this.props.theme === "diagnosis" && (
                <SitePopover map={this.props.map}>
                    <DiagnosisSelectionChart studies={filteredStudies} popup={true} />
                </SitePopover>
            )
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(DiagnosisLayer);
