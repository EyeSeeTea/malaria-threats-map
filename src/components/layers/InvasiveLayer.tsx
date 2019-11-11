import React, { Component } from "react";
import { connect, Provider } from "react-redux";
import { InvasiveMapType, State } from "../../store/types";
import { studiesToGeoJson } from "./layer-utils";
import setupEffects from "./effects";
import {
  selectCountryMode,
  selectFilters,
  selectRegion,
  selectTheme
} from "../../store/reducers/base-reducer";
import { selectCountries } from "../../store/reducers/country-layer-reducer";
import mapboxgl from "mapbox-gl";
import * as R from "ramda";
import {
  filterByCountry,
  filterByVectorSpecies,
  filterByYearRange
} from "./studies-filters";
import { InvasiveStudy } from "../../types/Invasive";
import { resolveMapTypeSymbols, studySelector } from "./invasive/utils";
import ReactDOM from "react-dom";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import { store, theme } from "../../App";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import {
  selectInvasiveFilters,
  selectInvasiveStudies
} from "../../store/reducers/invasive-reducer";
import VectorOccurrenceChart from "./invasive/VectorOccurance/VectorOccurranceChart";

const INVASIVE = "invasive";
const INVASIVE_LAYER_ID = "invasive-layer";
const INVASIVE_SOURCE_ID = "invasive-source";

const circleLayout = {
  visibility: "visible"
};

const layer: any = (symbols: any) => ({
  id: INVASIVE_LAYER_ID,
  type: "circle",
  layout: circleLayout,
  paint: symbols,
  source: INVASIVE_SOURCE_ID
});

const mapStateToProps = (state: State) => ({
  studies: selectInvasiveStudies(state),
  theme: selectTheme(state),
  filters: selectFilters(state),
  invasiveFilters: selectInvasiveFilters(state),
  region: selectRegion(state),
  countries: selectCountries(state),
  countryMode: selectCountryMode(state)
});

type StateProps = ReturnType<typeof mapStateToProps>;
type OwnProps = {
  map: any;
};
type Props = StateProps & OwnProps;

class InvasiveLayer extends Component<Props> {
  popup: mapboxgl.Popup;
  componentDidMount() {
    this.mountLayer();
  }

  componentDidUpdate(prevProps: Props) {
    const {
      invasiveFilters: { mapType, vectorSpecies },
      countryMode,
      filters,
      region,
      countries
    } = this.props;
    this.mountLayer(prevProps);
    this.renderLayer();
    const mapTypeChange = prevProps.invasiveFilters.mapType !== mapType;
    const yearChange =
      prevProps.filters[0] !== filters[0] ||
      prevProps.filters[1] !== filters[1];
    const countryChange = prevProps.region.country !== region.country;
    const countryModeChange = prevProps.countryMode !== countryMode;
    const countriesChange = prevProps.countries.length !== countries.length;
    const speciesChange =
      prevProps.invasiveFilters.vectorSpecies.length !== vectorSpecies.length;
    if (
      mapTypeChange ||
      yearChange ||
      countryChange ||
      countryModeChange ||
      countriesChange ||
      speciesChange
    ) {
      if (this.popup) {
        this.popup.remove();
      }
      this.filterSource();
      this.applyMapTypeSymbols();
    }
  }

  componentWillUnmount() {
    this.renderLayer();
  }

  setupGeoJsonData = (studies: any[]) => {
    const { mapType } = this.props.invasiveFilters;
    const groupedStudies = R.groupBy(R.path(["SITE_ID"]), studies);
    const filteredStudies = R.values(groupedStudies).map(group =>
      studySelector(group, mapType)
    );
    return filteredStudies;
  };

  buildFilters = () => {
    const { invasiveFilters, filters, region } = this.props;
    switch (invasiveFilters.mapType) {
      case InvasiveMapType.VECTOR_OCCURANCE:
        return [
          filterByVectorSpecies(invasiveFilters.vectorSpecies),
          filterByYearRange(filters, true),
          filterByCountry(region.country)
        ];
      default:
        return [filterByCountry(region.country)];
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
      const geoStudies = this.setupGeoJsonData(filteredStudies);
      const countryStudies = this.getCountryStudies(filteredStudies);
      const data = countryMode ? countryStudies : geoStudies;
      source.setData(studiesToGeoJson(data));
    }
  };

  getCountryStudies = (studies: any[] = []) => {
    const countryStudies = R.groupBy(R.path(["ISO2"]), studies);
    const countries = this.props.countries
      .map((country, index) => ({
        ...country,
        OBJECTID: index,
        Latitude: country.CENTER_LAT,
        Longitude: country.CENTER_LON,
        STUDIES: (countryStudies[country.ISO_2_CODE] || []).length || 0
      }))
      .filter(study => study.STUDIES !== 0);

    const sortedCountries = R.sortBy(country => country.STUDIES, countries);
    if (sortedCountries.length === 0) return [];
    // const maxSize = sortedCountries[sortedCountries.length - 1].STUDIES;
    // const minSize = sortedCountries[0].STUDIES;
    //
    // const ratio = (20 - 5) / (maxSize - minSize);

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
      // SIZE: 5 + ratio * (country.STUDIES - minSize),
      // SIZE_HOVER: 5 + ratio * (country.STUDIES - minSize)
      SIZE: getSize(country.STUDIES),
      SIZE_HOVER: getSize(country.STUDIES) - 1
    }));
  };

  mountLayer(prevProps?: Props) {
    const { studies, countryMode } = this.props;
    if (
      !prevProps ||
      (prevProps.studies.length !== studies.length && studies.length)
    ) {
      if (this.props.map.getSource(INVASIVE_SOURCE_ID)) {
        this.props.map.removeLayer(INVASIVE_LAYER_ID);
        this.props.map.removeSource(INVASIVE_SOURCE_ID);
      }
      const filteredStudies = this.filterStudies(studies);
      const geoStudies = this.setupGeoJsonData(filteredStudies);
      const countryStudies = this.getCountryStudies(filteredStudies);

      const data = countryMode ? countryStudies : geoStudies;
      const source: any = {
        type: "geojson",
        data: studiesToGeoJson(data)
      };
      this.props.map.addSource(INVASIVE_SOURCE_ID, source);
      this.props.map.addLayer(layer(resolveMapTypeSymbols()));

      setupEffects(this.props.map, INVASIVE_SOURCE_ID, INVASIVE_LAYER_ID);
      this.setupPopover();
      this.renderLayer();
    }
  }

  onClickListener = (e: any, a: any) => {
    const placeholder = document.createElement("div");
    const {
      studies,
      countryMode,
      invasiveFilters: { mapType }
    } = this.props;
    const filteredStudies = this.filterStudies(studies).filter(
      study => study.SITE_ID === e.features[0].properties.SITE_ID
    );

    ReactDOM.render(
      <I18nextProvider i18n={i18next}>
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            {!countryMode && mapType === InvasiveMapType.VECTOR_OCCURANCE && (
              <VectorOccurrenceChart studies={filteredStudies} />
            )}
          </Provider>
        </ThemeProvider>
      </I18nextProvider>,
      placeholder
    );
    const coordinates = e.features[0].geometry.coordinates.slice();
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    this.popup = new mapboxgl.Popup()
      .setLngLat(coordinates)
      .setDOMContent(placeholder)
      .addTo(this.props.map);
  };

  setupPopover = () => {
    this.props.map.off("click", INVASIVE_LAYER_ID, this.onClickListener);
    this.props.map.on("click", INVASIVE_LAYER_ID, this.onClickListener);
  };

  renderLayer = () => {
    if (this.props.map.getLayer(INVASIVE_LAYER_ID)) {
      if (this.props.theme === INVASIVE) {
        this.props.map.setLayoutProperty(
          INVASIVE_LAYER_ID,
          "visibility",
          "visible"
        );
      } else {
        this.props.map.setLayoutProperty(
          INVASIVE_LAYER_ID,
          "visibility",
          "none"
        );
      }
    }
  };

  applyMapTypeSymbols = () => {
    const layer = this.props.map.getLayer(INVASIVE_LAYER_ID);
    const mapTypeSymbols = resolveMapTypeSymbols();
    if (layer && mapTypeSymbols) {
      this.props.map.setPaintProperty(
        INVASIVE_LAYER_ID,
        "circle-radius",
        mapTypeSymbols["circle-radius"]
      );
      this.props.map.setPaintProperty(
        INVASIVE_LAYER_ID,
        "circle-color",
        mapTypeSymbols["circle-color"]
      );
      this.props.map.setPaintProperty(
        INVASIVE_LAYER_ID,
        "circle-stroke-color",
        mapTypeSymbols["circle-stroke-color"]
      );
    }
  };

  render() {
    return <div />;
  }
}
export default connect(
  mapStateToProps,
  null
)(InvasiveLayer);
