import React, { Component } from "react";
import { connect } from "react-redux";
import { State } from "../../store/types";
import { selectPreventionStudies } from "../../malaria/prevention/reducer";
import { studiesToGeoJson } from "./layer-utils";
import { selectTheme } from "../../malaria/reducer";
import { Study } from "../../types/Malaria";
import preventionSymbol from "./symbols/prevention";
import mapboxgl from "mapbox-gl";
import { colors } from "../theme";

const PREVENTION = "prevention";
const PREVENTION_LAYER_ID = "prevention-layer";
const PREVENTION_SOURCE_ID = "prevention-source";

const circleLayout = { visibility: "visible" };

const layer: any = {
  id: PREVENTION_LAYER_ID,
  type: "circle",
  layout: circleLayout,
  paint: preventionSymbol,
  source: PREVENTION_SOURCE_ID
};

const mapStateToProps = (state: State) => ({
  studies: selectPreventionStudies(state),
  theme: selectTheme(state)
});

type Props = {
  studies: Study[];
  theme: string;
  map: any;
};

class PreventionLayer extends Component<Props> {
  componentDidMount() {
    this.mountLayer();
  }

  componentDidUpdate(prevProps: Props) {
    this.mountLayer(prevProps);
    this.renderLayer();
  }

  componentWillUnmount() {
    this.renderLayer();
  }

  mountLayer(prevProps?: Props) {
    if (!prevProps || prevProps.studies.length !== this.props.studies.length) {
      if (this.props.map.getSource(PREVENTION_SOURCE_ID)) {
        this.props.map.removeLayer(PREVENTION_LAYER_ID);
        this.props.map.removeSource(PREVENTION_SOURCE_ID);
      }
      const source: any = {
        type: "geojson",
        data: studiesToGeoJson(this.props.studies)
      };
      this.props.map.addSource(PREVENTION_SOURCE_ID, source);
      this.props.map.addLayer(layer);
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

  render() {
    return <div />;
  }
}
export default connect(
  mapStateToProps,
  null
)(PreventionLayer);
