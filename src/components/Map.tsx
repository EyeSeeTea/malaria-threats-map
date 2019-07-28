import React from "react";
import MapGL, { NavigationControl } from "react-map-gl";
import style from "./style";
import styled from "styled-components";
import Title from "../Title";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoibW11a2ltIiwiYSI6ImNqNnduNHB2bDE3MHAycXRiOHR3aG0wMTYifQ.ConO2Bqm3yxPukZk6L9cjA";

const NavigationControlContainer = styled.div`
  position: absolute;
  margin: 20px;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
`;

const Container = styled.div`
  max-width: 320px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  padding: 12px 24px;
  margin: 20px;
  font-size: 13px;
  line-height: 2;
  color: #6b6b76;
  text-transform: uppercase;
  outline: none;
  border-radius: 3px;
`;

const TitleContainer = styled(Container)`
  position: absolute;
  top: 0;
  right: 0;
`;

const ExpandContainer = styled(Container)`
  position: absolute;
  top: 0;
  right: 0;
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
        onViewportChange={this._onViewportChange}
        mapboxApiAccessToken={MAPBOX_TOKEN}
      >
        <NavigationControlContainer>
          <NavigationControl />
        </NavigationControlContainer>
        <TitleContainer>
          <Title />
        </TitleContainer>
      </MapGL>
    );
  }
}

export default Map;
