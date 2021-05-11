import React, { Component } from "react";
import { connect } from "react-redux";
import { State } from "../../../store/types";
import { studiesToGeoJson } from "../layer-utils";
import setupEffects from "../effects";
import * as R from "ramda";
import resistanceStatusSymbols from "./ResistanceStatus/symbols";
import { resolveResistanceStatus } from "./ResistanceStatus/utils";
import { buildPreventionFilters } from "../studies-filters";
import { resolveMapTypeSymbols, studySelector } from "./utils";
import {
    selectPreventionFilters,
    selectPreventionStudies,
    selectPreventionStudiesLoading,
    selectPreventionStudiesError,
} from "../../../store/reducers/prevention-reducer";
import {
    selectCountryMode,
    selectFilters,
    selectRegion,
    selectSelection,
    selectTheme,
} from "../../../store/reducers/base-reducer";
import mapboxgl from "mapbox-gl";
import { selectCountries } from "../../../store/reducers/country-layer-reducer";
import {
    fetchPreventionStudiesRequest,
    setPreventionFilteredStudiesAction,
} from "../../../store/actions/prevention-actions";
import { Hidden } from "@material-ui/core";
import { setSelection } from "../../../store/actions/base-actions";
import PreventionSitePopover from "./PreventionSitePopover";
import PreventionSelectionChart from "./PreventionSelectionChart";
import ChartModal from "../../ChartModal";
import { PreventionStudy } from "../../../../domain/entities/PreventionStudy";

const PREVENTION = "prevention";
const PREVENTION_LAYER_ID = "prevention-layer";
const PREVENTION_SOURCE_ID = "prevention-source";

const circleLayout = {
    visibility: "visible",
};

const layer: any = (symbols: any) => ({
    id: PREVENTION_LAYER_ID,
    type: "circle",
    layout: circleLayout,
    paint: symbols || resistanceStatusSymbols,
    source: PREVENTION_SOURCE_ID,
});

const mapStateToProps = (state: State) => ({
    studies: selectPreventionStudies(state),
    studiesLoading: selectPreventionStudiesLoading(state),
    studiesError: selectPreventionStudiesError(state),
    theme: selectTheme(state),
    filters: selectFilters(state),
    preventionFilters: selectPreventionFilters(state),
    region: selectRegion(state),
    countries: selectCountries(state),
    countryMode: selectCountryMode(state),
    selection: selectSelection(state),
});

const mapDispatchToProps = {
    fetchPreventionStudies: fetchPreventionStudiesRequest,
    setFilteredStudies: setPreventionFilteredStudiesAction,
    setSelection: setSelection,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

type OwnProps = {
    map: any;
};
type Props = StateProps & DispatchProps & OwnProps;

class PreventionLayer extends Component<Props> {
    popup: mapboxgl.Popup;
    componentDidMount() {
        this.loadStudiesIfRequired();
        this.mountLayer();
    }

    componentDidUpdate(prevProps: Props) {
        this.loadStudiesIfRequired();

        const {
            preventionFilters: {
                mapType,
                insecticideClass,
                insecticideTypes,
                type,
                species,
                assayTypes,
                synergistTypes,
            },
            countryMode,
            filters,
            region,
            countries,
        } = this.props;

        this.mountLayer(prevProps);
        this.renderLayer();
        const mapTypeChange = prevProps.preventionFilters.mapType !== mapType;
        const yearChange = prevProps.filters[0] !== filters[0] || prevProps.filters[1] !== filters[1];
        const countryChange = prevProps.region !== region;
        const insecticideChange = prevProps.preventionFilters.insecticideClass !== insecticideClass;
        const insecticideTypesChange = prevProps.preventionFilters.insecticideTypes.length !== insecticideTypes.length;
        const typeChange = prevProps.preventionFilters.type !== type;
        const speciesChange = prevProps.preventionFilters.species.length !== species.length;
        const assayTypesChange = prevProps.preventionFilters.assayTypes.length !== assayTypes.length;
        const synergistTypesChange = prevProps.preventionFilters.synergistTypes.length !== synergistTypes.length;
        const countryModeChange = prevProps.countryMode !== countryMode;
        const countriesChange = prevProps.countries.length !== countries.length;
        if (
            mapTypeChange ||
            yearChange ||
            countryChange ||
            insecticideChange ||
            insecticideTypesChange ||
            typeChange ||
            speciesChange ||
            assayTypesChange ||
            synergistTypesChange ||
            countryModeChange ||
            countriesChange
        ) {
            if (this.popup) {
                this.popup.remove();
            }
            this.filterSource();
            this.applyMapTypeSymbols();
        }
    }
    loadStudiesIfRequired() {
        const { theme, studies, studiesLoading, studiesError } = this.props;

        const required = theme === PREVENTION && studies.length === 0 && !studiesLoading && !studiesError;

        if (required) {
            this.props.fetchPreventionStudies();
        }
    }

    componentWillUnmount() {
        if (this.props.map.getLayer(PREVENTION_LAYER_ID)) {
            this.props.map.setLayoutProperty(PREVENTION_LAYER_ID, "visibility", "none");
        }
    }

    setupGeoJsonData = (studies: any[]) => {
        const { mapType } = this.props.preventionFilters;
        const groupedStudies = R.groupBy(
            R.path<string>(["SITE_ID"]),
            studies
        );
        const filteredStudies = R.values(groupedStudies).map(group => studySelector(group, mapType));

        return filteredStudies.map(study => {
            const percentage = parseFloat(study["MORTALITY_ADJUSTED"]);
            return {
                ...study,
                CONFIRMATION_STATUS: resolveResistanceStatus(percentage),
            };
        });
    };

    buildFilters = () => {
        const { preventionFilters, filters, region } = this.props;
        return buildPreventionFilters(preventionFilters, filters, region);
    };

    filterStudies = (studies: PreventionStudy[]) => {
        const filters = this.buildFilters();
        return filters.reduce((studies, filter) => studies.filter(filter), studies);
    };

    filterSource = () => {
        const { studies, countryMode } = this.props;
        const source = this.props.map.getSource(PREVENTION_SOURCE_ID);
        if (source) {
            const filteredStudies = this.filterStudies(studies);
            this.props.setFilteredStudies(filteredStudies);
            const geoStudies = this.setupGeoJsonData(filteredStudies);
            const countryStudies = this.getCountryStudies(filteredStudies);
            const data = countryMode ? countryStudies : geoStudies;
            source.setData(studiesToGeoJson(data));
        }
    };

    getCountryStudies = (studies: any[] = []) => {
        const countryStudies = R.groupBy(
            R.path<string>(["ISO2"]),
            studies
        );
        const countries = this.props.countries
            .map((country, index) => ({
                ...country,
                OBJECTID: index,
                Latitude: country.CENTER_LAT,
                Longitude: country.CENTER_LON,
                STUDIES: (countryStudies[country.ISO_2_CODE] || []).length || 0,
            }))
            .filter(study => study.STUDIES !== 0);

        const sortedCountries = R.sortBy(country => country.STUDIES, countries);
        if (sortedCountries.length === 0) return [];

        const getSize = (nStudies: number) => {
            if (nStudies > 50) {
                return 15;
            } else if (nStudies > 40) {
                return 12.5;
            } else if (nStudies > 30) {
                return 10;
            } else if (nStudies > 15) {
                return 7.5;
            } else if (nStudies >= 0) {
                return 5;
            }
        };

        return countries.map(country => ({
            ...country,
            SIZE: getSize(country.STUDIES),
            SIZE_HOVER: getSize(country.STUDIES) - 1,
        }));
    };

    mountLayer(prevProps?: Props) {
        const { studies, preventionFilters, countryMode } = this.props;
        if (!prevProps || (prevProps.studies.length !== studies.length && studies.length)) {
            if (this.props.map.getSource(PREVENTION_SOURCE_ID)) {
                this.props.map.removeLayer(PREVENTION_LAYER_ID);
                this.props.map.removeSource(PREVENTION_SOURCE_ID);
            }
            const filteredStudies = this.filterStudies(studies);
            this.props.setFilteredStudies(filteredStudies);
            const geoStudies = this.setupGeoJsonData(filteredStudies);
            const countryStudies = this.getCountryStudies(filteredStudies);

            const data = countryMode ? countryStudies : geoStudies;
            const source: any = {
                type: "geojson",
                data: studiesToGeoJson(data),
            };
            this.props.map.addSource(PREVENTION_SOURCE_ID, source);
            this.props.map.addLayer(layer(resolveMapTypeSymbols(preventionFilters, countryMode)));

            setupEffects(this.props.map, PREVENTION_SOURCE_ID, PREVENTION_LAYER_ID);
            this.setupPopover();
            this.renderLayer();
        }
    }

    onClickListener = (e: any, _a: any) => {
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
        this.props.map.off("click", PREVENTION_LAYER_ID, this.onClickListener);
        this.props.map.on("click", PREVENTION_LAYER_ID, this.onClickListener);
    };

    renderLayer = () => {
        if (!this.props.map) {
            return;
        }
        if (this.props.map.getLayer(PREVENTION_LAYER_ID)) {
            if (this.props.theme === PREVENTION) {
                this.props.map.setLayoutProperty(PREVENTION_LAYER_ID, "visibility", "visible");
            } else {
                this.props.map.setLayoutProperty(PREVENTION_LAYER_ID, "visibility", "none");
            }
        }
    };

    applyMapTypeSymbols = () => {
        const { preventionFilters, countryMode } = this.props;
        const layer = this.props.map.getLayer(PREVENTION_LAYER_ID);
        const mapTypeSymbols = resolveMapTypeSymbols(preventionFilters, countryMode);
        if (layer && mapTypeSymbols) {
            this.props.map.setPaintProperty(PREVENTION_LAYER_ID, "circle-radius", mapTypeSymbols["circle-radius"]);
            this.props.map.setPaintProperty(PREVENTION_LAYER_ID, "circle-color", mapTypeSymbols["circle-color"]);
            this.props.map.setPaintProperty(
                PREVENTION_LAYER_ID,
                "circle-stroke-color",
                mapTypeSymbols["circle-stroke-color"]
            );
        }
    };

    render() {
        const { studies, countryMode, selection } = this.props;
        if (selection === null) {
            return <div />;
        }
        const filteredStudies = this.filterStudies(studies).filter(study =>
            countryMode ? study.ISO2 === selection.ISO_2_CODE : study.SITE_ID === selection.SITE_ID
        );
        if (filteredStudies.length === 0) {
            return <div />;
        }
        return (
            this.props.theme === "prevention" && (
                <>
                    <Hidden xsDown>
                        <PreventionSitePopover map={this.props.map} studies={filteredStudies} />
                    </Hidden>
                    <Hidden smUp>
                        <ChartModal selection={selection}>
                            <PreventionSelectionChart studies={filteredStudies} />
                        </ChartModal>
                    </Hidden>
                </>
            )
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(PreventionLayer);
