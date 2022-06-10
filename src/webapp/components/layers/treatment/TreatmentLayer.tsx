import React, { Component } from "react";
import { connect } from "react-redux";
import { studiesToGeoJson } from "../layer-utils";
import setupEffects from "../effects";
import { selectTreatmentFilters, selectTreatmentStudies } from "../../../store/reducers/treatment-reducer";
import {
    selectFilters,
    selectHoverSelection,
    selectRegion,
    selectSelection,
    selectTheme,
} from "../../../store/reducers/base-reducer";
import mapboxgl from "mapbox-gl";
import * as R from "ramda";
import {
    filterByDimensionId,
    filterByDrug,
    filterByExcludeLowerPatients,
    filterByExcludeLowerSamples,
    filterByMolecularMarker,
    filterByMolecularMarkerStudy,
    filterByPlasmodiumSpecies,
    filterByRegion,
    filterByYearRange,
} from "../studies-filters";
import { State, TreatmentMapType } from "../../../store/types";
import { resolveMapTypeSymbols, studySelector } from "./utils";
import { fetchTreatmentStudiesRequest, setFilteredStudiesAction } from "../../../store/actions/treatment-actions";
import { setHoverSelection, setSelection } from "../../../store/actions/base-actions";
import { TreatmentStudy } from "../../../../domain/entities/TreatmentStudy";
import SitePopover from "../common/SitePopover";
import Hidden from "../../hidden/Hidden";
import SiteTitle from "../../site-title/SiteTitle";
import { getSiteSelectionOnClick, getSiteSelectionOnMove } from "../common/utils";

const TREATMENT = "treatment";
const TREATMENT_LAYER_ID = "treatment-layer";
const TREATMENT_SOURCE_ID = "treatment-source";

const circleLayout = {
    visibility: "visible",
};

const layer: any = (symbols: any) => ({
    id: TREATMENT_LAYER_ID,
    type: "circle",
    layout: circleLayout,
    paint: symbols,
    source: TREATMENT_SOURCE_ID,
});

const mapStateToProps = (state: State) => ({
    studies: selectTreatmentStudies(state),
    theme: selectTheme(state),
    filters: selectFilters(state),
    treatmentFilters: selectTreatmentFilters(state),
    region: selectRegion(state),
    selection: selectSelection(state),
    hoverSelection: selectHoverSelection(state),
});
const mapDispatchToProps = {
    fetchTreatmentStudies: fetchTreatmentStudiesRequest,
    setFilteredStudies: setFilteredStudiesAction,
    setSelection: setSelection,
    setHoverSelection: setHoverSelection,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

type OwnProps = {
    map: mapboxgl.Map;
};
type Props = StateProps & OwnProps & DispatchProps;

class TreatmentLayer extends Component<Props> {
    popup: mapboxgl.Popup;

    componentDidMount() {
        this.loadStudiesIfRequired();
        this.mountLayer();
    }

    componentDidUpdate(prevProps: Props) {
        this.loadStudiesIfRequired();

        const {
            treatmentFilters: {
                mapType,
                plasmodiumSpecies,
                drug,
                molecularMarker,
                excludeLowerPatients,
                excludeLowerSamples,
            },
            filters,
            region,
        } = this.props;

        this.mountLayer(prevProps);
        this.renderLayer();
        const mapTypeChange = prevProps.treatmentFilters.mapType !== mapType;
        const yearChange = prevProps.filters[0] !== filters[0] || prevProps.filters[1] !== filters[1];
        const countryChange = prevProps.region !== region;
        const plasmodiumSpeciesChange = prevProps.treatmentFilters.plasmodiumSpecies !== plasmodiumSpecies;
        const drugChange = prevProps.treatmentFilters.drug !== drug;
        const molecularMarkerChange = prevProps.treatmentFilters.molecularMarker !== molecularMarker;
        const excludeLowerPatientsChange = prevProps.treatmentFilters.excludeLowerPatients !== excludeLowerPatients;
        const excludeLowerSamplesChange = prevProps.treatmentFilters.excludeLowerSamples !== excludeLowerSamples;
        if (
            mapTypeChange ||
            yearChange ||
            countryChange ||
            plasmodiumSpeciesChange ||
            drugChange ||
            molecularMarkerChange ||
            excludeLowerPatientsChange ||
            excludeLowerSamplesChange
        ) {
            if (this.popup) {
                this.popup.remove();
            }
            this.filterSource();
            this.applyMapTypeSymbols();
        }
    }

    loadStudiesIfRequired() {
        const { theme } = this.props;

        if (theme === TREATMENT) {
            this.props.fetchTreatmentStudies();
        }
    }

    componentWillUnmount() {
        this.renderLayer();
    }

    setupGeoJsonData = (studies: any[]) => {
        const { mapType } = this.props.treatmentFilters;
        const groupedStudies = R.groupBy(R.path<string>(["SITE_ID"]), studies);
        const filteredStudies = R.values(groupedStudies).map(group => studySelector(group, mapType));
        return filteredStudies;
    };

    buildFilters = () => {
        const { treatmentFilters, filters, region } = this.props;
        switch (treatmentFilters.mapType) {
            case TreatmentMapType.TREATMENT_FAILURE:
                return [
                    filterByDimensionId(256),
                    filterByPlasmodiumSpecies(treatmentFilters.plasmodiumSpecies),
                    filterByDrug(treatmentFilters.drug),
                    filterByYearRange(filters),
                    filterByRegion(region),
                    filterByExcludeLowerPatients(treatmentFilters.excludeLowerPatients),
                ];
            case TreatmentMapType.DELAYED_PARASITE_CLEARANCE:
                return [
                    filterByDimensionId(256),
                    filterByPlasmodiumSpecies(treatmentFilters.plasmodiumSpecies),
                    filterByDrug(treatmentFilters.drug),
                    filterByYearRange(filters),
                    filterByRegion(region),
                    filterByExcludeLowerPatients(treatmentFilters.excludeLowerPatients),
                ];
            case TreatmentMapType.MOLECULAR_MARKERS:
                return [
                    filterByMolecularMarkerStudy(),
                    filterByMolecularMarker(treatmentFilters.molecularMarker),
                    filterByYearRange(filters),
                    filterByRegion(region),
                    filterByExcludeLowerSamples(treatmentFilters.excludeLowerSamples),
                ];
            default:
                return [];
        }
    };

    filterStudies = (studies: TreatmentStudy[]) => {
        const filters = this.buildFilters();
        return filters.reduce((studies, filter) => studies.filter(filter), studies);
    };

    filterSource = () => {
        const { studies } = this.props;
        const source: any = this.props.map.getSource(TREATMENT_SOURCE_ID);
        if (source) {
            const filteredStudies = this.filterStudies(studies);
            this.props.setFilteredStudies(filteredStudies);
            const geoStudies = this.setupGeoJsonData(filteredStudies);
            source.setData(studiesToGeoJson(geoStudies));
        }
    };

    mountLayer(prevProps?: Props) {
        const { studies, treatmentFilters } = this.props;
        if (!prevProps || (prevProps.studies.length !== studies.length && studies.length)) {
            if (this.props.map.getSource(TREATMENT_SOURCE_ID)) {
                this.props.map.removeLayer(TREATMENT_LAYER_ID);
                this.props.map.removeSource(TREATMENT_SOURCE_ID);
            }
            const filteredStudies = this.filterStudies(studies);
            this.props.setFilteredStudies(filteredStudies);
            const geoStudies = this.setupGeoJsonData(filteredStudies);
            const source: any = {
                type: "geojson",
                data: studiesToGeoJson(geoStudies),
            };
            this.props.map.addSource(TREATMENT_SOURCE_ID, source);
            this.props.map.addLayer(layer(resolveMapTypeSymbols(treatmentFilters)));

            setupEffects(this.props.map, TREATMENT_SOURCE_ID, TREATMENT_LAYER_ID);

            this.renderLayer();
        }
    }

    onClickListener = (e: any) => {
        const selection = getSiteSelectionOnClick(e, this.props.map, TREATMENT_LAYER_ID);

        setTimeout(() => {
            this.props.setSelection(selection);
        }, 100);
    };

    onMouseMoveListener = (e: any) => {
        this.props.map.getCanvas().style.cursor = "pointer";

        const selection = getSiteSelectionOnMove(e, this.props.map, TREATMENT_LAYER_ID);

        setTimeout(() => {
            this.props.setHoverSelection(selection);
        }, 100);
    };

    renderLayer = () => {
        if (this.props.map.getLayer(TREATMENT_LAYER_ID)) {
            if (this.props.theme === TREATMENT) {
                this.props.map.setLayoutProperty(TREATMENT_LAYER_ID, "visibility", "visible");
                this.props.map.on("mousemove", this.onMouseMoveListener);
                this.props.map.on("click", this.onClickListener);
            } else {
                this.props.map.setLayoutProperty(TREATMENT_LAYER_ID, "visibility", "none");
                this.props.map.off("mousemove", this.onMouseMoveListener);
                this.props.map.off("click", this.onClickListener);
            }
        }
    };

    applyMapTypeSymbols = () => {
        const { treatmentFilters } = this.props;
        const layer = this.props.map.getLayer(TREATMENT_LAYER_ID);
        const mapTypeSymbols: { [key: string]: any } = resolveMapTypeSymbols(treatmentFilters);
        if (layer && mapTypeSymbols) {
            this.props.map.setPaintProperty(TREATMENT_LAYER_ID, "circle-radius", mapTypeSymbols["circle-radius"]);
            this.props.map.setPaintProperty(TREATMENT_LAYER_ID, "circle-color", mapTypeSymbols["circle-color"]);
            this.props.map.setPaintProperty(
                TREATMENT_LAYER_ID,
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
            this.props.theme === "treatment" && (
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
export default connect(mapStateToProps, mapDispatchToProps)(TreatmentLayer);
