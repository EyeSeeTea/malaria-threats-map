import React, { Component } from "react";
import { connect } from "react-redux";
import { State } from "../../store/types";
import {
  PreventionMapType,
  selectFilters as selectPreventionFilters,
  selectPreventionStudies
} from "../../malaria/prevention/reducer";
import { studiesToGeoJson } from "./layer-utils";
import {
  selectFilters,
  selectRegion,
  selectTheme
} from "../../malaria/reducer";
import setupEffects from "./effects";
import * as R from "ramda";
import resistanceStatusSymbols from "./prevention/ResistanceStatus/symbols";
import { resolveResistanceStatus } from "./prevention/ResistanceStatus/utils";
import { PreventionStudy } from "../../types/Prevention";
import {
  filterByCountry,
  filterByIntensityStatus,
  filterByResistanceStatus,
  filterByYearRange
} from "./studies-filters";
import { resolveMapTypeSymbols } from "./prevention/utils";

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
      preventionFilters: { mapType },
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
    if (mapTypeChange || yearChange || countryChange) {
      this.filterSource();
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
          filterByYearRange(filters),
          filterByCountry(region.country)
        ];
      case PreventionMapType.INTENSITY_STATUS:
        return [
          filterByIntensityStatus,
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
      this.renderLayer();
    }
  }

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
