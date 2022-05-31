import React from "react";
import { style } from "./style";
import styled from "styled-components";
import LayersButton from "./layers_button/LayersButton";
import mapboxgl from "mapbox-gl";
import { isMobile } from "react-device-detect";
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
    selectSetBounds,
    selectSetZoom,
    selectTheaterMode,
    selectTheme,
    selectTour,
} from "../store/reducers/base-reducer";
import { selectPreventionStudies } from "../store/reducers/prevention-reducer";
import { selectDiagnosisStudies } from "../store/reducers/diagnosis-reducer";
import { selectTreatmentStudies } from "../store/reducers/treatment-reducer";
import { selectInvasiveStudies } from "../store/reducers/invasive-reducer";
import { addNotificationAction } from "../store/actions/notifier-actions";
import {
    setRegionAction,
    setThemeAction,
    updateBoundsAction,
    updateZoomAction,
    setActionGroupSelected,
} from "../store/actions/base-actions";
import { Fade, Button, AppBar, Typography, IconButton, Toolbar, Box, Divider, Fab } from "@mui/material";
import {
    Menu as MenuIcon,
    CloseOutlined as CloseOutlinedIcon,
    Add as ZoomInIcon,
    Remove as ZoomOutIcon,
    OpenInFull as MapOnlyIcon,
} from "@mui/icons-material";
import LeyendPopover from "./legend/LegendPopover";
import StoryModeSelector from "./StoryModeSelector";
import MalariaTour from "./tour/MalariaTour";
import MekongLayer from "./layers/MekongLayer";
import DataDownload from "./DataDownload";
import Screenshot from "./Screenshot";
import Report from "./Report";
import Feedback from "./Feedback";
import InitialDisclaimer from "./InitialDisclaimer";
import TheaterMode from "./TheaterMode";
import TourIcon from "./TourIcon";
import ShareIcon from "./ShareIcon";
import { getAnalyticsPageViewFromString } from "../store/analytics";
import { sendAnalytics } from "../utils/analytics";
import { WithTranslation, withTranslation } from "react-i18next";
import Hidden from "./hidden/Hidden";
import { Flex } from "./Chart";
import MapActions from "./map-actions/MapActions";
import { dispatchCustomEvent } from "../utils/dom-utils";
import LeftSidebarMenu from "./LeftSidebarMenu/LeftSidebarMenu";

import { changeLanguage } from "../config/i18next";
import { LanguageSelectorDialog, LANGUAGES } from "./LanguageSelectorDialog";
import LastUpdated from "./last-updated/LastUpdated";
import FloatingLegend from "./legend/FloatingLegendContainer";
import GreaterMekongLink from "./greater-mekong-link/GreaterMekongLink";

mapboxgl.accessToken = "pk.eyJ1IjoibW11a2ltIiwiYSI6ImNqNnduNHB2bDE3MHAycXRiOHR3aG0wMTYifQ.ConO2Bqm3yxPukZk6L9cjA";
const drawerWidth = 100;

const StyledButton = styled(Button)`
    &.MuiButton-root {
        padding: 15px;
        color: black;
        letter-spacing: 0.235px;
        &:hover {
            border: none;
            color: #2FB3AF;
            font-weight: bold;
            padding-bottom: 10px;
            letter-spacing: 0;
            border-bottom: 5px solid #2FB3AF;
            border-radius: 0;
            cursor;
            transition: none;
        }
    }
`;

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

const LegendContainer = styled(BaseContainer)`
    position: absolute;
    top: 7%;
    right: 10px;
`;

const BottomLeftContainer = styled(BaseContainer)`
    bottom: 0;
    display: flex;
    flex-direction: row;
`;

const TopMiddleContainer = styled(BaseContainer)`
    top: 7%;
    left: 40%;
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

const StyledToolbar = styled(Toolbar)`
    &.MuiToolbar-root {
        padding: 0;
        @media (min-width: 600px) {
            padding: 0;
            min-height: 50px;
        }
    }
`;

const PushoverContainer = styled.div`
    margin-left: ${(props: { menuOpen: boolean }) => (props.menuOpen ? `${drawerWidth}px` : "0")};
`;

const MenuTypography = styled(Typography)`
    padding-right: 17px;
    text-transform: uppercase;
    font-size: 0.875rem;
    line-height: 1.75;
    letter-spacing: 0.235;
`;

// A Fab ("floating action button") looks like a rounded button.
const MapFab = styled(Fab)`
    margin: 5px;
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

class Map extends React.Component<Props> {
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
        open: false,
        selectedValue: LANGUAGES[0].value,
    };
    images: any[] = [];

    componentDidMount() {
        if (!mapboxgl.supported()) {
            this.props.addNotification(this.props.t("common.WEBGL_error_message"));
            return;
        }
        this.map = new mapboxgl.Map({
            container: this.mapContainer,
            style: style,
            center: [0.0, 28.291565],
            maxZoom: 8.99999,
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
        if (this.props.setBounds !== prevProps.setBounds) {
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
        const { theme } = this.props;
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

        const handleClickOpen = () => {
            this.setState({ open: true });
        };

        const handleClose = (value: string) => {
            changeLanguage(value);
            this.setState({ open: false, selectedValue: value });
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
                {theme === "treatment" && (
                    <TopMiddleContainer>
                        <GreaterMekongLink />
                    </TopMiddleContainer>
                )}
                {viewMapOnly || (
                    <Hidden smDown>
                        <Box>
                            <AppBar position="sticky" sx={classes.appBar}>
                                <StyledToolbar>
                                    <Box sx={classes.menuOptionBox}>
                                        <Flex style={{ alignItems: "center" }}>
                                            <IconButton
                                                onClick={() => this.setState({ menuOpen: !this.state.menuOpen })}
                                            >
                                                {this.state.menuOpen ? <CloseOutlinedIcon /> : <MenuIcon />}
                                            </IconButton>
                                            <MenuTypography variant="h6">
                                                {this.props.t("common.topbar.menu")}
                                            </MenuTypography>
                                        </Flex>
                                        <Divider orientation="vertical" flexItem />
                                        <StyledButton>{this.props.t("common.topbar.maps")}</StyledButton>
                                        <StyledButton>{this.props.t("common.topbar.dashboards")}</StyledButton>
                                        <StyledButton>{this.props.t("common.data_download.title")}</StyledButton>
                                        <StyledButton>{this.props.t("common.topbar.stories")}</StyledButton>
                                    </Box>
                                    <Box sx={classes.screenshotBox}>
                                        <Screenshot map={this.map} />
                                    </Box>
                                </StyledToolbar>
                            </AppBar>
                        </Box>
                    </Hidden>
                )}
                <LeftSidebarMenu isMenuOpen={this.state.menuOpen} handleClickOpen={handleClickOpen} />
                {viewMapOnly || (
                    <Fade in={showOptions}>
                        <PushoverContainer menuOpen={this.state.menuOpen}>
                            <SearchContainer>
                                <Hidden smDown>
                                    <MalariaTour />
                                </Hidden>
                                {!isMobile && <DataDownload />}
                                <Hidden smUp>
                                    <ShareIcon />
                                </Hidden>
                                <Hidden smDown>{["prevention", "treatment"].includes(theme) && <Report />}</Hidden>
                                <StoryModeSelector />
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
                            <InitialDisclaimer />

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
                            <InitialDisclaimer />

                            <Feedback />
                        </TopRightVerticalContainer>
                    </Fade>
                </Hidden>
                <Fade in={showOptions}>
                    <LegendContainer id={"legend"}>
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
                        <Hidden smUp>
                            <WhoLogo width={150} />
                        </Hidden>
                        <Hidden smDown>
                            <WhoLogo />
                        </Hidden>
                    </BottomLeftContainer>
                </PushoverContainer>
                <BottomMiddleContainer>{this.props.theaterMode ? <TheaterMode /> : <div />}</BottomMiddleContainer>
                <BottomRightContainer>
                    <MapFab size="small" onClick={() => this.zoom(1.25)}>
                        <ZoomInIcon />
                    </MapFab>
                    <MapFab size="small" onClick={() => this.zoom(0.8)}>
                        <ZoomOutIcon />
                    </MapFab>
                    <MapFab
                        size="small"
                        onClick={() => this.switchViewMapOnly()}
                        sx={
                            viewMapOnly
                                ? { bgcolor: "#2fb3af", "&:hover": { bgcolor: "#1f938f" } }
                                : { bgcolor: "white" }
                        }
                    >
                        <MapOnlyIcon />
                    </MapFab>
                </BottomRightContainer>
                <LanguageSelectorDialog
                    selectedValue={this.state.selectedValue}
                    open={this.state.open}
                    onClose={handleClose}
                />
            </React.Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Map));
