import React from "react";
import { style } from "./style";
import styled from "styled-components";
import Layers from "./Layers";
import mapboxgl from "mapbox-gl";
import { isMobile } from "react-device-detect";
import { PreventionMapType, State } from "../store/types";
import { connect } from "react-redux";
import PreventionLayer from "./layers/prevention/PreventionLayer";
import DiagnosisLayer from "./layers/diagnosis/DiagnosisLayer";
import TreatmentLayer from "./layers/treatment/TreatmentLayer";
import InvasiveLayer from "./layers/invasive/InvasiveLayer";
import EndemicityLayer from "./layers/EndemicityLayer";
import RegionLayer from "./layers/RegionLayer";
import WhoLogo from "./WhoLogo";
import HomeIcon from "./LeftSidebarIcons/HomeIcon";
import AboutIcon from "./LeftSidebarIcons/AboutIcon";
import TakeATourIcon from "./LeftSidebarIcons/TakeATourIcon";
import LanguageIcon from "./LeftSidebarIcons/LanguageIcon";
import ContactIcon from "./LeftSidebarIcons/ContactIcon";
import ShareDataIcon from "./LeftSidebarIcons/ShareDataIcon";

import {
    selectAny,
    selectCountryMode,
    selectIsInitialDialogOpen,
    selectRegion,
    selectSetBounds,
    selectSetZoom,
    selectTheaterMode,
    selectTheme,
    selectTour,
} from "../store/reducers/base-reducer";
import { selectPreventionFilters, selectPreventionStudies } from "../store/reducers/prevention-reducer";
import { selectDiagnosisStudies } from "../store/reducers/diagnosis-reducer";
import { selectTreatmentStudies } from "../store/reducers/treatment-reducer";
import { selectInvasiveStudies } from "../store/reducers/invasive-reducer";
import { addNotificationAction } from "../store/actions/notifier-actions";
import { setRegionAction, setThemeAction, updateBoundsAction, updateZoomAction } from "../store/actions/base-actions";
import { Fade, Button, Fab, AppBar, Drawer, Typography, IconButton, Toolbar, Box, Divider } from "@mui/material";
import { Menu as MenuIcon, CloseOutlined as CloseOutlinedIcon } from "@mui/icons-material";
import Country from "./Country";
import LeyendPopover from "./LegendPopover";
import Leyend from "./Leyend";
import StoryModeSelector from "./StoryModeSelector";
import LanguageSelectorSelect from "./LanguageSelectorSelect";
import MalariaTour from "./tour/MalariaTour";
import MekongLayer from "./layers/MekongLayer";
import DataDownload from "./DataDownload";
import CountrySelectorLayer from "./layers/CountrySelectorLayer";
import DistrictsLayer from "./layers/DistrictsLayer";
import PBOEndemicityLayer from "./layers/PBOEndemicityLayer";
import DisputedBordersEndemicityLayer from "./layers/PBODisputedBordersLayer";
import Screenshot from "./Screenshot";
import Report from "./Report";
import Feedback from "./Feedback";
import InitialDisclaimer from "./InitialDisclaimer";
import TheaterMode from "./TheaterMode";
import InitialDialog from "./InitialDialog";
import TourIcon from "./TourIcon";
import ShareIcon from "./ShareIcon";
import { getAnalyticsPageViewFromString } from "../store/analytics";
import { sendAnalytics } from "../utils/analytics";
import { WithTranslation, withTranslation } from "react-i18next";
import Hidden from "./hidden/Hidden";
import { Flex } from "./Chart";
import MapActions from "./map-actions/MapActions";
import { dispatchCustomEvent } from "../utils/dom-utils";

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

const StyledFab = styled(Fab)`
    &.Fab-root {
        pointerevents: all;
        margin: 0.5px;
    }
    margin-bottom: 10px;
`;

const Separator = styled.div`
    width: 20px;
`;

const SidebarIconDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-transform: uppercase;
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
    margin-left: 360px;
    z-index: 1;
`;

const BottomRightContainer = styled(BaseContainer)`
    bottom: 0;
    right: 0;
`;

const BottomLeftContainer = styled(BaseContainer)`
    bottom: 0;
`;

const BottomMiddleContainer = styled(BaseContainer)`
    margin: 10px auto;
    bottom: 0;
    right: 0;
`;

const FloatingActionContainer = styled(BaseContainer)`
    top: 7%;
    z-index: 99;
    pointer-events: all;
`;

const SideBarContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    height: 80%;
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
    margin-left: ${(props: { menuOpen: boolean; initialMargin?: number }) =>
        props.menuOpen ? `${props.initialMargin ? drawerWidth + props.initialMargin : drawerWidth}px` : "0"};
`;

const MenuTypography = styled(Typography)`
    padding-right: 17px;
    text-transform: uppercase;
    font-size: 0.875rem;
    line-height: 1.75;
    letter-spacing: 0.235;
`;

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
}));

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
    any: selectAny(state),
    setZoom: selectSetZoom(state),
    setBounds: selectSetBounds(state),
    region: selectRegion(state),
    countryMode: selectCountryMode(state),
    theaterMode: selectTheaterMode(state),
    preventionStudies: selectPreventionStudies(state),
    diagnosisStudies: selectDiagnosisStudies(state),
    treatmentStudies: selectTreatmentStudies(state),
    invasiveStudies: selectInvasiveStudies(state),
    initialDialogOpen: selectIsInitialDialogOpen(state),
    preventionFilters: selectPreventionFilters(state),
    tour: selectTour(state),
});

const mapDispatchToProps = {
    setTheme: setThemeAction,
    setRegion: setRegionAction,
    updateZoom: updateZoomAction,
    updateBounds: updateBoundsAction,
    addNotification: addNotificationAction,
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
        viewport: {
            latitude: 40,
            longitude: 0,
            zoom: 2,
            bearing: 0,
            pitch: 0,
        },
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
        if (pageView && !this.props.initialDialogOpen) {
            sendAnalytics({ type: "pageView", ...pageView });
        }

        setTimeout(() => dispatchCustomEvent("resize"), 100);
    }

    componentDidUpdate(prevProps: any, _prevState: any, _snapshot?: any): void {
        if (this.props.setBounds !== prevProps.setBounds) {
            const [[b0, b1], [b2, b3]] = this.props.setBounds;
            this.map.fitBounds([b0, b1, b2, b3], {
                padding: 100,
            });
        }
    }

    render() {
        const { theme, initialDialogOpen, countryMode, preventionFilters } = this.props;
        const showOptions = isMobile || !initialDialogOpen;
        const isPbo = theme === "prevention" && preventionFilters.mapType === PreventionMapType.PBO_DEPLOYMENT;
        const isInvasive = theme === "invasive";
        const ready = this.map && this.state.ready;
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
                {isPbo && countryMode ? (
                    <>
                        {ready && <CountrySelectorLayer map={this.map} />}
                        {ready && <DistrictsLayer map={this.map} />}
                        {ready && <PBOEndemicityLayer map={this.map} />}
                        {ready && <DisputedBordersEndemicityLayer map={this.map} />}
                    </>
                ) : (
                    <>
                        {ready && <RegionLayer map={this.map} />}
                        {ready && <PreventionLayer map={this.map} />}
                    </>
                )}
                {ready && <MekongLayer map={this.map} />}
                {ready && <DiagnosisLayer map={this.map} />}
                {ready && <TreatmentLayer map={this.map} />}
                {ready && <InvasiveLayer map={this.map} />}
                <Hidden smDown>
                    <Box>
                        <AppBar position="sticky" sx={classes.appBar}>
                            <StyledToolbar>
                                <Box sx={classes.menuOptionBox}>
                                    <Flex style={{ alignItems: "center" }}>
                                        <IconButton onClick={() => this.setState({ menuOpen: !this.state.menuOpen })}>
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
                <Drawer
                    sx={{
                        width: drawerWidth,
                        backgroundColor: "#EFF3F7",
                        boxShadow: "0px 3px 26px #00000029",
                        flexShrink: 0,
                        "& .MuiDrawer-paper": {
                            width: drawerWidth,
                            boxSizing: "border-box",
                        },
                    }}
                    variant="persistent"
                    anchor="left"
                    open={this.state.menuOpen}
                >
                    <DrawerHeader></DrawerHeader>
                    <SideBarContainer>
                        <SidebarIconDiv>
                            <StyledFab
                                id="home-button"
                                size="small"
                                color={"default"}
                                title={this.props.t("common.sidebar.home")}
                            >
                                <HomeIcon />
                            </StyledFab>
                            <Typography variant="caption"> {this.props.t("common.sidebar.home")}</Typography>
                        </SidebarIconDiv>

                        <SidebarIconDiv>
                            <StyledFab
                                id="about-button"
                                size="small"
                                color={"default"}
                                title={this.props.t("common.sidebar.about")}
                            >
                                <AboutIcon />
                            </StyledFab>
                            <Typography variant="caption"> {this.props.t("common.sidebar.about")}</Typography>
                        </SidebarIconDiv>

                        <SidebarIconDiv>
                            <StyledFab
                                id="contact-button"
                                size="small"
                                color={"default"}
                                title={this.props.t("common.sidebar.contact")}
                            >
                                <ContactIcon />
                            </StyledFab>
                            <Typography variant="caption"> {this.props.t("common.sidebar.contact")}</Typography>
                        </SidebarIconDiv>

                        <SidebarIconDiv>
                            <StyledFab
                                id="contact-button"
                                size="small"
                                color={"default"}
                                title={this.props.t("common.sidebar.share_data")}
                            >
                                <ShareDataIcon />
                            </StyledFab>
                            <Typography variant="caption"> {this.props.t("common.sidebar.share_data")}</Typography>
                        </SidebarIconDiv>

                        <SidebarIconDiv>
                            <StyledFab
                                id="language-button"
                                size="small"
                                color={"default"}
                                title={this.props.t("common.sidebar.language")}
                            >
                                <LanguageIcon />
                            </StyledFab>
                            <Typography variant="caption"> {this.props.t("common.sidebar.language")}</Typography>
                        </SidebarIconDiv>

                        <SidebarIconDiv>
                            <StyledFab
                                id="tour-button"
                                size="small"
                                color={"default"}
                                title={this.props.t("common.sidebar.take_tour")}
                            >
                                <TakeATourIcon />
                            </StyledFab>
                            <Typography variant="caption"> {this.props.t("common.sidebar.take_tour")}</Typography>
                        </SidebarIconDiv>
                    </SideBarContainer>
                </Drawer>
                <Fade in={showOptions}>
                    <PushoverContainer menuOpen={this.state.menuOpen}>
                        <SearchContainer>
                            <Hidden smDown>
                                <MalariaTour />
                            </Hidden>
                            <Layers />
                            <Country disabled={isInvasive} />
                            {!isMobile && <DataDownload />}
                            <Hidden smUp>
                                <ShareIcon />
                            </Hidden>
                            <Hidden smDown>{["prevention", "treatment"].includes(theme) && <Report />}</Hidden>
                        </SearchContainer>
                    </PushoverContainer>
                </Fade>
                <Fade in={showOptions}>
                    <PushoverContainer menuOpen={this.state.menuOpen}>
                        <FloatingActionContainer>
                            <MapActions />
                        </FloatingActionContainer>
                    </PushoverContainer>
                </Fade>
                <Hidden smDown>
                    <Fade in={showOptions}>
                        <TopRightContainer>
                            <StoryModeSelector />
                            <InitialDisclaimer />

                            <Feedback />
                            <TourIcon />
                            {/* {["prevention", "diagnosis"].includes(theme) && <UploadFile />} */}
                            <Separator />
                            {showOptions && <LanguageSelectorSelect section="menu" />}
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
                    <BottomRightContainer id={"legend"}>
                        <Hidden smUp>
                            <LeyendPopover />
                        </Hidden>
                        <Hidden smDown>
                            <Leyend />
                        </Hidden>
                    </BottomRightContainer>
                </Fade>
                <PushoverContainer menuOpen={this.state.menuOpen}>
                    <BottomLeftContainer>
                        <Hidden smUp>
                            <WhoLogo width={150} />
                        </Hidden>
                        <Hidden smDown>
                            <WhoLogo />
                        </Hidden>
                    </BottomLeftContainer>
                </PushoverContainer>
                <BottomMiddleContainer>{this.props.theaterMode ? <TheaterMode /> : <div />}</BottomMiddleContainer>
                <Hidden smDown>
                    <InitialDialog />
                </Hidden>
            </React.Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Map));
