import React, { Component } from "react";
import { connect } from "react-redux";
import { InvasiveMapType, State } from "../../../store/types";
import { studiesToGeoJson } from "../layer-utils";
import setupEffects from "../effects";
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
import { filterByRegion, filterByVectorSpecies, filterByYearRange } from "../studies-filters";
import { resolveMapTypeSymbols, studySelector } from "./utils";
import {
    selectInvasiveFilters,
    selectInvasiveStudies,
    selectInvasiveStudiesLoading,
    selectInvasiveStudiesError,
} from "../../../store/reducers/invasive-reducer";
import { setInvasiveFilteredStudiesAction } from "../../../store/actions/invasive-actions";
import { Hidden } from "@material-ui/core";
import InvasiveSitePopover from "./InvasiveSitePopover";
import ChartModal from "../../ChartModal";
import InvasiveSelectionChart from "./InvasiveSelectionChart";
import { setSelection } from "../../../store/actions/base-actions";
import { fetchInvasiveStudiesRequest } from "../../../store/actions/invasive-actions";
import { InvasiveStudy } from "../../../../domain/entities/InvasiveStudy";

const INVASIVE = "invasive";
const INVASIVE_LAYER_ID = "invasive-layer";
const INVASIVE_SOURCE_ID = "invasive-source";

const circleLayout = {
    visibility: "visible",
};

const layer: any = (symbols: any) => ({
    id: INVASIVE_LAYER_ID,
    type: "circle",
    layout: circleLayout,
    paint: symbols,
    source: INVASIVE_SOURCE_ID,
});

const mapStateToProps = (state: State) => ({
    studies: selectInvasiveStudies(state),
    studiesLoading: selectInvasiveStudiesLoading(state),
    studiesError: selectInvasiveStudiesError(state),
    theme: selectTheme(state),
    filters: selectFilters(state),
    invasiveFilters: selectInvasiveFilters(state),
    region: selectRegion(state),
    countries: selectCountries(state),
    countryMode: selectCountryMode(state),
    selection: selectSelection(state),
});

const mapDispatchToProps = {
    fetchInvasiveStudies: fetchInvasiveStudiesRequest,
    setFilteredStudies: setInvasiveFilteredStudiesAction,
    setSelection: setSelection,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

type OwnProps = {
    map: any;
};
type Props = StateProps & OwnProps & DispatchProps;

class InvasiveLayer extends Component<Props> {
    popup: mapboxgl.Popup;
    componentDidMount() {
        this.loadStudiesIfRequired();
        this.mountLayer();
    }

    componentDidUpdate(prevProps: Props) {
        this.loadStudiesIfRequired();

        const {
            invasiveFilters: { mapType, vectorSpecies },
            countryMode,
            filters,
            region,
            countries,
        } = this.props;

        this.mountLayer(prevProps);
        this.renderLayer();
        const mapTypeChange = prevProps.invasiveFilters.mapType !== mapType;
        const yearChange = prevProps.filters[0] !== filters[0] || prevProps.filters[1] !== filters[1];
        const countryChange = prevProps.region !== region;
        const countryModeChange = prevProps.countryMode !== countryMode;
        const countriesChange = prevProps.countries.length !== countries.length;
        const speciesChange = prevProps.invasiveFilters.vectorSpecies.length !== vectorSpecies.length;
        if (mapTypeChange || yearChange || countryChange || countryModeChange || countriesChange || speciesChange) {
            if (this.popup) {
                this.popup.remove();
            }
            this.filterSource();
            this.applyMapTypeSymbols();
        }
    }

    loadStudiesIfRequired() {
        const { theme, studies, studiesLoading, studiesError } = this.props;

        const required = theme === INVASIVE && studies.length === 0 && !studiesLoading && !studiesError;

        if (required) {
            this.props.fetchInvasiveStudies();
        }
    }

    componentWillUnmount() {
        this.renderLayer();
    }

    setupGeoJsonData = (studies: any[]) => {
        const { mapType } = this.props.invasiveFilters;
        const groupedStudies = R.groupBy(R.path<string>(["SITE_ID"]), studies);
        const filteredStudies = R.values(groupedStudies).map(group => studySelector(group, mapType));
        return filteredStudies;
    };

    buildFilters = () => {
        const { invasiveFilters, filters, region } = this.props;
        switch (invasiveFilters.mapType) {
            case InvasiveMapType.VECTOR_OCCURANCE:
                return [
                    filterByVectorSpecies(invasiveFilters.vectorSpecies),
                    filterByYearRange(filters, true),
                    filterByRegion(region),
                ];
            default:
                return [filterByRegion(region)];
        }
    };

    filterStudies = (studies: InvasiveStudy[]) => {
        const filters = this.buildFilters();
        return filters.reduce((studies, filter) => studies.filter(filter), studies);
    };

    filterSource = () => {
        const { studies, countryMode } = this.props;
        const source = this.props.map.getSource(INVASIVE_SOURCE_ID);
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
        const countryStudies = R.groupBy(R.path<string>(["ISO2"]), studies);
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
        const { studies, countryMode } = this.props;
        if (!prevProps || (prevProps.studies.length !== studies.length && studies.length)) {
            if (this.props.map.getSource(INVASIVE_SOURCE_ID)) {
                this.props.map.removeLayer(INVASIVE_LAYER_ID);
                this.props.map.removeSource(INVASIVE_SOURCE_ID);
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
            this.props.map.addSource(INVASIVE_SOURCE_ID, source);
            this.props.map.addLayer(layer(resolveMapTypeSymbols()));

            setupEffects(this.props.map, INVASIVE_SOURCE_ID, INVASIVE_LAYER_ID);
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
        this.props.map.off("click", INVASIVE_LAYER_ID, this.onClickListener);
        this.props.map.on("click", INVASIVE_LAYER_ID, this.onClickListener);
    };

    renderLayer = () => {
        if (this.props.map.getLayer(INVASIVE_LAYER_ID)) {
            if (this.props.theme === INVASIVE) {
                this.props.map.setLayoutProperty(INVASIVE_LAYER_ID, "visibility", "visible");
            } else {
                this.props.map.setLayoutProperty(INVASIVE_LAYER_ID, "visibility", "none");
            }
        }
    };

    applyMapTypeSymbols = () => {
        const layer = this.props.map.getLayer(INVASIVE_LAYER_ID);
        const mapTypeSymbols = resolveMapTypeSymbols();
        if (layer && mapTypeSymbols) {
            this.props.map.setPaintProperty(INVASIVE_LAYER_ID, "circle-radius", mapTypeSymbols["circle-radius"]);
            this.props.map.setPaintProperty(INVASIVE_LAYER_ID, "circle-color", mapTypeSymbols["circle-color"]);
            this.props.map.setPaintProperty(
                INVASIVE_LAYER_ID,
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
            this.props.theme === "invasive" && (
                <>
                    <Hidden xsDown>
                        <InvasiveSitePopover map={this.props.map} studies={filteredStudies} />
                    </Hidden>
                    <Hidden smUp>
                        <ChartModal selection={selection}>
                            <InvasiveSelectionChart studies={filteredStudies} />
                        </ChartModal>
                    </Hidden>
                </>
            )
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(InvasiveLayer);
