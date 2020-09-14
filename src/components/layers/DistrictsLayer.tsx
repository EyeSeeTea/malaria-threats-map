import React, { Component } from "react";
import { connect } from "react-redux";
import { PreventionMapType, State } from "../../store/types";
import setupEffects from "./effects";
import * as R from "ramda";
import { evaluateDeploymentStatus, studySelector } from "./prevention/utils";
import {
  selectPreventionFilters,
  selectPreventionStudies,
} from "../../store/reducers/prevention-reducer";
import {
  PboDeploymentColors,
  PboDeploymentCountriesStatus,
} from "./prevention/PboDeployment/PboDeploymentCountriesSymbols";
import {
  selectDistricts,
  selectDistrictsLayer,
} from "../../store/reducers/districts-reducer";
import {
  selectCountryMode,
  selectFilters,
  selectRegion,
} from "../../store/reducers/base-reducer";
import { fetchDistrictsRequest } from "../../store/actions/district-actions";
import mapboxgl from "mapbox-gl";
import { buildPreventionFilters } from "./studies-filters";
import { PreventionStudy } from "../../types/Prevention";

export const DISTRICTS_LAYER_ID = "districts-layer";
export const DISTRICTS_SOURCE_ID = "districts-source";

const layer: any = {
  id: DISTRICTS_LAYER_ID,
  type: "fill",
  paint: {
    "fill-color": [
      "match",
      ["get", "PBO_DEPLOYMENT_STATUS"],
      PboDeploymentCountriesStatus.ELIGIBLE,
      PboDeploymentColors[PboDeploymentCountriesStatus.ELIGIBLE][0],
      PboDeploymentCountriesStatus.NOT_ELIGIBLE,
      PboDeploymentColors[PboDeploymentCountriesStatus.NOT_ELIGIBLE][0],
      PboDeploymentCountriesStatus.NOT_ENOUGH_DATA,
      PboDeploymentColors[PboDeploymentCountriesStatus.NOT_ENOUGH_DATA][0],
      PboDeploymentColors[PboDeploymentCountriesStatus.NOT_APPLICABLE][0],
    ],
    "fill-opacity": [
      "case",
      ["boolean", ["feature-state", "hover"], false],
      0.5,
      0.7,
    ],
    "fill-outline-color": "rgba(0,0,0,0.1)",
  },
  minZoom: 0,
  maxZoom: 20,
  source: DISTRICTS_SOURCE_ID,
};

const mapStateToProps = (state: State) => ({
  region: selectRegion(state),
  districts: selectDistricts(state),
  layer: selectDistrictsLayer(state),
  studies: selectPreventionStudies(state),
  preventionFilters: selectPreventionFilters(state),
  filters: selectFilters(state),
  countryMode: selectCountryMode(state),
});

const mapDispatchToProps = {
  fetchDistricts: fetchDistrictsRequest,
};

type OwnProps = {
  map: mapboxgl.Map;
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps & OwnProps;

class CountrySelectorLayer extends Component<Props> {
  componentDidMount() {
    const { region, fetchDistricts } = this.props;
    if (region.country) {
      fetchDistricts(region.country);
    }
  }

  componentDidUpdate(prevProps: Props) {
    const {
      region,
      districts,
      studies,
      fetchDistricts,
      countryMode,
    } = this.props;
    if (region.country && region.country !== prevProps.region.country) {
      fetchDistricts(region.country);
    }
    if (countryMode && districts.length && studies.length) {
      if (region.country) {
        this.mountLayer();
      } else {
        const data: any = {
          type: "FeatureCollection",
          features: [],
        };
        let existing: any = this.props.map.getSource(DISTRICTS_SOURCE_ID);
        if (existing) {
          existing.setData(data);
        }
      }
    }
  }

  buildFilters = () => {
    const { preventionFilters, filters, region } = this.props;
    return buildPreventionFilters(preventionFilters, filters, region);
  };

  filterStudies = (studies: PreventionStudy[]) => {
    const filters = this.buildFilters();
    return filters.reduce((studies, filter) => studies.filter(filter), studies);
  };

  mountLayer = () => {
    const { region } = this.props;
    const studies = this.filterStudies(this.props.studies);
    const groupedStudies = R.groupBy(R.path(["SITE_ID"]), studies);
    const filteredStudies = R.values(groupedStudies).map((group) =>
      studySelector(group, PreventionMapType.PBO_DEPLOYMENT)
    );

    const studiesByDistrict = R.groupBy(
      R.path(["ADMIN2_GUID"]),
      filteredStudies.filter((s) => s.ISO2 === region.country)
    );

    const features = this.props.layer.features.map((feature: any) => {
      const newFeature = { ...feature };
      const districtStudies =
        studiesByDistrict[newFeature.properties.GUID] || [];
      const { criteria, pboDeploymentStatus } = evaluateDeploymentStatus(
        districtStudies
      );
      newFeature.properties.criteria = criteria;
      newFeature.properties.PBO_DEPLOYMENT_STATUS = pboDeploymentStatus;
      return newFeature;
    });

    const data: GeoJSON.FeatureCollection = {
      type: "FeatureCollection",
      features,
    };

    let existing: mapboxgl.GeoJSONSource = this.props.map.getSource(
      DISTRICTS_SOURCE_ID
    ) as mapboxgl.GeoJSONSource;
    if (existing) {
      existing.setData(data);
      this.showLayer();
      return;
    } else {
      const source: any = {
        type: "geojson",
        data: data,
      };
      this.props.map.addSource(DISTRICTS_SOURCE_ID, source);
      this.props.map.addLayer(layer);
      setupEffects(this.props.map, DISTRICTS_SOURCE_ID, DISTRICTS_LAYER_ID);
      this.setupPopover();
      this.showLayer();
    }
  };

  componentWillUnmount(): void {
    this.hideLayer();
  }

  showLayer = () => {
    if (this.props.map.getLayer(DISTRICTS_LAYER_ID)) {
      this.props.map.setLayoutProperty(
        DISTRICTS_LAYER_ID,
        "visibility",
        "visible"
      );
    }
  };

  hideLayer = () => {
    if (this.props.map.getLayer(DISTRICTS_LAYER_ID)) {
      this.props.map.setLayoutProperty(
        DISTRICTS_LAYER_ID,
        "visibility",
        "none"
      );
    }
  };

  onClickListener = (e: any) => {
    console.log(e.features[0]);
  };

  setupPopover = () => {
    this.props.map.off("click", DISTRICTS_LAYER_ID, this.onClickListener);
    this.props.map.on("click", DISTRICTS_LAYER_ID, this.onClickListener);
  };

  render() {
    return <div />;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CountrySelectorLayer);
