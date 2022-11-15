import React from "react";
import { style } from "./style";
import styled from "styled-components";
import LayersButton from "./layers_button/LayersButton";
import mapboxgl from "mapbox-gl";
import { State } from "../store/types";
import { connect } from "react-redux";
import PreventionLayer from "./layers/prevention/PreventionLayer";
import DiagnosisLayer from "./layers/diagnosis/DiagnosisLayer";
import TreatmentLayer from "./layers/treatment/TreatmentLayer";
import InvasiveLayer from "./layers/invasive/InvasiveLayer";
import EndemicityLayer from "./layers/EndemicityLayer";
import RegionLayer from "./layers/RegionLayer";
import WhoLogo from "./WhoLogo";

import {
    selectAny,
    selectRegion,
    selectSelection,
    selectSetBounds,
    selectSetZoom,
    selectTheaterMode,
    selectTheme,
    selectTour,
} from "../store/reducers/base-reducer";
import { selectPreventionSelectionStudies, selectPreventionStudies } from "../store/reducers/prevention-reducer";
import { selectDiagnosisSelectionStudies, selectDiagnosisStudies } from "../store/reducers/diagnosis-reducer";
import { selectTreatmentSelectionStudies, selectTreatmentStudies } from "../store/reducers/treatment-reducer";
import { selectInvasiveSelectionStudies, selectInvasiveStudies } from "../store/reducers/invasive-reducer";
import { addNotificationAction } from "../store/actions/notifier-actions";
import {
    setRegionAction,
    setThemeAction,
    updateBoundsAction,
    updateZoomAction,
    setActionGroupSelected,
} from "../store/actions/base-actions";
import { Fade, Box, Fab, Drawer, Tooltip } from "@mui/material";
import { Add as ZoomInIcon, Remove as ZoomOutIcon, OpenInFull as MapOnlyIcon } from "@mui/icons-material";
import LeyendPopover from "./legend/LegendPopover";
import StoryModeSelector from "./StoryModeSelector";
import MalariaTour from "./tour/MalariaTour";
import MekongLayer from "./layers/MekongLayer";
import Screenshot from "./Screenshot";
import Report from "./Report";
import Feedback from "./Feedback";
import TheaterMode from "./TheaterMode";
import TourIcon from "./TourIcon";
import ShareIcon from "./ShareIcon";
import { getAnalyticsPageViewFromString } from "../store/analytics";
import { sendAnalytics } from "../utils/analytics";
import { WithTranslation, withTranslation } from "react-i18next";
import Hidden from "./hidden/Hidden";
import MapActions from "./map-actions/MapActions";
import { dispatchCustomEvent } from "../utils/dom-utils";
import LastUpdated from "./last-updated/LastUpdated";
import FloatingLegend from "./legend/FloatingLegendContainer";
import InfoToastLink from "./InfoToastLink";
import SiteSelectionContent from "./site-selection-content/SiteSelectionContent";
import SecondaryHeader from "../pages/secondary-layout/SecondaryHeader";

mapboxgl.accessToken = "pk.eyJ1IjoibW11a2ltIiwiYSI6ImNqNnduNHB2bDE3MHAycXRiOHR3aG0wMTYifQ.ConO2Bqm3yxPukZk6L9cjA";

// Fix bug in production build
// https://github.com/mapbox/mapbox-gl-js/issues/10173#issuecomment-750489778
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

const drawerWidth = 100;
const rightSideBarWidth = 500;

const Separator = styled.div`
    width: 20px;
`;

const BaseContainer = styled.div`
    max-width: 600px;
    margin: 30px;
    outline: none;
    position: absolute;
`;

const BaseFlexAlignStartContainer = styled(BaseContainer)`
    display: flex;
    align-items: start;
    flex-direction: column;
`;

const TopRightContainer = styled(BaseContainer)`
    top: 10%;
    right: 0;
    display: flex;
    align-items: center;
`;

const TopRightVerticalContainer = styled(BaseFlexAlignStartContainer)`
    top: 0;
    right: 0;
`;

const SearchContainer = styled(BaseFlexAlignStartContainer)`
    pointer-events: none;
    top: 7%;
    left: 360px;
    z-index: 1;
    right: 16px;
    display: flex;
    flex-direction: column;
    align-items: start;
`;

const LegendContainer = styled(BaseContainer)<{ rightOpen: boolean }>`
    position: absolute;
    top: 7%;
    right: ${props => (props.rightOpen ? `${rightSideBarWidth}px` : "10px")};
`;

const BottomLeftContainer = styled(BaseContainer)`
    bottom: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const TopMiddleContainer = styled(BaseContainer)<{ rightOpen: boolean }>`
    top: 7%;
    left: ${props => (props.rightOpen ? `30%` : "40%")};
    width: 310px;
`;

const BottomMiddleContainer = styled(BaseContainer)`
    bottom: 0;
    left: 40%;
    width: 310px;
`;

const BottomRightContainer = styled(BaseContainer)`
    display: flex;
    flex-direction: column;
    margin: 10px;
    bottom: 0;
    right: 0;
`;

const FloatingActionContainer = styled(BaseContainer)`
    top: 7%;
    z-index: 99;
    pointer-events: all;
`;

const PushoverContainer = styled.div`
    margin-left: ${(props: { menuOpen: boolean }) => (props.menuOpen ? `${drawerWidth}px` : "0")};
`;

// A Fab ("floating action button") looks like a rounded button.
const MapFab = styled(Fab)`
    margin: 5px;
    width: 36px;
    height: 11px;
`;

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
    any: selectAny(state),
    setZoom: selectSetZoom(state),
    setBounds: selectSetBounds(state),
    region: selectRegion(state),
    theaterMode: selectTheaterMode(state),
    preventionStudies: selectPreventionStudies(state),
    diagnosisStudies: selectDiagnosisStudies(state),
    treatmentStudies: selectTreatmentStudies(state),
    invasiveStudies: selectInvasiveStudies(state),
    tour: selectTour(state),
    preventionSelectionStudies: selectPreventionSelectionStudies(state),
    diagnosisSelectionStudies: selectDiagnosisSelectionStudies(state),
    treatmentSelectionStudies: selectTreatmentSelectionStudies(state),
    invasiveSelectionStudies: selectInvasiveSelectionStudies(state),
    selection: selectSelection(state),
});

const mapDispatchToProps = {
    setTheme: setThemeAction,
    setRegion: setRegionAction,
    updateZoom: updateZoomAction,
    updateBounds: updateBoundsAction,
    addNotification: addNotificationAction,
    setActionGroupSelected: setActionGroupSelected,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = StateProps & DispatchProps & WithTranslation;
type StateTypes = {
    ready: boolean;
    theme: string;
    style: mapboxgl.Style;
    menuOpen: boolean;
    viewMapOnly: boolean; // show only the legend and last-data-update boxes
    viewport: {
        latitude: number;
        longitude: number;
        zoom: number;
        bearing: number;
        pitch: number;
    };
};

class Map extends React.Component<Props, StateTypes> {
    map: mapboxgl.Map;
    mapContainer: any;
    state = {
        ready: false,
        theme: "prevention",
        style: style,
        menuOpen: false,
        viewMapOnly: false, // show only the legend and last-data-update boxes
        viewport: {
            latitude: 40,
            longitude: 0,
            zoom: 2,
            bearing: 0,
            pitch: 0,
        },
    };
    images: any[] = [];

    shouldShowRightSideBar() {
        return (
            this.props.selection &&
            (this.props.preventionSelectionStudies.length > 0 ||
                this.props.diagnosisSelectionStudies.length > 0 ||
                this.props.treatmentSelectionStudies.length > 0 ||
                this.props.invasiveSelectionStudies.length > 0)
        );
    }

    componentDidMount() {
        if (!mapboxgl.supported()) {
            this.props.addNotification(this.props.t("common.WEBGL_error_message"));
            return;
        }
        this.map = new mapboxgl.Map({
            container: this.mapContainer,
            style: style,
            center: [0.0, 28.291565],
            maxZoom: 6.4,
            minZoom: 1,
            zoom: 1.5,
            maxBounds: undefined,
            preserveDrawingBuffer: true,
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
                this.map.fitBounds([b0, b1, b2, b3], {
                    padding: 100,
                });
            }
        });
        this.map.on("moveend", () => {
            const cc = this.map.getBounds().toArray();
            this.props.updateBounds(cc);
        });

        const pageView = getAnalyticsPageViewFromString({ page: this.props.theme });
        if (pageView) {
            sendAnalytics({ type: "pageView", ...pageView });
        }

        setTimeout(() => dispatchCustomEvent("resize"), 100);

        document.addEventListener("fullscreenchange", _ => {
            if (document.fullscreenElement === null && this.state.viewMapOnly) {
                this.switchViewMapOnly();
            }
        });
    }

    componentDidUpdate(prevProps: any, _prevState: any, _snapshot?: any): void {
        if (this.props.setBounds && this.props.setBounds !== prevProps.setBounds) {
            const [[b0, b1], [b2, b3]] = this.props.setBounds;
            this.map.fitBounds([b0, b1, b2, b3], {
                padding: 100,
            });
        }
    }

    zoom(factor: number) {
        const newZoom = this.map.getZoom() * factor;
        this.setState({ viewport: { ...this.state.viewport, zoom: newZoom } });
        this.map.flyTo({ zoom: newZoom });
    }

    switchViewMapOnly() {
        const viewMapOnly = !this.state.viewMapOnly; // new state
        this.setState({ viewMapOnly }); // will change the rendered components
        if (viewMapOnly && !document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            this.props.setActionGroupSelected(null); // fold the selection box
        }
        if (!viewMapOnly && document.fullscreenElement) {
            document.exitFullscreen();
        }
    }

    render() {
        const { theme, t } = this.props;
        const showOptions = true;
        const ready = this.map && this.state.ready;
        const viewMapOnly = this.state.viewMapOnly;
        const classes = {
            icon: { marginRight: 5 },
            fab: {
                pointerEvents: "all" as const,
                margin: 0.5,
            },
            menuOptionBox: { flexGrow: 1, display: { xs: "flex" } },
            screenshotBox: { flexGrow: 0 },
            appBar: { backgroundColor: "white", zIndex: 1400 },
        };

        return (
            <React.Fragment>
                <div
                    ref={el => (this.mapContainer = el)}
                    style={{ position: "absolute", bottom: 0, top: 0, right: 0, left: 0 }}
                />
                {ready && <EndemicityLayer map={this.map} />}

                {ready && <RegionLayer map={this.map} />}
                {ready && <PreventionLayer map={this.map} />}
                {ready && <MekongLayer map={this.map} />}
                {ready && <DiagnosisLayer map={this.map} />}
                {ready && <TreatmentLayer map={this.map} />}
                {ready && <InvasiveLayer map={this.map} />}
                {ready && (
                    <TopMiddleContainer rightOpen={this.shouldShowRightSideBar()}>
                        <InfoToastLink text={this.props.t("common.takeATour")} type="tour" />
                    </TopMiddleContainer>
                )}
                {theme === "treatment" && (
                    <TopMiddleContainer rightOpen={this.shouldShowRightSideBar()}>
                        <InfoToastLink text={this.props.t("common.mekong_link")} type="greaterMekong" />
                    </TopMiddleContainer>
                )}
                {/* TODO:Refactor SecondaryHeader from here and use Secondary Layout in MapPage */}
                {viewMapOnly || (
                    <Hidden smDown>
                        <SecondaryHeader
                            action={
                                <Box sx={classes.screenshotBox}>
                                    <Screenshot map={this.map} />
                                </Box>
                            }
                            onDrawerOpenChange={open => this.setState({ menuOpen: open })}
                        />
                    </Hidden>
                )}
                {viewMapOnly || (
                    <Fade in={showOptions}>
                        <PushoverContainer menuOpen={this.state.menuOpen}>
                            <SearchContainer>
                                <Hidden smDown>
                                    <MalariaTour />
                                </Hidden>
                                <Hidden smUp>
                                    <ShareIcon />
                                </Hidden>
                                <Hidden smDown>{["prevention", "treatment"].includes(theme) && <Report />}</Hidden>
                            </SearchContainer>
                        </PushoverContainer>
                    </Fade>
                )}
                <Fade in={showOptions}>
                    <PushoverContainer menuOpen={this.state.menuOpen}>
                        <FloatingActionContainer>
                            <MapActions />
                        </FloatingActionContainer>
                    </PushoverContainer>
                </Fade>
                <Hidden smDown>
                    <Fade in={false}>
                        <TopRightContainer>
                            <StoryModeSelector />

                            <Feedback />
                            <TourIcon />
                            {/* {["prevention", "diagnosis"].includes(theme) && <UploadFile />} */}
                            <Separator />
                        </TopRightContainer>
                    </Fade>
                </Hidden>
                <Hidden smUp>
                    <Fade in={showOptions}>
                        <TopRightVerticalContainer>
                            <StoryModeSelector />

                            <Feedback />
                        </TopRightVerticalContainer>
                    </Fade>
                </Hidden>
                <Fade in={showOptions}>
                    <LegendContainer id={"legend"} rightOpen={this.shouldShowRightSideBar()}>
                        <Hidden smUp>
                            <LeyendPopover />
                        </Hidden>
                        <Hidden smDown>
                            <FloatingLegend /> {/* Legend box */}
                        </Hidden>
                        <LastUpdated /> {/* Last updated box */}
                    </LegendContainer>
                </Fade>
                <PushoverContainer menuOpen={this.state.menuOpen}>
                    <BottomLeftContainer>
                        {viewMapOnly || <LayersButton />} {/* Layers selector box */}
                        <Box width={20} />
                        <WhoLogo />
                    </BottomLeftContainer>
                </PushoverContainer>
                <BottomMiddleContainer>{this.props.theaterMode ? <TheaterMode /> : <div />}</BottomMiddleContainer>
                <BottomRightContainer>
                    <Tooltip title={t("common.zoomIn")} placement="left">
                        <MapFab size="small" onClick={() => this.zoom(1.25)}>
                            <ZoomInIcon sx={{ fontSize: "14px" }} />
                        </MapFab>
                    </Tooltip>
                    <Tooltip title={t("common.zoomOut")} placement="left">
                        <MapFab size="small" onClick={() => this.zoom(0.8)}>
                            <ZoomOutIcon sx={{ fontSize: "14px" }} />
                        </MapFab>
                    </Tooltip>
                    <Tooltip title={t("common.fullscreen")} placement="left">
                        <MapFab
                            size="small"
                            onClick={() => this.switchViewMapOnly()}
                            sx={
                                viewMapOnly
                                    ? { bgcolor: "#2fb3af", "&:hover": { bgcolor: "#1f938f" } }
                                    : { bgcolor: "white" }
                            }
                        >
                            <MapOnlyIcon sx={{ fontSize: "14px" }} />
                        </MapFab>
                    </Tooltip>
                </BottomRightContainer>

                {this.shouldShowRightSideBar() && (
                    <Drawer
                        //className={classes.drawer}
                        variant="persistent"
                        anchor={"right"}
                        open={true}
                        PaperProps={{
                            sx: {
                                backgroundColor: "#f3f3f3",
                            },
                        }}
                    >
                        <SiteSelectionContent />
                    </Drawer>
                )}
            </React.Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Map));
