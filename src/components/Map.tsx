import React from "react";
import { style } from "./style";
import styled from "styled-components";
import Layers from "./Layers";
import mapboxgl from "mapbox-gl";

import { PreventionMapType, State } from "../store/types";
import { connect } from "react-redux";
import PreventionLayer from "./layers/prevention/PreventionLayer";
import DiagnosisLayer from "./layers/diagnosis/DiagnosisLayer";
import TreatmentLayer from "./layers/treatment/TreatmentLayer";
import InvasiveLayer from "./layers/invasive/InvasiveLayer";
import EndemicityLayer from "./layers/EndemicityLayer";
import Filters from "./Filters";
import MapTypesSelector from "./MapTypesSelector";
import TopicSelector from "./TopicSelector";
import RegionLayer, { MEKONG_BOUNDS } from "./layers/RegionLayer";
import WhoLogo from "./WhoLogo";
import {
  selectAny,
  selectIsInitialDialogOpen,
  selectRegion,
  selectSetBounds,
  selectSetZoom,
  selectTheme
} from "../store/reducers/base-reducer";
import {
  selectPreventionFilters,
  selectPreventionStudies
} from "../store/reducers/prevention-reducer";
import { selectDiagnosisStudies } from "../store/reducers/diagnosis-reducer";
import { selectTreatmentStudies } from "../store/reducers/treatment-reducer";
import { selectInvasiveStudies } from "../store/reducers/invasive-reducer";
import {
  setAnyAction,
  setRegionAction,
  setThemeAction,
  updateBoundsAction,
  updateZoomAction
} from "../store/actions/base-actions";
import ReactMapboxGl from "react-mapbox-gl";
import { Fade, Hidden } from "@material-ui/core";
import Country from "./Country";
import LeyendPopover from "./LegendPopover";
import Leyend from "./Leyend";
import StoryModeSelector from "./StoryModeSelector";
import LanguageSelectorSelect from "./LanguageSelectorSelect";
import MalariaTour from "./tour/MalariaTour";
import InitialDialog from "./InitialDialog";
import MekongLayer from "./layers/MekongLayer";
import config from "../config";

ReactMapboxGl({
  accessToken:
    "pk.eyJ1IjoibW11a2ltIiwiYSI6ImNqNnduNHB2bDE3MHAycXRiOHR3aG0wMTYifQ.ConO2Bqm3yxPukZk6L9cjA"
});

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
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: start;
`;

const Divider = styled.div`
  height: 10px;
`;

const mapStateToProps = (state: State) => ({
  theme: selectTheme(state),
  any: selectAny(state),
  setZoom: selectSetZoom(state),
  setBounds: selectSetBounds(state),
  region: selectRegion(state),
  preventionStudies: selectPreventionStudies(state),
  diagnosisStudies: selectDiagnosisStudies(state),
  treatmentStudies: selectTreatmentStudies(state),
  invasiveStudies: selectInvasiveStudies(state),
  initialDialogOpen: selectIsInitialDialogOpen(state),
  preventionFilters: selectPreventionFilters(state)
});

const mapDispatchToProps = {
  setTheme: setThemeAction,
  setAny: setAnyAction,
  setRegion: setRegionAction,
  updateZoom: updateZoomAction,
  updateBounds: updateBoundsAction
};

export const debounce = <F extends (...args: any[]) => any>(
  func: F,
  waitFor: number
) => {
  let timeout: number;

  return (...args: Parameters<F>): Promise<ReturnType<F>> =>
    new Promise(resolve => {
      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(() => resolve(func(...args)), waitFor);
    });
};

export const debounceTimes = <F extends (...args: any[]) => any>(
  func: F,
  times: number
) => {
  let counter: number = 0;
  return (...args: Parameters<F>): Promise<ReturnType<F>> =>
    new Promise(resolve => {
      counter = counter + 1;
      if (counter >= times) {
        resolve(func(...args));
      }
    });
};

export const throttle = <F extends (...args: any[]) => any>(
  f: F,
  t: number
) => {
  let lastCall: any;
  return (...args: Parameters<F>): ReturnType<F> => {
    let previousCall = lastCall;
    lastCall = Date.now();
    if (previousCall === undefined || lastCall - previousCall > t) {
      return f(args);
    }
  };
};

const mekong = config.mekong;

class Map extends React.Component<any> {
  map: mapboxgl.Map;
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
  images: any[] = [];

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: style,
      center: [-16.629129, 28.291565],
      maxZoom: 7.99999,
      minZoom: 1,
      zoom: 2,
      maxBounds: mekong ? MEKONG_BOUNDS : undefined,
      preserveDrawingBuffer: true
    });
    this.map.dragRotate.disable();
    this.map.touchZoomRotate.disableRotation();

    this.map.on("load", () => {
      this.setState({ ready: true });
      if (
        this.props.setBounds &&
        this.props.setBounds.length === 2 &&
        !this.props.region.country &&
        !this.props.region.subRegion &&
        !this.props.region.region
      ) {
        const [[b0, b1], [b2, b3]] = this.props.setBounds;
        if (!mekong) {
          this.map.fitBounds([b0, b1, b2, b3], {
            padding: 100
          });
        }
      }
    });
    this.map.on("moveend", () => {
      const cc = this.map.getBounds().toArray();
      this.props.updateBounds(cc);
    });

    if (mekong) {
      this.props.setTheme("treatment");
      this.props.setRegion({
        subRegion: "GREATER_MEKONG"
      });
    }
  }

  componentDidUpdate(prevProps: any, prevState: any, snapshot?: any): void {
    if (this.props.setBounds !== prevProps.setBounds) {
      const [[b0, b1], [b2, b3]] = this.props.setBounds;
      this.map.fitBounds([b0, b1, b2, b3], {
        padding: 100
      });
    }
  }

  render() {
    const { initialDialogOpen } = this.props;
    const countryTogglerDisabled =
      (this.props.theme === "prevention" &&
        this.props.preventionFilters.mapType ===
          PreventionMapType.PBO_DEPLOYMENT) ||
      this.props.theme === "invasive";
    return (
      <React.Fragment>
        <div
          ref={el => (this.mapContainer = el)}
          style={{ position: "absolute", bottom: 0, top: 0, right: 0, left: 0 }}
        />
        {this.map && this.state.ready && <PreventionLayer map={this.map} />}
        {this.map && this.state.ready && <DiagnosisLayer map={this.map} />}
        {this.map && this.state.ready && <TreatmentLayer map={this.map} />}
        {this.map && this.state.ready && <InvasiveLayer map={this.map} />}
        {this.map && this.state.ready && <EndemicityLayer map={this.map} />}
        {this.map && this.state.ready && <RegionLayer map={this.map} />}
        {this.map && this.state.ready && <MekongLayer map={this.map} />}
        <Fade in={!initialDialogOpen}>
          <SearchContainer>
            <Hidden xsDown>
              {!mekong && (
                <>
                  <div id={"third"}>
                    <TopicSelector />
                  </div>
                  <Divider />
                </>
              )}
              <MapTypesSelector />
              <Divider />
              <Filters />
              {!mekong && <MalariaTour />}
            </Hidden>
            {!mekong && <Layers />}
            {!mekong && <Country disabled={countryTogglerDisabled} />}
            {!mekong && <StoryModeSelector />}
            {/*<Hidden xsDown>*/}
            {/*  {this.map && this.state.ready ? (*/}
            {/*    <Screenshot map={this.map} />*/}
            {/*  ) : (*/}
            {/*    <div />*/}
            {/*  )}*/}
            {/*</Hidden>*/}
          </SearchContainer>
        </Fade>
        <Fade in={!initialDialogOpen}>
          <TopRightContainer>
            <Hidden xsDown>
              {/*<MalariaTable />*/}
              {!initialDialogOpen && <LanguageSelectorSelect />}
            </Hidden>
          </TopRightContainer>
        </Fade>
        <Fade in={!initialDialogOpen}>
          <BottomRightContainer id={"legend"}>
            <Hidden smUp>
              <LeyendPopover />
            </Hidden>
            <Hidden xsDown>
              <Leyend />
            </Hidden>
          </BottomRightContainer>
        </Fade>
        <BottomLeftContainer>
          <Hidden smUp>
            <WhoLogo width={150} />
          </Hidden>
          <Hidden xsDown>
            <WhoLogo />
          </Hidden>
        </BottomLeftContainer>
        <Hidden xsDown>
          <InitialDialog />
        </Hidden>
      </React.Fragment>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Map);
