import React from "react";
import * as mapboxgl from "mapbox-gl";
import styled from "styled-components";

Object.getOwnPropertyDescriptor(mapboxgl, "accessToken").set(
  "pk.eyJ1IjoibW11a2ltIiwiYSI6ImNqNnduNHB2bDE3MHAycXRiOHR3aG0wMTYifQ.ConO2Bqm3yxPukZk6L9cjA"
);

const Map = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
`;

class App extends React.Component {
  map: any;
  mapContainer: any;

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: "mapbox://styles/mapbox/streets-v9"
    });
  }

  componentWillUnmount() {
    this.map.remove();
  }

  render() {
    return <Map ref={el => (this.mapContainer = el)} />;
  }
}

export default App;
