import React, { Component } from "react";
import { connect } from "react-redux";
import mapboxgl from "mapbox-gl";
import { RegionState, State } from "../../store/types";
import * as R from "ramda";
import { fetchCountryLayerRequest } from "../../store/actions/country-layer-actions";
import { selectCountryLayer } from "../../store/reducers/country-layer-reducer";
import {
  selectEndemicity,
  selectRegion
} from "../../store/reducers/base-reducer";

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
  layout: {
    visibility: "none"
  },
  minZoom: 0,
  maxZoom: 20,
  source: REGION_SOURCE_ID
};

const mapStateToProps = (state: State) => ({
  endemicity: selectEndemicity(state),
  region: selectRegion(state),
  countryLayer: selectCountryLayer(state)
});

const mapDispatchToProps = {
  fetchCountryLayer: fetchCountryLayerRequest
};

interface OwnProps {
  map: any;
}

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps & OwnProps;

class RegionLayer extends Component<Props> {
  componentDidMount(): void {
    const { fetchCountryLayer } = this.props;
    fetchCountryLayer();
    const host = "https://who-cache.esriemcs.com";
    const query =
      "where=1%3D1&f=geojson&geometryPrecision=2.5&outFields=ADM0_SOVRN,ADM0_NAME,CENTER_LAT,CENTER_LON";
    const source: any = {
      type: "geojson",
      data: `${host}/cloud53/rest/services/MALARIA/WHO_MALARIA_THREATS_MAP_STAGING/MapServer/3/query?${query}`
    };
    this.props.map.addSource(REGION_SOURCE_ID, source);
    this.props.map.addLayer(layer);
  }

  componentDidUpdate(prevProps: Props) {
    const { region, countryLayer } = this.props;
    if (prevProps.region.country !== region.country) {
      this.applyCountryUpdates(region);
    }
    if (prevProps.countryLayer !== countryLayer) {
      this.applyCountryUpdates(region);
    }
  }

  applyCountryUpdates = (region: RegionState) => {
    if (region.country) {
      this.zoomToCountry(region.country);
      this.highlightToCountry(region.country);
      this.showLayer();
    } else {
      this.hideLayer();
    }
  };

  highlightToCountry = (country: string) => {
    this.props.map.setFilter(REGION_LAYER_ID, [
      "all",
      ["!=", "ADM0_NAME", country]
    ]);
  };

  zoomToCountry = (country: string) => {
    const { countryLayer } = this.props;
    if (!countryLayer) return;
    const feature = countryLayer.features.find(
      (feature: any) => feature.properties.ADM0_NAME === country
    );
    if (!feature) return;
    const coordinates: any[] = R.chain((coords: any) => {
      return coords[0].length === 2 ? coords : coords[0];
    }, feature.geometry.coordinates);
    const bounds = coordinates.reduce((bounds: any, coord: any) => {
      return bounds.extend(coord);
    }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));
    this.props.map.fitBounds(bounds, {
      padding: 100
    });
  };

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
  mapDispatchToProps
)(RegionLayer);
