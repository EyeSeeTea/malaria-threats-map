import React, { Component } from "react";
import { connect } from "react-redux";
import { State } from "../../../store/types";
import { circleLayout, studiesToGeoJson } from "../layer-utils";
import diagnosisSymbols from "../symbols/diagnosis";
import setupEffects from "../effects";
import { selectDiagnosisFilters, selectDiagnosisStudies } from "../../../store/reducers/diagnosis-reducer";
import {
    selectFilters,
    selectHoverSelection,
    selectRegion,
    selectSelection,
    selectTheme,
} from "../../../store/reducers/base-reducer";
import * as R from "ramda";
import { resolveResistanceStatus } from "../prevention/ResistanceStatus/utils";
import { buildDiagnosisFilters } from "../studies-filters";
import { resolveMapTypeSymbols, studySelector } from "./utils";
import { DIAGNOSIS_STATUS } from "./GeneDeletions/utils";
import {
    fetchDiagnosisStudiesRequest,
    setDiagnosisFilteredStudiesAction,
    setDiagnosisSelectionStudies,
} from "../../../store/actions/diagnosis-actions";
import { setHoverSelection, setSelection } from "../../../store/actions/base-actions";
import { DiagnosisStudy } from "../../../../domain/entities/DiagnosisStudy";
import SitePopover from "../common/SitePopover";
import Hidden from "../../hidden/Hidden";
import SiteTitle from "../../site-title/SiteTitle";
import { getSiteSelectionOnClick, getSiteSelectionOnMove } from "../common/utils";

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
    hoverSelection: selectHoverSelection(state),
});

const mapDispatchToProps = {
    fetchDiagnosisStudies: fetchDiagnosisStudiesRequest,
    setFilteredStudies: setDiagnosisFilteredStudiesAction,
    setSelection: setSelection,
    setHoverSelection: setHoverSelection,
    setDiagnosisSelectionStudies: setDiagnosisSelectionStudies,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

type OwnProps = {
    map: mapboxgl.Map;
};
type Props = StateProps & DispatchProps & OwnProps;

class DiagnosisLayer extends Component<Props> {
    updatePreventionSelectionStudies() {
        const selectionStudies = this.props.selection
            ? this.filterStudies(this.props.studies).filter(study => study.SITE_ID === this.props.selection.SITE_ID)
            : [];

        this.props.setDiagnosisSelectionStudies(selectionStudies);
    }

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

            this.updatePreventionSelectionStudies();
        } else if (prevProps.selection !== this.props.selection) {
            this.updatePreventionSelectionStudies();
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

            this.renderLayer();
        }
    }

    onClickListener = (e: any) => {
        const selection = getSiteSelectionOnClick(e, this.props.map, DIAGNOSIS_LAYER_ID);

        setTimeout(() => {
            this.props.setSelection(selection);
        }, 100);
    };

    onMouseMoveListener = (e: any) => {
        this.props.map.getCanvas().style.cursor = "pointer";

        const selection = getSiteSelectionOnMove(e, this.props.map, DIAGNOSIS_LAYER_ID);

        setTimeout(() => {
            this.props.setHoverSelection(selection);
        }, 100);
    };

    renderLayer = () => {
        if (this.props.map.getLayer(DIAGNOSIS_LAYER_ID)) {
            if (this.props.theme === DIAGNOSIS) {
                this.props.map.on("mousemove", this.onMouseMoveListener);
                this.props.map.on("click", this.onClickListener);
                this.props.map.setLayoutProperty(DIAGNOSIS_LAYER_ID, "visibility", "visible");
            } else {
                this.props.map.off("mousemove", this.onMouseMoveListener);
                this.props.map.off("click", this.onClickListener);
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
        const { studies, hoverSelection } = this.props;
        if (hoverSelection === null) {
            return <div />;
        }
        const filteredStudies = this.filterStudies(studies).filter(study => study.SITE_ID === hoverSelection.SITE_ID);

        if (filteredStudies.length === 0) {
            return <div />;
        }
        return (
            this.props.theme === "diagnosis" && (
                <>
                    <Hidden smDown>
                        <SitePopover map={this.props.map}>
                            <SiteTitle study={filteredStudies[0]} />
                        </SitePopover>
                    </Hidden>
                </>
            )
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(DiagnosisLayer);
