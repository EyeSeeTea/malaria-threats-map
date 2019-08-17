import React, { Component } from "react";
import { connect } from "react-redux";
import { State } from "../../store/types";
import { selectInvasiveStudies } from "../../malaria/invasive/reducer";
import { circleLayout, studiesToGeoJson } from "./layer-utils";
import { selectTheme } from "../../malaria/reducer";
import { Study } from "../../types/Malaria";
import invasiveSymbol from "./symbols/invasive";
import setupEffects from "./effects";

const INVASIVE = "invasive";
const INVASIVE_LAYER_ID = "invasive-layer";
const INVASIVE_SOURCE_ID = "invasive-source";

const layer: any = {
  id: INVASIVE_LAYER_ID,
  type: "circle",
  layout: circleLayout,
  paint: invasiveSymbol,
  source: INVASIVE_SOURCE_ID
};

const mapStateToProps = (state: State) => ({
  studies: selectInvasiveStudies(state),
  theme: selectTheme(state)
});

type Props = {
  studies: Study[];
  theme: string;
  map: any;
};
class InvasiveLayer extends Component<Props> {
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
      if (this.props.map.getSource(INVASIVE_SOURCE_ID)) {
        this.props.map.removeLayer(INVASIVE_LAYER_ID);
        this.props.map.removeSource(INVASIVE_SOURCE_ID);
      }
      const source: any = {
        type: "geojson",
        data: studiesToGeoJson(this.props.studies)
      };
      this.props.map.addSource(INVASIVE_SOURCE_ID, source);
      this.props.map.addLayer(layer);

      setupEffects(this.props.map, INVASIVE_SOURCE_ID, INVASIVE_LAYER_ID);
      this.renderLayer();
    }
  }

  renderLayer = () => {
    if (this.props.map.getLayer(INVASIVE_LAYER_ID)) {
      if (this.props.theme === INVASIVE) {
        this.props.map.setLayoutProperty(
          INVASIVE_LAYER_ID,
          "visibility",
          "visible"
        );
      } else {
        this.props.map.setLayoutProperty(
          INVASIVE_LAYER_ID,
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
)(InvasiveLayer);
