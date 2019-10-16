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
import { resolveMapTypeSymbols } from "./prevention/utils";
import {
  selectPreventionFilters,
  selectPreventionStudies
} from "../../store/reducers/prevention-reducer";
import {
  selectFilters,
  selectRegion,
  selectTheme
} from "../../store/reducers/base-reducer";
import ReactDOM from "react-dom";
import { store } from "../../App";
import Chart from "../Chart";
import mapboxgl from "mapbox-gl";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import { isSynergyst } from "./prevention/ResistanceMechanisms/ResistanceMechanismFilters";

const PREVENTION = "prevention";
const PREVENTION_LAYER_ID = "prevention-layer";
const PREVENTION_SOURCE_ID = "prevention-source";

const circleLayout = { visibility: "visible" };

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
  region: selectRegion(state)
});

type StateProps = ReturnType<typeof mapStateToProps>;
type OwnProps = {
  map: any;
};
type Props = StateProps & OwnProps;

class PreventionLayer extends Component<Props> {
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
    if (
      mapTypeChange ||
      yearChange ||
      countryChange ||
      insecticideChange ||
      insecticideTypesChange ||
      typeChange ||
      speciesChange ||
      assayTypesChange ||
      synergistTypesChange
    ) {
      this.filterSource();
      this.applyMapTypeSymbols();
    }
  }

  componentWillUnmount() {
    this.renderLayer();
  }

  setupGeoJsonData = (studies: any[]) => {
    const groupedStudies = R.groupBy(R.path(["SITE_ID"]), studies);
    const filteredStudies = R.values(groupedStudies).map(group => group[0]);

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
      default:
        return [];
    }
  };

  filterStudies = (studies: PreventionStudy[]) => {
    const filters = this.buildFilters();
    return filters.reduce((studies, filter) => studies.filter(filter), studies);
  };

  filterSource = () => {
    const { studies } = this.props;
    const source = this.props.map.getSource(PREVENTION_SOURCE_ID);
    if (source) {
      const filteredStudies = this.filterStudies(studies);
      const geoStudies = this.setupGeoJsonData(filteredStudies);
      source.setData(studiesToGeoJson(geoStudies));
    }
  };

  mountLayer(prevProps?: Props) {
    const { studies, preventionFilters } = this.props;
    if (!prevProps || prevProps.studies.length !== studies.length) {
      if (this.props.map.getSource(PREVENTION_SOURCE_ID)) {
        this.props.map.removeLayer(PREVENTION_LAYER_ID);
        this.props.map.removeSource(PREVENTION_SOURCE_ID);
      }
      const filteredStudies = this.filterStudies(studies);
      const geoStudies = this.setupGeoJsonData(filteredStudies);
      const source: any = {
        type: "geojson",
        data: studiesToGeoJson(geoStudies)
      };
      this.props.map.addSource(PREVENTION_SOURCE_ID, source);
      this.props.map.addLayer(layer(resolveMapTypeSymbols(preventionFilters)));

      setupEffects(this.props.map, PREVENTION_SOURCE_ID, PREVENTION_LAYER_ID);
      this.setupPopover();
      this.renderLayer();
    }
  }

  onClickListener = (e: any, a: any) => {
    const placeholder = document.createElement("div");
    const { studies } = this.props;
    const filteredStudies = this.filterStudies(studies).filter(
      study => study.SITE_ID === e.features[0].properties.SITE_ID
    );

    ReactDOM.render(
      <I18nextProvider i18n={i18next}>
        <Provider store={store}>
          <Chart studies={filteredStudies} />
        </Provider>
      </I18nextProvider>,
      placeholder
    );
    const coordinates = e.features[0].geometry.coordinates.slice();
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    new mapboxgl.Popup()
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
    const { preventionFilters } = this.props;
    const layer = this.props.map.getLayer(PREVENTION_LAYER_ID);
    const mapTypeSymbols = resolveMapTypeSymbols(preventionFilters);
    if (layer && mapTypeSymbols) {
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
