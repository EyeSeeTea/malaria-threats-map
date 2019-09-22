import React, { Component } from "react";
import { connect } from "react-redux";
import mapboxgl from "mapbox-gl";
import { State } from "../../store/types";
import { selectEndemicity, selectRegion } from "../../malaria/reducer";
import { setThemeAction } from "../../malaria/actions";
import * as R from "ramda";

const REGION_LAYER_ID = "regions-layer";
const REGION_SOURCE_ID = "regions-source";

const layer: any = {
  id: REGION_LAYER_ID,
  type: "fill",
  paint: {
    "fill-color": "rgba(0,0,0,0.4)",
    "fill-opacity": 0.5,
    "fill-outline-color": "rgba(0,0,0,0.1)"
  },
  minZoom: 0,
  maxZoom: 20,
  source: REGION_SOURCE_ID
};

const mapStateToProps = (state: State) => ({
  endemicity: selectEndemicity(state),
  region: selectRegion(state)
});

const mapDispatchToProps = {
  setTheme: setThemeAction
};

class RegionLayer extends Component<any> {
  componentDidMount(): void {
    const { region } = this.props;
    const source: any = {
      type: "geojson",
      data:
        "https://who-cache.esriemcs.com/cloud53/rest/services/MALARIA/WHO_MALARIA_THREATS_MAP_STAGING/MapServer/3/query?where=1%3D1&f=geojson&geometryPrecision=2.5&outFields=ADM0_SOVRN,ADM0_NAME,CENTER_LAT,CENTER_LON"
    };
    this.props.map.addSource(REGION_SOURCE_ID, source);
    this.props.map.addLayer(layer);
    this.props.map.setFilter(REGION_LAYER_ID, [
      "all",
      ["!=", "ADM0_NAME", region.country]
    ]);
    const scr = this.props.map.getSource(REGION_SOURCE_ID);
    const lyr = this.props.map.getLayer(REGION_LAYER_ID);
    this.showLayer();
    setTimeout(() => {
      const point = this.props.map.querySourceFeatures(REGION_SOURCE_ID, {
        filter: ["all", ["==", "ADM0_NAME", region.country]]
      });
      if (!point) return;
      const coordinates: any[] = R.chain(
        (coords: any) => coords[0],
        point[0].geometry.coordinates
      );
      const bounds = coordinates.reduce((bounds: any, coord: any) => {
        return bounds.extend(coord);
      }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

      this.props.map.fitBounds(bounds, {
        padding: 40
      });
    }, 2000);
  }

  componentDidUpdate() {
    this.showLayer();
  }

  componentWillUnmount(): void {
    this.hideLayer();
  }

  showLayer = () => {
    if (this.props.map.getLayer(REGION_LAYER_ID)) {
      this.props.map.setLayoutProperty(
        REGION_LAYER_ID,
        "visibility",
        "visible"
      );
    }
  };

  hideLayer = () => {
    if (this.props.map.getLayer(REGION_LAYER_ID)) {
      this.props.map.setLayoutProperty(REGION_LAYER_ID, "visibility", "none");
    }
  };

  render() {
    return <div />;
  }
}

export default connect(
  mapStateToProps,
  null
)(RegionLayer);
