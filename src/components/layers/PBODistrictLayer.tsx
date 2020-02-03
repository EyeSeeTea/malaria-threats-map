import React, { Component } from "react";
import { connect } from "react-redux";
import { PreventionMapType, State } from "../../store/types";
import { selectCountryLayer } from "../../store/reducers/country-layer-reducer";
import setupEffects from "./effects";
import { setRegionAction } from "../../store/actions/base-actions";
import * as R from "ramda";
import { studySelector } from "./prevention/utils";
import { selectPreventionStudies } from "../../store/reducers/prevention-reducer";
import {
  PboDeploymentColors,
  PboDeploymentCountriesStatus
} from "./prevention/PboDeployment/PboDeploymentCountriesSymbols";
import { studiesToGeoJson } from "./layer-utils";

const COUNTRY_SELECTOR_LAYER_ID = "country-selector-layer";
const COUNTRY_SELECTOR_SOURCE_ID = "country-selector-source";

const layer: any = {
  id: COUNTRY_SELECTOR_LAYER_ID,
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
      "rgba(0,0,0,0)"
    ],
    "fill-opacity": [
      "case",
      ["boolean", ["feature-state", "hover"], false],
      0.5,
      0.7
    ],
    "fill-outline-color": "rgba(0,0,0,0.1)"
  },
  minZoom: 0,
  maxZoom: 20,
  source: COUNTRY_SELECTOR_SOURCE_ID
};

const mapStateToProps = (state: State) => ({
  countries: selectCountryLayer(state),
  studies: selectPreventionStudies(state)
});

const mapDispatchToProps = {
  setRegion: setRegionAction
};

type OwnProps = {
  map: mapboxgl.Map;
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps & OwnProps;

class PBODistrictLayer extends Component<Props> {
  componentDidMount(): void {
    // this.mountLayer();
  }

  componentDidUpdate() {
    this.mountLayer();
  }

  mountLayer = () => {
    if (this.props.countries) {
      const source: any = {
        type: "geojson",
        data: this.props.countries
      };

      const groupedStudies = R.groupBy(R.path(["SITE_ID"]), this.props.studies);
      const filteredStudies = R.values(groupedStudies).map(group =>
        studySelector(group, PreventionMapType.PBO_DEPLOYMENT)
      );

      const studiesByCountry = R.groupBy(R.path(["ISO2"]), filteredStudies);

      const {
        ELIGIBLE,
        NOT_ENOUGH_DATA,
        NOT_ELIGIBLE
      } = PboDeploymentCountriesStatus;

      const filterByStatus = (status: PboDeploymentCountriesStatus) => (
        studies: any[]
      ) => studies.filter(s => s.PBO_DEPLOYMENT_STATUS === status);

      const statusByCountry: { [key: string]: any } = Object.entries(
        studiesByCountry
      ).reduce(
        (acc, [key, studies]) => ({
          ...acc,
          [key]: {
            [ELIGIBLE]: filterByStatus(ELIGIBLE)(studies).length,
            [NOT_ENOUGH_DATA]: filterByStatus(NOT_ENOUGH_DATA)(studies).length,
            [NOT_ELIGIBLE]: filterByStatus(NOT_ELIGIBLE)(studies).length
          }
        }),
        {}
      );
      console.log(statusByCountry);

      const features = this.props.countries.features.map((feature: any) => {
        const newFeature = { ...feature };
        const countryStatus: { [key: string]: number } =
          statusByCountry[newFeature.properties.ISO_2_CODE];
        if (!countryStatus) {
          newFeature.properties.PBO_DEPLOYMENT_STATUS = null;
          return newFeature;
        }
        const sortByDeploymentStatusNumbers = (
          a: [string, number],
          b: [string, number]
        ) => (a[1] > b[1] ? -1 : 1);
        const status = Object.entries(countryStatus).sort(
          sortByDeploymentStatusNumbers
        )[0][0];
        console.log(status);
        console.log(newFeature);

        newFeature.properties.PBO_DEPLOYMENT_STATUS = status;
        return newFeature;
      });

      console.log(features);

      let existing: any = this.props.map.getSource(COUNTRY_SELECTOR_SOURCE_ID);
      if (existing) {
        console.log(source.data);
        existing.setData(this.props.countries);
        return;
      }

      this.props.map.addSource(COUNTRY_SELECTOR_SOURCE_ID, source);
      this.props.map.addLayer(layer);
      setupEffects(
        this.props.map,
        COUNTRY_SELECTOR_SOURCE_ID,
        COUNTRY_SELECTOR_LAYER_ID
      );
      this.setupPopover();
      console.log(this.props.countries);
      this.showLayer();
    } else {
      this.hideLayer();
    }
  };

  componentWillUnmount(): void {
    this.hideLayer();
  }

  showLayer = () => {
    if (this.props.map.getLayer(COUNTRY_SELECTOR_LAYER_ID)) {
      this.props.map.setLayoutProperty(
        COUNTRY_SELECTOR_LAYER_ID,
        "visibility",
        "visible"
      );
    }
  };

  hideLayer = () => {
    if (this.props.map.getLayer(COUNTRY_SELECTOR_LAYER_ID)) {
      this.props.map.setLayoutProperty(
        COUNTRY_SELECTOR_LAYER_ID,
        "visibility",
        "none"
      );
    }
  };

  onClickListener = (e: any) => {
    this.props.setRegion({ country: e.features[0].properties.ISO_2_CODE });
  };

  setupPopover = () => {
    this.props.map.off(
      "click",
      COUNTRY_SELECTOR_LAYER_ID,
      this.onClickListener
    );
    this.props.map.on("click", COUNTRY_SELECTOR_LAYER_ID, this.onClickListener);
  };

  render() {
    return <div />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PBODistrictLayer);
