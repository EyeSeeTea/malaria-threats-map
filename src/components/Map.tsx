import React from "react";
import style from "./style";
import empty from "./style";
import styled from "styled-components";
import SearchInput from "./SearchInput";
import Layers from "./Layers";
import mapboxgl from "mapbox-gl";
import ReactMapboxGl from "react-mapbox-gl";

import { State } from "../store/types";
import { selectTheme } from "../malaria/reducer";
import { connect } from "react-redux";
import { selectPreventionStudies } from "../malaria/prevention/reducer";
import { selectDiagnosisStudies } from "../malaria/diagnosis/reducer";
import { selectTreatmentStudies } from "../malaria/treatment/reducer";
import { selectInvasiveStudies } from "../malaria/invasive/reducer";
import IconButton from "@material-ui/core/IconButton";
import { Study } from "../types/Malaria";
import PreventionLayer from "./layers/PreventionLayer";
import DiagnosisLayer from "./layers/DiagnosisLayer";
import TreatmentLayer from "./layers/TreatmentLayer";
import InvasiveLayer from "./layers/InvasiveLayer";
import {
  DiagnosisIcon,
  InvasiveIcon,
  PreventionIcon,
  TreatmentIcon
} from "./Icons";
import EndemicityLayer from "./layers/EndemicityLayer";
import { setThemeAction } from "../malaria/actions";
import InitialDialog from "./InitialDialog";
import Slider from "./Slider";
import { Paper } from "@material-ui/core";
import Filters from "./Filters";
import LanguageSelector from "./LanguageSelector";
import Legend from "./Leyend";
import MalariaTable from "./MalariaTable";
import BasicSelect from "./BasicSelect";
import PreventionMapTypesSelector from "./PreventionMapTypesSelector";
import TopicSelector from "./TopicSelector";
import RegionLayer from "./layers/RegionLayer";
import CountrySelector from "./CountrySelector";

mapboxgl.accessToken =
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

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-around;
  font-size: 90%;
`;

const StyledPaper = styled(Paper)`
  min-width: 275px;
  padding: 8px;
`;

const ThemeButton = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
`;

const StyledIconButton = styled(IconButton)`
  padding: 8px !important;
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

const circleLayout = { visibility: "visible" };
const circlePaint = {
  "circle-color": "#E54E52"
};

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
      zoom: 2
    });

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
            width: "100%",
            height: "100%"
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
          <CountrySelector />
          <Layers />
          <Filters />
        </SearchContainer>
        <TopRightContainer>
          <MalariaTable />
          {/*<LanguageSelector />*/}
        </TopRightContainer>
        <BottomRightContainer>
          <Legend />
        </BottomRightContainer>
        <InitialDialog />
      </React.Fragment>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Map);
