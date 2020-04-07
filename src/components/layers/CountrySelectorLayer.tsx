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
import {
  selectCountryMode,
  selectRegion
} from "../../store/reducers/base-reducer";
import { PboDeploymentStatus } from "./prevention/PboDeployment/PboDeploymentSymbols";
import { DISPUTED_BORDERS_ENDEMICITY_LAYER_ID } from "./PBODisputedBordersLayer";

export const COUNTRY_SELECTOR_LAYER_ID = "country-selector-layer";
export const COUNTRY_SELECTOR_SOURCE_ID = "country-selector-source";

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
  studies: selectPreventionStudies(state),
  region: selectRegion(state),
  countryMode: selectCountryMode(state)
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

class CountrySelectorLayer extends Component<Props> {
  componentDidMount(): void {
    if (this.props.countryMode) {
      this.mountLayer();
    }
  }

  componentDidUpdate(prev: Props) {
    if (prev.countryMode) {
      this.mountLayer();
    }
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
      const features = this.props.countries.features
        .filter(
          (feature: any) =>
            feature.properties.ISO_2_CODE !== this.props.region.country
        )
        .map((feature: any) => {
          const newFeature = { ...feature };
          if (newFeature.properties.ENDEMICITY === 0) {
            return newFeature;
          }

          const countryStatus: { [key: string]: number } =
            statusByCountry[newFeature.properties.ISO_2_CODE];
          if (!countryStatus) {
            newFeature.properties.PBO_DEPLOYMENT_STATUS =
              PboDeploymentStatus.NOT_ELIGIBLE;
            return newFeature;
          }
          const statuses: Record<string, number> = Object.entries(
            countryStatus
          ).reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
          const isGreen = statuses[PboDeploymentStatus.ELIGIBLE] > 0;
          newFeature.properties.PBO_DEPLOYMENT_STATUS = isGreen
            ? PboDeploymentStatus.ELIGIBLE
            : PboDeploymentStatus.NOT_ENOUGH_DATA;

          return newFeature;
        });

      let existing: any = this.props.map.getSource(COUNTRY_SELECTOR_SOURCE_ID);
      if (existing) {
        existing.setData({
          type: "FeatureCollection",
          features: features
        });
        this.showLayer();
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
    console.log(e.features[0]);
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CountrySelectorLayer);
