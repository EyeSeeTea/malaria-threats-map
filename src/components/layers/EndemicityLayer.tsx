import React, { Component } from "react";
import { connect } from "react-redux";
import { State } from "../../store/types";
import { selectDiagnosisStudies } from "../../malaria/diagnosis/reducer";
import { circleLayout, circlePaint, studiesToGeoJson } from "./layer-utils";
import { Layer } from "react-mapbox-gl";

const ENDEMICITY_LAYER_ID = "endemicity-layer";
const ENDEMICITY_SOURCE_ID = "endemicity-source";

const layer: any = {
  id: ENDEMICITY_LAYER_ID,
  type: "fill",
  paint: {
    "fill-color": "rgba(0,0,0,0.4)",
    "fill-opacity": 0.5,
    "fill-outline-color": "rgba(0,0,0,0.1)"
  },
  minZoom: 0,
  maxZoom: 20,
  source: ENDEMICITY_SOURCE_ID
};

class EndemicityLayer extends Component<any> {
  componentDidMount(): void {
    const source: any = {
      type: "geojson",
      data:
        "https://who-cache.esriemcs.com/cloud53/rest/services/MALARIA/WHO_MALARIA_THREATS_MAP_STAGING/MapServer/6/query?where=ENDEMICITY%3D0&f=geojson&geometryPrecision=2.5"
    };
    this.props.map.addSource(ENDEMICITY_SOURCE_ID, source);
    this.props.map.addLayer(layer);
  }

  componentDidUpdate() {
    if (this.props.visible) {
      this.showLayer();
    } else {
      this.hideLayer();
    }
  }

  componentWillUnmount(): void {
    this.hideLayer();
  }

  showLayer = () => {
    if (this.props.map.getLayer(ENDEMICITY_LAYER_ID)) {
      this.props.map.setLayoutProperty(
        ENDEMICITY_LAYER_ID,
        "visibility",
        "visible"
      );
    }
  };

  hideLayer = () => {
    if (this.props.map.getLayer(ENDEMICITY_LAYER_ID)) {
      this.props.map.setLayoutProperty(
        ENDEMICITY_LAYER_ID,
        "visibility",
        "none"
      );
    }
  };

  render() {
    return <div />;
  }
}
export default EndemicityLayer;
