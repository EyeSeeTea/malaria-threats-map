import React, { Component } from "react";
import { connect } from "react-redux";
import { State } from "../../store/types";
import { selectTreatmentStudies } from "../../malaria/treatment/reducer";
import { circleLayout, studiesToGeoJson } from "./layer-utils";
import { selectTheme } from "../../malaria/reducer";
import { Study } from "../../types/Malaria";
import treatmentSymbol from "./symbols/treatment";

const TREATMENT = "treatment";
const TREATMENT_LAYER_ID = "treatment-layer";
const TREATMENT_SOURCE_ID = "treatment-source";

const layer: any = {
  id: TREATMENT_LAYER_ID,
  type: "circle",
  layout: circleLayout,
  paint: treatmentSymbol,
  source: TREATMENT_SOURCE_ID
};

const mapStateToProps = (state: State) => ({
  studies: selectTreatmentStudies(state),
  theme: selectTheme(state)
});

type Props = {
  studies: Study[];
  theme: string;
  map: any;
};

class TreatmentLayer extends Component<Props> {
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
      if (this.props.map.getSource(TREATMENT_SOURCE_ID)) {
        this.props.map.removeLayer(TREATMENT_LAYER_ID);
        this.props.map.removeSource(TREATMENT_SOURCE_ID);
      }
      const source: any = {
        type: "geojson",
        data: studiesToGeoJson(this.props.studies)
      };
      this.props.map.addSource(TREATMENT_SOURCE_ID, source);
      this.props.map.addLayer(layer);
    }
  }

  renderLayer = () => {
    if (this.props.map.getLayer(TREATMENT_LAYER_ID)) {
      if (this.props.theme === TREATMENT) {
        this.props.map.setLayoutProperty(
          TREATMENT_LAYER_ID,
          "visibility",
          "visible"
        );
      } else {
        this.props.map.setLayoutProperty(
          TREATMENT_LAYER_ID,
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
)(TreatmentLayer);
