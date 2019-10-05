import React from "react";
import style from "./style";
import empty from "./style";
import styled from "styled-components";
import Layers from "./Layers";
import mapboxgl from "mapbox-gl";

import { State } from "../store/types";
import { selectTheme } from "../malaria/reducer";
import { connect } from "react-redux";
import { selectPreventionStudies } from "../malaria/prevention/reducer";
import { selectDiagnosisStudies } from "../malaria/diagnosis/reducer";
import { selectTreatmentStudies } from "../malaria/treatment/reducer";
import { selectInvasiveStudies } from "../malaria/invasive/reducer";
import { Study } from "../types/Malaria";
import PreventionLayer from "./layers/PreventionLayer";
import DiagnosisLayer from "./layers/DiagnosisLayer";
import TreatmentLayer from "./layers/TreatmentLayer";
import InvasiveLayer from "./layers/InvasiveLayer";
import EndemicityLayer from "./layers/EndemicityLayer";
import { setThemeAction } from "../malaria/actions";
import InitialDialog from "./InitialDialog";
import Filters from "./Filters";
import LanguageSelector from "./LanguageSelector";
import Legend from "./Leyend";
import MalariaTable from "./MalariaTable";
import PreventionMapTypesSelector from "./PreventionMapTypesSelector";
import TopicSelector from "./TopicSelector";
import RegionLayer from "./layers/RegionLayer";
import CountrySelector from "./CountrySelector";
import WhoLogo from "./WhoLogo";
import RegionSelector from "./RegionSelector";

mapboxgl.accessToken =
  "pk.eyJ1IjoibW11a2ltIiwiYSI6ImNqNnduNHB2bDE3MHAycXRiOHR3aG0wMTYifQ.ConO2Bqm3yxPukZk6L9cjA";

const BaseContainer = styled.div`
  max-width: 600px;
  margin: 20px;
  outline: none;
`;

const TopRightContainer = styled(BaseContainer)`
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
`;

const BottomRightContainer = styled(BaseContainer)`
  position: absolute;
  bottom: 0;
  right: 0;
`;

const BottomLeftContainer = styled(BaseContainer)`
  position: absolute;
  bottom: 0;
  left: 0;
`;

const SearchContainer = styled(BaseContainer)`
  position: absolute;
  top: 0;
  left: 0;
`;

const Divider = styled.div`
  height: 10px;
`;

const FilterWrapper = styled.div`
  margin-botton: 10px;
`;

const mapStateToProps = (state: State) => ({
  theme: selectTheme(state),
  preventionStudies: selectPreventionStudies(state),
  diagnosisStudies: selectDiagnosisStudies(state),
  treatmentStudies: selectTreatmentStudies(state),
  invasiveStudies: selectInvasiveStudies(state)
});

const mapDispatchToProps = {
  setTheme: setThemeAction
};

class Map extends React.Component<any> {
  map: any;
  mapContainer: any;
  state = {
    ready: false,
    theme: "prevention",
    style: style,
    viewport: {
      latitude: 40,
      longitude: 0,
      zoom: 2,
      bearing: 0,
      pitch: 0
    }
  };

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: empty,
      center: [-16.629129, 28.291565],
      maxZoom: 7.99999,
      minZoom: 1,
      zoom: 2
    });
    this.map.dragRotate.disable();
    this.map.touchZoomRotate.disableRotation();

    this.map.on("load", () => {
      this.map.addSource("raster-tiles", {
        type: "raster",
        tiles: [
          "https://maps.who.int/arcgis/rest/services/Basemap/WHO_West_Africa_background_7/MapServer/tile/{z}/{y}/{x}?blankTile=false"
        ],
        tileSize: 256,
        attribution: ""
      });

      this.map.addLayer({
        id: "simple-tiles",
        type: "raster",
        source: "raster-tiles",
        minzoom: 1,
        maxzoom: 8
      });

      this.setState({ ready: true });
      this.map.on("zoom", () => {});
    });
  }

  geoJson = (studies: Study[]) => ({
    type: "FeatureCollection",
    features: studies.map(study => ({
      type: "Feature",
      properties: study,
      geometry: {
        type: "Point",
        coordinates: [parseFloat(study.Longitude), parseFloat(study.Latitude)]
      }
    }))
  });

  componentWillUnmount() {
    this.map.remove();
  }

  componentDidUpdate(prevProps: any, prevState: any, snapshot?: any): void {
    if (this.state.theme !== prevState.theme) {
    }
  }

  _onViewportChange = (viewport: any) => this.setState({ viewport });
  _onStyleChange = (mapStyle: any) => this.setState({ mapStyle });

  render() {
    const { setTheme, theme } = this.props;
    const { viewport, style } = this.state;
    return (
      <React.Fragment>
        <div
          ref={el => (this.mapContainer = el)}
          style={{
            position: "absolute",
            bottom: 0,
            top: 0,
            right: 0,
            left: 0
          }}
        />
        {this.map && this.state.ready && <PreventionLayer map={this.map} />}
        {this.map && this.state.ready && <DiagnosisLayer map={this.map} />}
        {this.map && this.state.ready && <TreatmentLayer map={this.map} />}
        {this.map && this.state.ready && <InvasiveLayer map={this.map} />}
        {this.map && this.state.ready && <EndemicityLayer map={this.map} />}
        {this.map && this.state.ready && <RegionLayer map={this.map} />}
        <SearchContainer>
          <TopicSelector />
          <Divider />
          {/*<SearchInput />*/}
          <PreventionMapTypesSelector />
          <Divider />
          <CountrySelector />
          <Divider />
          <Filters />
          <Layers />
        </SearchContainer>
        <TopRightContainer>
          <MalariaTable />
          <LanguageSelector />
        </TopRightContainer>
        <BottomRightContainer>
          <Legend />
        </BottomRightContainer>
        <BottomLeftContainer>
          <WhoLogo />
        </BottomLeftContainer>
        <InitialDialog />
      </React.Fragment>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Map);
