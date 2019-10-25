import React, {Component} from "react";
import {connect, Provider} from "react-redux";
import {studiesToGeoJson} from "./layer-utils";
import setupEffects from "./effects";
import {selectTreatmentFilters, selectTreatmentStudies} from "../../store/reducers/treatment-reducer";
import {selectCountryMode, selectFilters, selectRegion, selectTheme} from "../../store/reducers/base-reducer";
import {selectCountries} from "../../store/reducers/country-layer-reducer";
import mapboxgl from "mapbox-gl";
import * as R from "ramda";
import {filterByResistanceStatus} from "./studies-filters";
import {TreatmentStudy} from "../../types/Treatment";
import ReactDOM from "react-dom";
import {I18nextProvider} from "react-i18next";
import i18next from "i18next";
import {store, theme} from "../../App";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import {State, TreatmentMapType} from "../../store/types";
import {resolveMapTypeSymbols} from "./treatment/utils";

const TREATMENT = "treatment";
const TREATMENT_LAYER_ID = "treatment-layer";
const TREATMENT_SOURCE_ID = "treatment-source";

const circleLayout = {
  visibility: "visible"
};

const layer: any = (symbols: any) => ({
  id: TREATMENT_LAYER_ID,
  type: "circle",
  layout: circleLayout,
  paint: symbols,
  source: TREATMENT_SOURCE_ID
});

const mapStateToProps = (state: State) => ({
  studies: selectTreatmentStudies(state),
  theme: selectTheme(state),
  filters: selectFilters(state),
  treatmentFilters: selectTreatmentFilters(state),
  region: selectRegion(state),
  countries: selectCountries(state),
  countryMode: selectCountryMode(state)
});

type StateProps = ReturnType<typeof mapStateToProps>;
type OwnProps = {
  map: any;
};
type Props = StateProps & OwnProps;

class TreatmentLayer extends Component<Props> {
  popup: mapboxgl.Popup;
  componentDidMount() {
    this.mountLayer();
  }

  componentDidUpdate(prevProps: Props) {
    const {
      treatmentFilters: { mapType },
      countryMode,
      filters,
      region,
      countries
    } = this.props;
    this.mountLayer(prevProps);
    this.renderLayer();
    const mapTypeChange = prevProps.treatmentFilters.mapType !== mapType;
    const yearChange =
      prevProps.filters[0] !== filters[0] ||
      prevProps.filters[1] !== filters[1];
    const countryChange = prevProps.region.country !== region.country;
    const countryModeChange = prevProps.countryMode !== countryMode;
    const countriesChange = prevProps.countries.length !== countries.length;
    if (
      mapTypeChange ||
      yearChange ||
      countryChange ||
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

  componentWillUnmount() {
    this.renderLayer();
  }

  setupGeoJsonData = (studies: any[]) => {
    const { mapType } = this.props.treatmentFilters;
    const groupedStudies = R.groupBy(R.path(["SITE_ID"]), studies);
    const filteredStudies = R.values(groupedStudies).map(group => group[0]);
    return filteredStudies;
  };

  buildFilters = () => {
    const { treatmentFilters, filters, region } = this.props;
    switch (treatmentFilters.mapType) {
      case TreatmentMapType.RESISTANCE_STATUS:
        return [];
      default:
        return [filterByResistanceStatus];
    }
  };

  filterStudies = (studies: TreatmentStudy[]) => {
    const filters = this.buildFilters();
    return filters.reduce((studies, filter) => studies.filter(filter), studies);
  };

  filterSource = () => {
    const { studies, countryMode } = this.props;
    const source = this.props.map.getSource(TREATMENT_SOURCE_ID);
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
    const { studies, treatmentFilters, countryMode } = this.props;
    if (
      !prevProps ||
      (prevProps.studies.length !== studies.length && studies.length)
    ) {
      if (this.props.map.getSource(TREATMENT_SOURCE_ID)) {
        this.props.map.removeLayer(TREATMENT_LAYER_ID);
        this.props.map.removeSource(TREATMENT_SOURCE_ID);
      }
      const filteredStudies = this.filterStudies(studies);
      const geoStudies = this.setupGeoJsonData(filteredStudies);
      const countryStudies = this.getCountryStudies(filteredStudies);

      const data = countryMode ? countryStudies : geoStudies;
      const source: any = {
        type: "geojson",
        data: studiesToGeoJson(data)
      };
      this.props.map.addSource(TREATMENT_SOURCE_ID, source);
      this.props.map.addLayer(
        layer(resolveMapTypeSymbols(treatmentFilters, countryMode))
      );

      setupEffects(this.props.map, TREATMENT_SOURCE_ID, TREATMENT_LAYER_ID);
      this.setupPopover();
      this.renderLayer();
    }
  }

  onClickListener = (e: any, a: any) => {
    const placeholder = document.createElement("div");
    const {
      studies,
      countryMode,
      treatmentFilters: { mapType }
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
          <Provider store={store} />
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
    this.props.map.off("click", TREATMENT_LAYER_ID, this.onClickListener);
    this.props.map.on("click", TREATMENT_LAYER_ID, this.onClickListener);
  };

  renderLayer = () => {
    if (this.props.map.getLayer(TREATMENT_LAYER_ID)) {
      if (this.props.theme === TREATMENT) {
        this.props.map.setLayoutProperty(
          TREATMENT_LAYER_ID,
          "visibility",
          "visible"
        );
      } else {
        this.props.map.setLayoutProperty(
          TREATMENT_LAYER_ID,
          "visibility",
          "none"
        );
      }
    }
  };

  applyMapTypeSymbols = () => {
    const { treatmentFilters, countryMode } = this.props;
    const layer = this.props.map.getLayer(TREATMENT_LAYER_ID);
    const mapTypeSymbols = resolveMapTypeSymbols(treatmentFilters, countryMode);
    if (layer && mapTypeSymbols) {
      this.props.map.setPaintProperty(
        TREATMENT_LAYER_ID,
        "circle-radius",
        mapTypeSymbols["circle-radius"]
      );
      this.props.map.setPaintProperty(
        TREATMENT_LAYER_ID,
        "circle-color",
        mapTypeSymbols["circle-color"]
      );
      this.props.map.setPaintProperty(
        TREATMENT_LAYER_ID,
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
)(TreatmentLayer);
