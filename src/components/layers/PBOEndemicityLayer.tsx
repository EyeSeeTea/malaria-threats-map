import React, { Component } from "react";
import { connect } from "react-redux";
import { State } from "../../store/types";
import { selectEndemicity } from "../../store/reducers/base-reducer";
import config from "../../config";
import {DISPUTED_BORDERS_ENDEMICITY_LAYER_ID} from "./PBODisputedBordersLayer";

export const PBO_ENDEMICITY_LAYER_ID = "pbo-endemicity-layer";
export const PBO_ENDEMICITY_SOURCE_ID = "pbo-endemicity-source";

const layer: any = {
  id: PBO_ENDEMICITY_LAYER_ID,
  type: "fill",
  paint: {
    "fill-color": "rgba(255,255,255,1)",
    "fill-opacity": 0.8,
    "fill-outline-color": "rgba(255,255,255,1)"
  },
  minZoom: 0,
  maxZoom: 20,
  source: PBO_ENDEMICITY_SOURCE_ID
};

const mapStateToProps = (state: State) => ({
  endemicity: selectEndemicity(state)
});

type Props = {
  map: mapboxgl.Map;
};

class PBOEndemicityLayer extends Component<Props> {
  componentDidMount(): void {
    const source: any = {
      type: "geojson",
      data: `${config.mapServerUrl}/1/query?where=ENDEMICITY%3D0&f=geojson&geometryPrecision=2.5`
    };
    if (this.props.map.getSource(PBO_ENDEMICITY_SOURCE_ID)) {
      this.showLayer();
    } else {
      this.props.map.addSource(PBO_ENDEMICITY_SOURCE_ID, source);
      this.props.map.addLayer(layer);
    }
  }

  componentWillUnmount(): void {
    this.hideLayer();
  }

  showLayer = () => {
    if (this.props.map.getLayer(PBO_ENDEMICITY_LAYER_ID)) {
      this.props.map.setLayoutProperty(
        PBO_ENDEMICITY_LAYER_ID,
        "visibility",
        "visible"
      );
    }
  };

  hideLayer = () => {
    if (this.props.map.getLayer(PBO_ENDEMICITY_LAYER_ID)) {
      this.props.map.setLayoutProperty(
        PBO_ENDEMICITY_LAYER_ID,
        "visibility",
        "none"
      );
    }
  };

  render() {
    return <div />;
  }
}

export default connect(mapStateToProps, null)(PBOEndemicityLayer);
