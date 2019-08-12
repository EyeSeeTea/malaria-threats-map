import React, { Component } from "react";
import { connect } from "react-redux";
import { State } from "../../store/types";
import { selectPreventionStudies } from "../../malaria/prevention/reducer";
import { studiesToGeoJson } from "./layer-utils";
import { selectTheme } from "../../malaria/reducer";
import { Study } from "../../types/Malaria";
import mapboxgl from "mapbox-gl";

const PREVENTION = "prevention";
const PREVENTION_LAYER_ID = "prevention-layer";
const PREVENTION_SOURCE_ID = "prevention-source";

const circleLayout = { visibility: "visible" };
const circlePaint = {
  "circle-color": "#E54E52"
};

const layer: any = {
  id: PREVENTION_LAYER_ID,
  type: "circle",
  layout: circleLayout,
  paint: circlePaint,
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
  componentDidUpdate(prevProps: Props) {
    if (prevProps.studies.length !== this.props.studies.length) {
      if (this.props.map.getSource(PREVENTION_SOURCE_ID)) {
        this.props.map.removeSource(PREVENTION_SOURCE_ID);
      }
      const data = studiesToGeoJson(this.props.studies);
      const source: any = {
        type: "geojson",
        data: data
      };
      this.props.map.addSource(PREVENTION_SOURCE_ID, source);
      this.props.map.addLayer(layer);

      this.props.map.on("click", PREVENTION_LAYER_ID, (e: any, a: any) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        const description = e.features[0].properties["VILLAGE_NAME"];

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(description)
          .addTo(this.props.map);
      });
    }

    if (this.props.theme === PREVENTION) {
      this.showLayer();
    } else {
      this.hideLayer();
    }
  }

  componentWillUnmount(): void {
    this.hideLayer();
  }

  showLayer = () => {
    if (this.props.map.getLayer(PREVENTION_LAYER_ID)) {
      this.props.map.setLayoutProperty(
        PREVENTION_LAYER_ID,
        "visibility",
        "visible"
      );
    }
  };

  hideLayer = () => {
    if (this.props.map.getLayer(PREVENTION_LAYER_ID)) {
      this.props.map.setLayoutProperty(
        PREVENTION_LAYER_ID,
        "visibility",
        "none"
      );
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
