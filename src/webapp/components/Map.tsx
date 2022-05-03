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
import { Fade } from "@mui/material";
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
import MapActions from "./map-actions/MapActions";
import { dispatchCustomEvent } from "../utils/dom-utils";
import LastUpdated from "./last-updated/LastUpdated";

import {
    setBoundsAction,
    setCountryModeAction,
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
import ReduxQuerySync from "../store/query-middleware";
import createStore from "../store";

mapboxgl.accessToken = "pk.eyJ1IjoibW11a2ltIiwiYSI6ImNqNnduNHB2bDE3MHAycXRiOHR3aG0wMTYifQ.ConO2Bqm3yxPukZk6L9cjA";

//where do I get the store from the provider? The app.tsx send the store along so I don't want to duplicate it here
export const { store } = createStore();

const Separator = styled.div`
    width: 20px;
`;

const BaseContainer = styled.div`
    max-width: 600px;
    margin: 30px;
    outline: none;
`;

const TopRightContainer = styled(BaseContainer)`
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    align-items: center;
`;

const TopRightVerticalContainer = styled(BaseContainer)`
    position: absolute;
    top: 0;
    right: 16px;
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
    top: 0;
    left: 350px;
    display: flex;
    flex-direction: column;
    align-items: start;
    z-index: 1;
`;

const FloatingActionsContainer = styled(BaseContainer)`
    pointer-events: none;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 99;
    pointer-events: all;
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

        setTimeout(() => dispatchCustomEvent("resize"), 100);

        ReduxQuerySync({
            store,
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
                countryMode: {
                    selector: (state: State) => state.malaria.countryMode,
                    action: (value: string) => setCountryModeAction(value === "true"),
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
        const { theme, initialDialogOpen, countryMode, preventionFilters } = this.props;
        const showOptions = isMobile || !initialDialogOpen;
        const isPbo = theme === "prevention" && preventionFilters.mapType === PreventionMapType.PBO_DEPLOYMENT;
        const isInvasive = theme === "invasive";
        const ready = this.map && this.state.ready;

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
                <Fade in={showOptions}>
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
                        <Hidden smDown>
                            <Screenshot map={this.map} />
                            {["prevention", "treatment"].includes(theme) && <Report />}
                        </Hidden>
                    </SearchContainer>
                </Fade>
                <Fade in={showOptions}>
                    <FloatingActionsContainer>
                        <MapActions />
                    </FloatingActionsContainer>
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
                        <LastUpdated />
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
