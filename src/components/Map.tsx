import React from "react";
import MapGL, { NavigationControl } from "react-map-gl";
import style from "./style";
import styled from "styled-components";
import Title from "../Title";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import SearchInput from "./SearchInput";
import Filters from "./Filters";
import Layers from "./Layers";
import ReactMapboxGl, {
  Source,
  Layer,
  Feature,
  GeoJSONLayer
} from "react-mapbox-gl";
import { State } from "../store/types";
import { selectEndemicity } from "../malaria/reducer";
import { toggleEndemicityLayerAction } from "../malaria/actions";
import { connect } from "react-redux";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoibW11a2ltIiwiYSI6ImNqNnduNHB2bDE3MHAycXRiOHR3aG0wMTYifQ.ConO2Bqm3yxPukZk6L9cjA";

const BaseMap = ReactMapboxGl({
  accessToken:
    "pk.eyJ1IjoibW11a2ltIiwiYSI6ImNqNnduNHB2bDE3MHAycXRiOHR3aG0wMTYifQ.ConO2Bqm3yxPukZk6L9cjA"
});

const BaseContainer = styled.div`
  max-width: 600px;
  margin: 20px;
  outline: none;
`;

const Container = styled(BaseContainer)`
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  padding: 12px 24px;
  border-radius: 3px;
`;

const TitleContainer = styled(Container)`
  position: absolute;
  top: 0;
  right: 0;
`;

const FilterContainer = styled(BaseContainer)`
  position: absolute;
  bottom: 0;
  left: 0;
`;

const SearchContainer = styled(BaseContainer)`
  position: absolute;
  top: 0;
  left: 0;
`;

const ControlsContainer = styled(BaseContainer)`
  position: absolute;
  bottom: 0;
  right: 0;
`;

const Divider = styled.div`
  height: 10px;
`;

const RASTER_SOURCE_OPTIONS = {
  type: "raster",
  tiles: [
    "https://maps.who.int/arcgis/rest/services/Basemap/WHO_West_Africa_background_7/MapServer/tile/{z}/{y}/{x}?blankTile=false"
  ],
  tileSize: 256,
  attribution: ""
};

const ENDEMICITY_SOURCE_OPTIONS = {
  type: "geojson",
  data:
    "https://who-cache.esriemcs.com/cloud53/rest/services/MALARIA/WHO_MALARIA_THREATS_MAP_STAGING/MapServer/6/query?where=ENDEMICITY%3D0&f=geojson&geometryPrecision=2.5"
};

class Map extends React.Component<any> {
  state = {
    style: style,
    viewport: {
      latitude: 40,
      longitude: 0,
      zoom: 2,
      bearing: 0,
      pitch: 0
    }
  };

  _onViewportChange = (viewport: any) => this.setState({ viewport });
  _onStyleChange = (mapStyle: any) => this.setState({ mapStyle });
  render() {
    const { viewport, style } = this.state;
    return (
      <BaseMap
        style={style}
        zoom={[2]}
        containerStyle={{
          height: "100vh",
          width: "100vw"
        }}
      >
        <Source id="source_id" tileJsonSource={RASTER_SOURCE_OPTIONS} />
        <Layer
          type="raster"
          id="layer_id"
          sourceId="source_id"
          minZoom={0}
          maxZoom={20}
        />

        <Source
          id="endemicity_layer"
          geoJsonSource={ENDEMICITY_SOURCE_OPTIONS}
        />
        {this.props.endemicityLayer && (
          <React.Fragment>
            <Layer
              type="fill"
              id="endemicity_id"
              sourceId="endemicity_layer"
              paint={{
                "fill-color": "rgba(0,0,0,0.4)",
                "fill-opacity": 0.5,
                "fill-outline-color": "rgba(0,0,0,0.1)"
              }}
              minZoom={0}
              maxZoom={20}
            />
          </React.Fragment>
        )}
        {/*<ControlsContainer>*/}
        {/*<NavigationControl />*/}
        {/*</ControlsContainer>*/}
        <TitleContainer>
          <Title />
        </TitleContainer>
        <SearchContainer>
          <SearchInput />
          <Divider />
          <SearchInput />
          <Divider />
          <Layers />
        </SearchContainer>
        <FilterContainer>
          <Filters />
        </FilterContainer>
      </BaseMap>
    );
  }
}

const mapStateToProps = (state: State) => ({
  endemicityLayer: selectEndemicity(state)
});

export default connect(
  mapStateToProps,
  null
)(Map);
