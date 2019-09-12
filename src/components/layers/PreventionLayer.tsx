import React, { Component } from "react";
import { connect } from "react-redux";
import { State } from "../../store/types";
import { selectPreventionStudies } from "../../malaria/prevention/reducer";
import { studiesToGeoJson } from "./layer-utils";
import { selectFilters, selectTheme } from "../../malaria/reducer";
import { Study } from "../../types/Malaria";
import preventionSymbol from "./symbols/prevention";
import setupEffects from "./effects";
import * as R from "ramda";

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
  theme: selectTheme(state),
  filters: selectFilters(state)
});

type StateProps = ReturnType<typeof mapStateToProps>;
type OwnProps = {
  map: any;
};
type Props = StateProps & OwnProps;

class PreventionLayer extends Component<Props> {
  componentDidMount() {
    this.mountLayer();
  }

  componentDidUpdate(prevProps: Props) {
    this.mountLayer(prevProps);
    this.renderLayer();
    const [from, to] = this.props.filters;
    this.props.map.setFilter(PREVENTION_LAYER_ID, [
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
      if (this.props.map.getSource(PREVENTION_SOURCE_ID)) {
        this.props.map.removeLayer(PREVENTION_LAYER_ID);
        this.props.map.removeSource(PREVENTION_SOURCE_ID);
      }

      console.log(this.props.studies.length)
      const groupedStudies = R.groupBy(R.path(["SITE_ID"]), this.props.studies);
      const filteredStudies = R.values(groupedStudies).map(group => group[0]);
      console.log(filteredStudies.length)

      const studies = filteredStudies.map(study => {
        const percentage = parseFloat(study["MORTALITY_ADJUSTED"]);
        return {
          ...study,
          CONFIRMATION_STATUS: (() => {
            if (percentage < 0.9) {
              return "Confirmed";
            } else if (percentage >= 0.9 && percentage < 0.98) {
              return "Possible";
            } else {
              return "Susceptible";
            }
          })()
        };
      });
      const source: any = {
        type: "geojson",
        data: studiesToGeoJson(studies)
      };
      this.props.map.addSource(PREVENTION_SOURCE_ID, source);
      this.props.map.addLayer(layer);

      setupEffects(this.props.map, PREVENTION_SOURCE_ID, PREVENTION_LAYER_ID);
      this.renderLayer();
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
