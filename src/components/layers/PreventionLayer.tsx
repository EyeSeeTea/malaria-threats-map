import React, { Component } from "react";
import { connect, Provider } from "react-redux";
import { PreventionMapType, State } from "../../store/types";
import { studiesToGeoJson } from "./layer-utils";
import setupEffects from "./effects";
import * as R from "ramda";
import resistanceStatusSymbols from "./prevention/ResistanceStatus/symbols";
import { resolveResistanceStatus } from "./prevention/ResistanceStatus/utils";
import { PreventionStudy } from "../../types/Prevention";
import {
  filterByAssayTypes,
  filterByCountry,
  filterByInsecticideClass,
  filterByInsecticideTypes,
  filterByIntensityStatus,
  filterByLevelOfInvolvement,
  filterByResistanceMechanism,
  filterByResistanceStatus,
  filterBySpecies,
  filterByType,
  filterByTypeSynergist,
  filterByYearRange
} from "./studies-filters";
import { resolveMapTypeSymbols, studySelector } from "./prevention/utils";
import {
  selectPreventionFilters,
  selectPreventionStudies
} from "../../store/reducers/prevention-reducer";
import {
  selectCountryMode,
  selectFilters,
  selectRegion,
  selectTheme
} from "../../store/reducers/base-reducer";
import ReactDOM from "react-dom";
import { store, theme } from "../../App";
import mapboxgl from "mapbox-gl";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import { isSynergyst } from "./prevention/ResistanceMechanisms/ResistanceMechanismFilters";
import { selectCountries } from "../../store/reducers/country-layer-reducer";
import { ThemeProvider } from "@material-ui/styles";
import ResistanceStatusCountryChart from "./prevention/ResistanceStatus/ResistanceStatusCountryChart";
import ResistanceStatusChart from "./prevention/ResistanceStatus/ResistanceStatusChart";
import IntensityStatusCountryChart from "./prevention/IntensityStatus/IntensityStatusCountryChart";
import ResistanceMechanismCountryChart from "./prevention/ResistanceMechanisms/ResistanceMechanismCountryChart";
import ResistanceMechanismsChart from "./prevention/ResistanceMechanisms/ResistanceMechanismsChart";

const PREVENTION = "prevention";
const PREVENTION_LAYER_ID = "prevention-layer";
const PREVENTION_SOURCE_ID = "prevention-source";

const circleLayout = {
  visibility: "visible"
};

const layer: any = (symbols: any) => ({
  id: PREVENTION_LAYER_ID,
  type: "circle",
  layout: circleLayout,
  paint: symbols || resistanceStatusSymbols,
  source: PREVENTION_SOURCE_ID
});

const mapStateToProps = (state: State) => ({
  studies: selectPreventionStudies(state),
  theme: selectTheme(state),
  filters: selectFilters(state),
  preventionFilters: selectPreventionFilters(state),
  region: selectRegion(state),
  countries: selectCountries(state),
  countryMode: selectCountryMode(state)
});

type StateProps = ReturnType<typeof mapStateToProps>;
type OwnProps = {
  map: any;
};
type Props = StateProps & OwnProps;

class PreventionLayer extends Component<Props> {
  popup: mapboxgl.Popup;
  componentDidMount() {
    this.mountLayer();
  }

  componentDidUpdate(prevProps: Props) {
    const {
      preventionFilters: {
        mapType,
        insecticideClass,
        insecticideTypes,
        type,
        species,
        assayTypes,
        synergistTypes
      },
      countryMode,
      filters,
      region
    } = this.props;
    this.mountLayer(prevProps);
    this.renderLayer();
    const mapTypeChange = prevProps.preventionFilters.mapType !== mapType;
    const yearChange =
      prevProps.filters[0] !== filters[0] ||
      prevProps.filters[1] !== filters[1];
    const countryChange = prevProps.region.country !== region.country;
    const insecticideChange =
      prevProps.preventionFilters.insecticideClass !== insecticideClass;
    const insecticideTypesChange =
      prevProps.preventionFilters.insecticideTypes.length !==
      insecticideTypes.length;
    const typeChange = prevProps.preventionFilters.type !== type;
    const speciesChange =
      prevProps.preventionFilters.species.length !== species.length;
    const assayTypesChange =
      prevProps.preventionFilters.assayTypes.length !== assayTypes.length;
    const synergistTypesChange =
      prevProps.preventionFilters.synergistTypes.length !==
      synergistTypes.length;
    const countryModeChange = prevProps.countryMode !== countryMode;
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
      countryModeChange
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
    const { mapType } = this.props.preventionFilters;
    const groupedStudies = R.groupBy(R.path(["SITE_ID"]), studies);
    const filteredStudies = R.values(groupedStudies).map(group =>
      studySelector(group, mapType)
    );

    return filteredStudies.map(study => {
      const percentage = parseFloat(study["MORTALITY_ADJUSTED"]);
      return {
        ...study,
        CONFIRMATION_STATUS: resolveResistanceStatus(percentage)
      };
    });
  };

  buildFilters = () => {
    const { preventionFilters, filters, region } = this.props;
    switch (preventionFilters.mapType) {
      case PreventionMapType.RESISTANCE_STATUS:
        return [
          filterByResistanceStatus,
          filterByInsecticideClass(preventionFilters.insecticideClass),
          filterByInsecticideTypes(preventionFilters.insecticideTypes),
          filterByType(preventionFilters.type),
          filterBySpecies(preventionFilters.species),
          filterByYearRange(filters),
          filterByCountry(region.country)
        ];
      case PreventionMapType.INTENSITY_STATUS:
        return [
          filterByIntensityStatus,
          filterByYearRange(filters),
          filterByCountry(region.country)
        ];
      case PreventionMapType.RESISTANCE_MECHANISM:
        const base = [
          filterByResistanceMechanism,
          filterByType(preventionFilters.type),
          filterBySpecies(preventionFilters.species),
          filterByAssayTypes(preventionFilters.assayTypes),
          filterByYearRange(filters),
          filterByCountry(region.country)
        ];
        return isSynergyst(preventionFilters)
          ? [...base, filterByTypeSynergist(preventionFilters.synergistTypes)]
          : base;
      case PreventionMapType.LEVEL_OF_INVOLVEMENT:
        return [
          filterByLevelOfInvolvement,
          filterByType(preventionFilters.type),
          filterByTypeSynergist(preventionFilters.synergistTypes),
          filterByYearRange(filters),
          filterByCountry(region.country)
        ];
      case PreventionMapType.PBO_DEPLOYMENT:
        return [filterByCountry(region.country)];
      default:
        return [];
    }
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
    const maxSize = sortedCountries[sortedCountries.length - 1].STUDIES;
    const minSize = sortedCountries[0].STUDIES;

    const ratio = (20 - 5) / (maxSize - minSize);

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
    const { studies, preventionFilters, countryMode } = this.props;
    if (
      !prevProps ||
      (prevProps.studies.length !== studies.length && studies.length)
    ) {
      if (this.props.map.getSource(PREVENTION_SOURCE_ID)) {
        this.props.map.removeLayer(PREVENTION_LAYER_ID);
        this.props.map.removeSource(PREVENTION_SOURCE_ID);
      }
      const filteredStudies = this.filterStudies(studies);

      const geoStudies = this.setupGeoJsonData(filteredStudies);
      const countryStudies = this.getCountryStudies(filteredStudies);

      const data = countryMode ? countryStudies : geoStudies;
      const source: any = {
        type: "geojson",
        data: studiesToGeoJson(data)
      };
      this.props.map.addSource(PREVENTION_SOURCE_ID, source);
      this.props.map.addLayer(
        layer(resolveMapTypeSymbols(preventionFilters, countryMode))
      );

      setupEffects(this.props.map, PREVENTION_SOURCE_ID, PREVENTION_LAYER_ID);
      this.setupPopover();
      this.renderLayer();
    }
  }

  onClickListener = (e: any, a: any) => {
    const placeholder = document.createElement("div");
    const {
      studies,
      countryMode,
      preventionFilters: { mapType }
    } = this.props;
    const filteredStudies = this.filterStudies(studies).filter(
      study =>
        countryMode
          ? study.ISO2 === e.features[0].properties.ISO_2_CODE
          : study.SITE_ID === e.features[0].properties.SITE_ID
    );

    ReactDOM.render(
      <I18nextProvider i18n={i18next}>
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            {countryMode &&
              mapType === PreventionMapType.RESISTANCE_STATUS && (
                <ResistanceStatusCountryChart studies={filteredStudies} />
              )}
            {countryMode &&
              mapType === PreventionMapType.INTENSITY_STATUS && (
                <IntensityStatusCountryChart studies={filteredStudies} />
              )}
            {countryMode &&
              mapType === PreventionMapType.RESISTANCE_MECHANISM && (
                <ResistanceMechanismCountryChart studies={filteredStudies} />
              )}
            {countryMode &&
              mapType === PreventionMapType.LEVEL_OF_INVOLVEMENT && (
                <ResistanceMechanismCountryChart studies={filteredStudies} />
              )}
            {!countryMode &&
              mapType === PreventionMapType.RESISTANCE_STATUS && (
                <ResistanceStatusChart studies={filteredStudies} />
              )}
            {!countryMode &&
              mapType === PreventionMapType.INTENSITY_STATUS && (
                <ResistanceStatusChart studies={filteredStudies} />
              )}
            {!countryMode &&
              mapType === PreventionMapType.RESISTANCE_MECHANISM && (
                <ResistanceMechanismsChart studies={filteredStudies} />
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
    this.props.map.off("click", PREVENTION_LAYER_ID, this.onClickListener);
    this.props.map.on("click", PREVENTION_LAYER_ID, this.onClickListener);
  };

  renderLayer = () => {
    if (this.props.map.getLayer(PREVENTION_LAYER_ID)) {
      if (this.props.theme === PREVENTION) {
        this.props.map.setLayoutProperty(
          PREVENTION_LAYER_ID,
          "visibility",
          "visible"
        );
      } else {
        this.props.map.setLayoutProperty(
          PREVENTION_LAYER_ID,
          "visibility",
          "none"
        );
      }
    }
  };

  applyMapTypeSymbols = () => {
    const { preventionFilters, countryMode } = this.props;
    const layer = this.props.map.getLayer(PREVENTION_LAYER_ID);
    const mapTypeSymbols = resolveMapTypeSymbols(
      preventionFilters,
      countryMode
    );
    if (layer && mapTypeSymbols) {
      this.props.map.setPaintProperty(
        PREVENTION_LAYER_ID,
        "circle-radius",
        mapTypeSymbols["circle-radius"]
      );
      this.props.map.setPaintProperty(
        PREVENTION_LAYER_ID,
        "circle-color",
        mapTypeSymbols["circle-color"]
      );
      this.props.map.setPaintProperty(
        PREVENTION_LAYER_ID,
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
)(PreventionLayer);
