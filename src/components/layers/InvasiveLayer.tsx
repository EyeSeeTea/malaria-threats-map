import React, { Component } from "react";
import { connect } from "react-redux";
import { State } from "../../store/types";
import { selectInvasiveStudies } from "../../malaria/invasive/reducer";
import { circleLayout, circlePaint, studiesToGeoJson } from "./layer-utils";
import { selectTheme } from "../../malaria/reducer";
import { Study } from "../../types/Malaria";

const INVASIVE = "invasive";
const INVASIVE_LAYER_ID = "invasive-layer";
const INVASIVE_SOURCE_ID = "invasive-source";

const layer: any = {
  id: INVASIVE_LAYER_ID,
  type: "circle",
  layout: circleLayout,
  paint: circlePaint,
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
  componentDidUpdate(prevProps: Props) {
    if (prevProps.studies.length !== this.props.studies.length) {
      if (this.props.map.getSource(INVASIVE_SOURCE_ID)) {
        this.props.map.removeSource(INVASIVE_SOURCE_ID);
      }
      const source: any = {
        type: "geojson",
        data: studiesToGeoJson(this.props.studies)
      };
      this.props.map.addSource(INVASIVE_SOURCE_ID, source);
      this.props.map.addLayer(layer);
    }

    if (this.props.theme === INVASIVE) {
      this.showLayer();
    } else {
      this.hideLayer();
    }
  }

  componentWillUnmount(): void {
    this.hideLayer();
  }

  showLayer = () => {
    if (this.props.map.getLayer(INVASIVE_LAYER_ID)) {
      this.props.map.setLayoutProperty(
        INVASIVE_LAYER_ID,
        "visibility",
        "visible"
      );
    }
  };

  hideLayer = () => {
    if (this.props.map.getLayer(INVASIVE_LAYER_ID)) {
      this.props.map.setLayoutProperty(INVASIVE_LAYER_ID, "visibility", "none");
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
