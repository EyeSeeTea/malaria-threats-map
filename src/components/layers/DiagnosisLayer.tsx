import React, { Component } from "react";
import { connect } from "react-redux";
import { State } from "../../store/types";
import { selectDiagnosisStudies } from "../../malaria/diagnosis/reducer";
import { circleLayout, studiesToGeoJson } from "./layer-utils";
import {selectFilters, selectTheme} from "../../malaria/reducer";
import { Study } from "../../types/Malaria";
import diagnosisSymbol from "./symbols/diagnosis";
import setupEffects from "./effects";

const DIAGNOSIS = "diagnosis";
const DIAGNOSIS_LAYER_ID = "diagnosis-layer";
const DIAGNOSIS_SOURCE_ID = "diagnosis-source";

const layer: any = {
  id: DIAGNOSIS_LAYER_ID,
  type: "circle",
  layout: circleLayout,
  paint: diagnosisSymbol,
  source: DIAGNOSIS_SOURCE_ID
};

const mapStateToProps = (state: State) => ({
  studies: selectDiagnosisStudies(state),
  theme: selectTheme(state),
  filters: selectFilters(state)
});

type StateProps = ReturnType<typeof mapStateToProps>;
type OwnProps = {
  map: any;
};
type Props = StateProps & OwnProps;

class DiagnosisLayer extends Component<Props> {
  componentDidMount() {
    this.mountLayer();
  }

  componentDidUpdate(prevProps: Props) {
    this.mountLayer(prevProps);
    this.renderLayer();
    const [from, to] = this.props.filters;
    this.props.map.setFilter(DIAGNOSIS_LAYER_ID, [
      "all",
      [">=", "YEAR_START", from],
      ["<=", "YEAR_START", to]
    ]);
  }

  componentWillUnmount() {
    this.renderLayer();
  }

  mountLayer(prevProps?: Props) {
    if (!prevProps || prevProps.studies.length !== this.props.studies.length) {
      if (this.props.map.getSource(DIAGNOSIS_SOURCE_ID)) {
        this.props.map.removeLayer(DIAGNOSIS_LAYER_ID);
        this.props.map.removeSource(DIAGNOSIS_SOURCE_ID);
      }
      const source: any = {
        type: "geojson",
        data: studiesToGeoJson(this.props.studies)
      };
      this.props.map.addSource(DIAGNOSIS_SOURCE_ID, source);
      this.props.map.addLayer(layer);

      setupEffects(this.props.map, DIAGNOSIS_SOURCE_ID, DIAGNOSIS_LAYER_ID);
      this.renderLayer();

    }
  }

  renderLayer = () => {
    if (this.props.map.getLayer(DIAGNOSIS_LAYER_ID)) {
      if (this.props.theme === DIAGNOSIS) {
        this.props.map.setLayoutProperty(
          DIAGNOSIS_LAYER_ID,
          "visibility",
          "visible"
        );
      } else {
        this.props.map.setLayoutProperty(
          DIAGNOSIS_LAYER_ID,
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
)(DiagnosisLayer);
