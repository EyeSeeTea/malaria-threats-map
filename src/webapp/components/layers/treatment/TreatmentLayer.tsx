import React, { Component } from "react";
import { connect } from "react-redux";
import { studiesToGeoJson, getCountryStudies } from "../layer-utils";
import setupEffects from "../effects";
import { selectTreatmentFilters, selectTreatmentStudies } from "../../../store/reducers/treatment-reducer";
import {
    selectCountryMode,
    selectFilters,
    selectRegion,
    selectSelection,
    selectTheme,
} from "../../../store/reducers/base-reducer";
import { selectCountries } from "../../../store/reducers/country-layer-reducer";
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
import { setSelection, setTooltipOpen } from "../../../store/actions/base-actions";
import { TreatmentStudy } from "../../../../domain/entities/TreatmentStudy";
import SitePopover from "../common/SitePopover";
import MolecularMarkersPopup from "./MolecularMarkers/MolecularMarkersPopup";
import TreatmentFailurePopup from "./TreatmentFailure/TreatmentFailurePopup";

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
    countries: selectCountries(state),
    countryMode: selectCountryMode(state),
    selection: selectSelection(state),
});
const mapDispatchToProps = {
    fetchTreatmentStudies: fetchTreatmentStudiesRequest,
    setFilteredStudies: setFilteredStudiesAction,
    setSelection: setSelection,
    setTooltipOpen: setTooltipOpen,
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
            countryMode,
            filters,
            region,
            countries,
        } = this.props;
        this.mountLayer(prevProps);
        this.renderLayer();
        const mapTypeChange = prevProps.treatmentFilters.mapType !== mapType;
        const yearChange = prevProps.filters[0] !== filters[0] || prevProps.filters[1] !== filters[1];
        const countryChange = prevProps.region !== region;
        const plasmodiumSpeciesChange = prevProps.treatmentFilters.plasmodiumSpecies !== plasmodiumSpecies;
        const drugChange = prevProps.treatmentFilters.drug !== drug;
        const molecularMarkerChange = prevProps.treatmentFilters.molecularMarker !== molecularMarker;
        const countryModeChange = prevProps.countryMode !== countryMode;
        const countriesChange = prevProps.countries.length !== countries.length;
        const excludeLowerPatientsChange = prevProps.treatmentFilters.excludeLowerPatients !== excludeLowerPatients;
        const excludeLowerSamplesChange = prevProps.treatmentFilters.excludeLowerSamples !== excludeLowerSamples;
        if (
            mapTypeChange ||
            yearChange ||
            countryChange ||
            countryModeChange ||
            countriesChange ||
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
        const { studies, countryMode } = this.props;
        const source: any = this.props.map.getSource(TREATMENT_SOURCE_ID);
        if (source) {
            const filteredStudies = this.filterStudies(studies);
            this.props.setFilteredStudies(filteredStudies);
            const geoStudies = this.setupGeoJsonData(filteredStudies);
            const countryStudies = getCountryStudies(filteredStudies, this.props.countries, TREATMENT);
            const data = countryMode ? countryStudies : geoStudies;
            source.setData(studiesToGeoJson(data));
        }
    };

    mountLayer(prevProps?: Props) {
        const { studies, treatmentFilters, countryMode } = this.props;
        if (!prevProps || (prevProps.studies.length !== studies.length && studies.length)) {
            if (this.props.map.getSource(TREATMENT_SOURCE_ID)) {
                this.props.map.removeLayer(TREATMENT_LAYER_ID);
                this.props.map.removeSource(TREATMENT_SOURCE_ID);
            }
            const filteredStudies = this.filterStudies(studies);
            this.props.setFilteredStudies(filteredStudies);
            const geoStudies = this.setupGeoJsonData(filteredStudies);
            const countryStudies = getCountryStudies(filteredStudies, this.props.countries, TREATMENT);

            const data = countryMode ? countryStudies : geoStudies;
            const source: any = {
                type: "geojson",
                data: studiesToGeoJson(data),
            };
            this.props.map.addSource(TREATMENT_SOURCE_ID, source);
            this.props.map.addLayer(layer(resolveMapTypeSymbols(treatmentFilters, countryMode)));

            setupEffects(this.props.map, TREATMENT_SOURCE_ID, TREATMENT_LAYER_ID);
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
        this.props.map.on("mouseover", TREATMENT_LAYER_ID, this.onMouseOverListener);
        this.props.map.on(
            "mouseenter",
            TREATMENT_LAYER_ID,
            () => (this.props.map.getCanvas().style.cursor = "pointer")
        );
        this.props.map.on("mouseleave", TREATMENT_LAYER_ID, () => (this.props.map.getCanvas().style.cursor = ""));
    };

    renderLayer = () => {
        if (this.props.map.getLayer(TREATMENT_LAYER_ID)) {
            if (this.props.theme === TREATMENT) {
                this.props.map.setLayoutProperty(TREATMENT_LAYER_ID, "visibility", "visible");
            } else {
                this.props.map.setLayoutProperty(TREATMENT_LAYER_ID, "visibility", "none");
            }
        }
    };

    applyMapTypeSymbols = () => {
        const { treatmentFilters, countryMode } = this.props;
        const layer = this.props.map.getLayer(TREATMENT_LAYER_ID);
        const mapTypeSymbols: { [key: string]: any } = resolveMapTypeSymbols(treatmentFilters, countryMode);
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
        const {
            studies,
            countryMode,
            selection,
            setTooltipOpen,
            treatmentFilters: { mapType },
        } = this.props;

        if (selection === null) {
            setTooltipOpen(false);
            return <div />;
        }
        const filteredStudies = this.filterStudies(studies).filter(study =>
            countryMode ? study.ISO2 === selection.ISO_2_CODE : study.SITE_ID === selection.SITE_ID
        );
        if (filteredStudies.length === 0) {
            return <div />;
        }

        return (
            this.props.theme === "treatment" && (
                <SitePopover map={this.props.map}>
                    {!countryMode && mapType === TreatmentMapType.MOLECULAR_MARKERS && (
                        <MolecularMarkersPopup studies={filteredStudies} />
                    )}
                    {!countryMode &&
                        (mapType === TreatmentMapType.DELAYED_PARASITE_CLEARANCE ||
                            mapType === TreatmentMapType.TREATMENT_FAILURE) && (
                            <TreatmentFailurePopup studies={filteredStudies} />
                        )}
                </SitePopover>
            )
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(TreatmentLayer);
