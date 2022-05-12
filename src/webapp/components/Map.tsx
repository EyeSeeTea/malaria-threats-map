import React from "react";
import { style } from "./style";
import styled from "styled-components";
import Layers from "./Layers";
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
    selectIsInitialDialogOpen,
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
import { setRegionAction, setThemeAction, updateBoundsAction, updateZoomAction } from "../store/actions/base-actions";
import { Fade, Button, AppBar, Typography, IconButton, Toolbar, Box, Divider } from "@mui/material";
import { Menu as MenuIcon, CloseOutlined as CloseOutlinedIcon } from "@mui/icons-material";
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
import LeftSidebarMenu from "./LeftSidebarMenu/LeftSidebarMenu";

import { changeLanguage } from "../config/i18next";
import { LanguageSelectorDialog, LANGUAGES } from "./LanguageSelectorDialog";
import LastUpdated from "./last-updated/LastUpdated";
import FloatingLegend from "./legend/FloatingLegendContainer";

import {
    setBoundsAction,
    setFiltersAction,
    setFiltersMode,
    setFiltersOpen,
    setStoryModeAction,
    setStoryModeStepAction,
    toggleEndemicityLayerAction,
} from "../store/actions/base-actions";
import {
    setAssayTypes,
    setInsecticideClass,
    setInsecticideTypes,
    setPreventionMapType,
    setSpecies,
    setSynergistTypes,
    setType,
} from "../store/actions/prevention-actions";
import {
    setDiagnosisDeletionType,
    setDiagnosisMapType,
    setDiagnosisPatientType,
    setDiagnosisSurveyTypes,
} from "../store/actions/diagnosis-actions";
import {
    setExcludeLowerPatients,
    setExcludeLowerSamples,
    setMolecularMarker,
    setTreatmentDrug,
    setTreatmentMapType,
    setTreatmentPlasmodiumSpecies,
} from "../store/actions/treatment-actions";
import { setInvasiveMapType, setInvasiveVectorSpecies } from "../store/actions/invasive-actions";
import { PreventionMapType } from "../store/types";
import ReduxQuerySync from "../store/query-middleware";
//import { store } from "../App";
import createStore from "../store";

mapboxgl.accessToken = "pk.eyJ1IjoibW11a2ltIiwiYSI6ImNqNnduNHB2bDE3MHAycXRiOHR3aG0wMTYifQ.ConO2Bqm3yxPukZk6L9cjA";
const drawerWidth = 100;
export const { store } = createStore();

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
    top: 80px;
    right: 10px;
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
    initialDialogOpen: selectIsInitialDialogOpen(state),
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
        if (pageView && !this.props.initialDialogOpen) {
            sendAnalytics({ type: "pageView", ...pageView });
        }

        setTimeout(() => dispatchCustomEvent("resize"), 100);

        ReduxQuerySync({
            store: store,
            params: {
                theme: {
                    selector: (state: State) => state.malaria.theme,
                    action: (value: string) => setThemeAction(value || "prevention"),
                },
                mapType: {
                    selector: (state: State) => {
                        switch (state.malaria.theme) {
                            case "prevention":
                                return `prevention:${state.prevention.filters.mapType}`;
                            case "diagnosis":
                                return `diagnosis:${state.diagnosis.filters.mapType}`;
                            case "treatment":
                                return `treatment:${state.treatment.filters.mapType}`;
                            case "invasive":
                                return `invasive:${state.invasive.filters.mapType}`;
                            default:
                                return `prevention:0`;
                        }
                    },
                    action: (value: string) => {
                        if (!value) {
                            return setPreventionMapType(PreventionMapType.RESISTANCE_STATUS);
                        }
                        const pair = value.split(":");
                        const mapType: number = parseInt(pair[1]);
                        if (isNaN(mapType)) {
                            return setPreventionMapType(mapType);
                        }
                        switch (pair[0]) {
                            case "prevention":
                                return setPreventionMapType(mapType);
                            case "diagnosis":
                                return setDiagnosisMapType(mapType);
                            case "treatment":
                                return setTreatmentMapType(mapType);
                            case "invasive":
                                return setInvasiveMapType(mapType);
                            default:
                                return setPreventionMapType(mapType);
                        }
                    },
                },
                bounds: {
                    selector: (state: State) => JSON.stringify(state.malaria.bounds),
                    action: (value: string) => setBoundsAction(value ? JSON.parse(value) : undefined),
                },
                insecticideClass: {
                    selector: (state: State) => state.prevention.filters.insecticideClass,
                    action: (value: string) => setInsecticideClass(value),
                },
                insecticideTypes: {
                    selector: (state: State) => state.prevention.filters.insecticideTypes,
                    action: (value: string) => setInsecticideTypes(value ? value.split(",") : undefined),
                },
                assayTypes: {
                    selector: (state: State) => state.prevention.filters.assayTypes,
                    action: (value: string) => setAssayTypes(value ? value.split(",") : undefined),
                },
                synergistTypes: {
                    selector: (state: State) => state.prevention.filters.synergistTypes,
                    action: (value: string) => setSynergistTypes(value ? value.split(",") : undefined),
                },
                type: {
                    selector: (state: State) => state.prevention.filters.type,
                    action: (value: string) => setType(value),
                },
                species: {
                    selector: (state: State) => state.prevention.filters.species,
                    action: (value: string) => setSpecies(value ? value.split(",") : undefined),
                },
                vectorSpecies: {
                    selector: (state: State) => state.invasive.filters.vectorSpecies,
                    action: (value: string) => setInvasiveVectorSpecies(value ? value.split(",") : undefined),
                },
                surveyTypes: {
                    selector: (state: State) => state.diagnosis.filters.surveyTypes,
                    action: (value: string) => setDiagnosisSurveyTypes(value ? value.split(",") : undefined),
                },
                patientType: {
                    selector: (state: State) => state.diagnosis.filters.patientType,
                    action: (value: string) => setDiagnosisPatientType(value),
                },
                deletionType: {
                    selector: (state: State) => state.diagnosis.filters.deletionType,
                    action: (value: string) => setDiagnosisDeletionType(value),
                },
                plasmodiumSpecies: {
                    selector: (state: State) => state.treatment.filters.plasmodiumSpecies,
                    action: (value: string) => setTreatmentPlasmodiumSpecies(value),
                },
                drug: {
                    selector: (state: State) => state.treatment.filters.drug,
                    action: (value: string) => setTreatmentDrug(value),
                },
                mmType: {
                    selector: (state: State) => state.treatment.filters.molecularMarker,
                    action: (value: string) => setMolecularMarker(parseInt(value)),
                },
                excludeLowerPatients: {
                    selector: (state: State) => state.treatment.filters.excludeLowerPatients,
                    action: (value: boolean) => setExcludeLowerPatients(value),
                },
                excludeLowerSamples: {
                    selector: (state: State) => state.treatment.filters.excludeLowerSamples,
                    action: (value: boolean) => setExcludeLowerSamples(value),
                },
                endemicity: {
                    selector: (state: State) => state.malaria.endemicity,
                    action: (value: string) => toggleEndemicityLayerAction(value === "true"),
                },
                storyMode: {
                    selector: (state: State) => state.malaria.storyMode,
                    action: (value: string) => setStoryModeAction(value === "true"),
                },
                storyModeStep: {
                    selector: (state: State) => state.malaria.storyModeStep,
                    action: (value: string) => setStoryModeStepAction(parseInt(value)),
                },
                filterOpen: {
                    selector: (state: State) => state.malaria.filtersOpen,
                    action: (value: string) => setFiltersOpen(!value ? true : value === "true"),
                },
                filtersMode: {
                    selector: (state: State) => state.malaria.filtersMode,
                    action: (value: string) => setFiltersMode(value),
                },
                years: {
                    selector: (state: State) => state.malaria.filters,
                    action: (value: string) =>
                        setFiltersAction(value ? value.split(",").map(value => parseInt(value)) : undefined),
                },
                region: {
                    selector: (state: State) => {
                        if (state.malaria.region.country) {
                            return `country:${state.malaria.region.country}`;
                        }
                        if (state.malaria.region.region) {
                            return `region:${state.malaria.region.region}`;
                        }
                        if (state.malaria.region.subRegion) {
                            return `subRegion:${state.malaria.region.subRegion}`;
                        }
                        if (state.malaria.region.site) {
                            const site = `site:${encodeURI(
                                JSON.stringify({
                                    siteIso2: state.malaria.region.siteIso2,
                                    site: state.malaria.region.site,
                                    siteCoordinates: state.malaria.region.siteCoordinates,
                                })
                            )}`;
                            return site;
                        }
                    },
                    action: (value: string) => {
                        const [type, ...rest] = value.split(":");
                        switch (type) {
                            case "country":
                                return setRegionAction({ country: rest[1] });
                            case "region":
                                return setRegionAction({ region: rest[1] });
                            case "subRegion":
                                return setRegionAction({ subRegion: rest[1] });
                            case "site": {
                                const { siteIso2, site, siteCoordinates } = JSON.parse(
                                    decodeURIComponent(rest.join(":"))
                                );
                                return setRegionAction({
                                    siteIso2,
                                    site,
                                    siteCoordinates,
                                });
                            }
                            default:
                                return setRegionAction({ subRegion: rest[1] });
                        }
                    },
                },
            },
            initialTruth: "location",
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

    render() {
        const { theme, initialDialogOpen } = this.props;
        const showOptions = isMobile || !initialDialogOpen;
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
                <LeftSidebarMenu isMenuOpen={this.state.menuOpen} handleClickOpen={handleClickOpen} />
                <Fade in={showOptions}>
                    <PushoverContainer menuOpen={this.state.menuOpen}>
                        <SearchContainer>
                            <Hidden smDown>
                                <MalariaTour />
                            </Hidden>
                            <Layers />
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
                            <FloatingLegend />
                        </Hidden>
                        <LastUpdated />
                    </LegendContainer>
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
