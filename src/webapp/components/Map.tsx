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
import Filters from "./filters/container/Filters";
import MapTypesSelector from "./MapTypesSelector";
import TopicSelector from "./TopicSelector";
import RegionLayer from "./layers/RegionLayer";
import WhoLogo from "./WhoLogo";
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
import { Fade, Button, AppBar, Toolbar, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
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
import TheaterModeIcon from "./TheaterMode/TheaterModeIcon";
import InitialDialog from "./InitialDialog";
import TourIcon from "./TourIcon";
import ShareIcon from "./ShareIcon";
import { getAnalyticsPageViewFromString } from "../store/analytics";
import { sendAnalytics } from "../utils/analytics";
import { WithTranslation, withTranslation } from "react-i18next";
import Hidden from "./hidden/Hidden";

mapboxgl.accessToken = "pk.eyJ1IjoibW11a2ltIiwiYSI6ImNqNnduNHB2bDE3MHAycXRiOHR3aG0wMTYifQ.ConO2Bqm3yxPukZk6L9cjA";
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
    margin: 20px;
    outline: none;
`;

const TopRightContainer = styled(BaseContainer)`
    position: absolute;
    top: 10%;
    right: 0;
    display: flex;
    align-items: center;
`;

const TopRightVerticalContainer = styled(BaseContainer)`
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    align-items: start;
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

const BottomMiddleContainer = styled(BaseContainer)`
    position: absolute;
    margin: 10px auto;
    left: 0;
    bottom: 0;
    right: 0;
`;

const SearchContainer = styled(BaseContainer)`
    pointer-events: none;
    position: absolute;
    top: 10%;
    left: 0;
    display: flex;
    flex-direction: column;
    align-items: start;
    z-index: 1;
`;

const Divider = styled.div`
    height: 10px;
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
            menuOptionBox: { flexGrow: 1, display: { xs: "flex" } },
            screenshotBox: { flexGrow: 0 },
            appBar: { backgroundColor: "white" },
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
                                    <StyledButton>
                                        <MenuIcon style={classes.icon} />
                                        {this.props.t("common.topbar.menu")}
                                    </StyledButton>
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
                <Fade in={showOptions}>
                    <SearchContainer>
                        <Hidden smDown>
                            <div id={"third"}>
                                <TopicSelector />
                            </div>
                            <Divider />
                            <MapTypesSelector />
                            <Divider />
                            <Filters />
                            <MalariaTour />
                        </Hidden>
                        <TheaterModeIcon />
                        <Layers />
                        <Country disabled={isInvasive} />
                        {!isMobile && <DataDownload />}
                        <Hidden smUp>
                            <ShareIcon />
                        </Hidden>
                        <Hidden smDown>{["prevention", "treatment"].includes(theme) && <Report />}</Hidden>
                    </SearchContainer>
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
                <BottomLeftContainer>
                    <Hidden smUp>
                        <WhoLogo width={150} />
                    </Hidden>
                    <Hidden smDown>
                        <WhoLogo />
                    </Hidden>
                </BottomLeftContainer>
                <BottomMiddleContainer>{this.props.theaterMode ? <TheaterMode /> : <div />}</BottomMiddleContainer>
                <Hidden smDown>
                    <InitialDialog />
                </Hidden>
            </React.Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Map));
