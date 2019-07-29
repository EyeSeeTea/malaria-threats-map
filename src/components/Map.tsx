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

const MAPBOX_TOKEN =
  "pk.eyJ1IjoibW11a2ltIiwiYSI6ImNqNnduNHB2bDE3MHAycXRiOHR3aG0wMTYifQ.ConO2Bqm3yxPukZk6L9cjA";

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

class Map extends React.Component {
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
      <MapGL
        {...viewport}
        width="100%"
        height="100%"
        style={{ position: "relative" }}
        mapStyle={style}
        doubleClickZoom={false}
        onViewportChange={this._onViewportChange}
        mapboxApiAccessToken={MAPBOX_TOKEN}
      >
        <ControlsContainer>
          <NavigationControl />
        </ControlsContainer>
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
      </MapGL>
    );
  }
}

export default Map;
