import React, { useEffect, useRef } from "react";
import clsx from "clsx";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import Map from "./Map";
import Disclaimer from "./Disclaimer";
import styled from "styled-components";
import { connect } from "react-redux";
import { State } from "../store/types";
import {
    selectAreFiltersOpen,
    selectIsSidebarOpen,
    selectFilters,
    selectStoryMode,
    selectTheme,
    selectViewData,
} from "../store/reducers/base-reducer";
import {
    setFiltersOpen,
    setSidebarOpen,
    setMobileOptionsOpen,
    setStoryModeAction,
    setThemeAction,
} from "../store/actions/base-actions";
import { selectPreventionFilters } from "../store/reducers/prevention-reducer";
import { selectDiagnosisFilters } from "../store/reducers/diagnosis-reducer";
import { selectTreatmentFilters } from "../store/reducers/treatment-reducer";
import { selectInvasiveFilters } from "../store/reducers/invasive-reducer";
import { setPreventionMapType } from "../store/actions/prevention-actions";
import { AppBar, IconButton, Tab, Tabs, Toolbar } from "@mui/material";
import StoryModeStepper from "./StoryModeStepper";
import SettingsIcon from "@mui/icons-material/Settings";
import { DiagnosisIcon, FilterIcon, InvasiveIcon, PreventionIcon, TreatmentIcon } from "./Icons";
import { colors } from "../constants/theme";
import MobileOptions from "./MobileOptions";
import Loader from "./Loader";
import Hidden from "./hidden/Hidden";
import { dispatchCustomEvent } from "../utils/dom-utils";
import StudyDetailsSidebar from "./StudyDetailsSidebar";

interface ThemeProps {
    drawerWidth: string;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: "flex",
            position: "absolute",
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
        },
        tooltipDrawer: {
            width: (props: ThemeProps) => props.drawerWidth,
            flexShrink: 0,
        },
        tooltipDrawerPaper: {
            width: (props: ThemeProps) => props.drawerWidth,
            backgroundColor: "#f3f3f3",
        },
        drawerHeader: {
            display: "flex",
            alignItems: "center",
            ...theme.mixins.toolbar,
            justifyContent: "flex-end",
        },
        drawer: {
            width: (props: ThemeProps) => props.drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: (props: ThemeProps) => props.drawerWidth,
            backgroundColor: "#f3f3f3",
        },
        content: {
            flexGrow: 1,
            transition: theme.transitions.create("margin", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            marginRight: `${(props: ThemeProps) => props.drawerWidth}`,
        },
        contentShift: {
            transition: theme.transitions.create("margin", {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            right: 0,
            position: "relative",
        },
        iconButton: {
            padding: 10,
            margin: theme.spacing(0, 1),
        },
        toolbar: {
            padding: 0,
        },
    })
);

const PageWrapper = styled.div`
    position: absolute;
    display: flex;
    flex-direction: column;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
`;

const MapWrapper = styled.div`
    position: absolute;
    flex: 1;
    position: relative;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
`;

const StyledTab = styled(Tab)`
    color: ${props => props.color || "inherit"} !important;
    padding: 16px !important;
    font-size: 75% !important;
`;

const mapStateToProps = (state: State) => ({
    filtersOpen: selectAreFiltersOpen(state),
    sidebarOpen: selectIsSidebarOpen(state),
    filters: selectFilters(state),
    theme: selectTheme(state),
    storyMode: selectStoryMode(state),
    preventionFilters: selectPreventionFilters(state),
    diagnosisFilters: selectDiagnosisFilters(state),
    treatmentFilters: selectTreatmentFilters(state),
    invasiveFilters: selectInvasiveFilters(state),
    viewData: selectViewData(state),
});
const mapDispatchToProps = {
    setMobileOptionsOpen: setMobileOptionsOpen,
    setPreventionMapType: setPreventionMapType,
    setFiltersOpen: setFiltersOpen,
    setSidebarOpen: setSidebarOpen,
    setStoryMode: setStoryModeAction,
    setTheme: setThemeAction,
};
type OwnProps = {
    drawerWidth?: string;
};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps & OwnProps;

function PersistentDrawerLeft({
    setMobileOptionsOpen,
    storyMode,
    filtersOpen,
    setFiltersOpen,
    drawerWidth = "400px",
    setTheme,
    setStoryMode,
    theme,
    sidebarOpen,
    setSidebarOpen,
    viewData,
}: Props) {
    const classes = useStyles({ drawerWidth });

    useEffect(() => {
        if (viewData !== null && sidebarOpen === false) {
            setSidebarOpen(true);
        }
        // eslint-disable-next-line
    }, [viewData]);

    useEffect(() => {
        if (sidebarOpen !== null && storyMode !== null) {
            setTimeout(() => dispatchCustomEvent("resize"), 100);
        }
        // eslint-disable-next-line
    }, [storyMode, sidebarOpen]);

    const prevFilterOpenRef = useRef<boolean>();
    const prevStoryModeRef = useRef<boolean>();

    useEffect(() => {
        prevFilterOpenRef.current = filtersOpen;
        prevStoryModeRef.current = storyMode;
    });
    const prevFilterOpen = prevFilterOpenRef.current;
    const prevStoryMode = prevStoryModeRef.current;

    if (filtersOpen && storyMode) {
        if (prevFilterOpen === filtersOpen) {
            setFiltersOpen(!filtersOpen);
        }
        if (prevStoryMode === storyMode) {
            setStoryMode(!storyMode);
        }
    }

    const themes = ["prevention", "diagnosis", "treatment", "invasive"];

    const onChange = (event: React.SyntheticEvent, newValue: number) => {
        switch (newValue) {
            case 0:
                setTheme("prevention");
                break;
            case 1:
                setTheme("diagnosis");
                break;
            case 2:
                setTheme("treatment");
                break;
            case 3:
                setTheme("invasive");
                break;
            default:
                break;
        }
    };
    return (
        <div className={`${classes.root}`}>
            <Loader />
            <CssBaseline />
            {storyMode && (
                <Drawer
                    className={classes.drawer}
                    variant="persistent"
                    anchor="left"
                    open={true}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <StoryModeStepper />
                </Drawer>
            )}
            <div
                className={clsx(classes.content, {
                    [classes.contentShift]: storyMode,
                })}
            >
                <div className={classes.drawerHeader} />
                <PageWrapper>
                    <Hidden smUp>
                        <AppBar position="static" color="default">
                            <Toolbar className={classes.toolbar}>
                                <IconButton
                                    className={classes.iconButton}
                                    aria-label="menu"
                                    onClick={() => setFiltersOpen(true)}
                                    size="large"
                                >
                                    <FilterIcon />
                                </IconButton>

                                <IconButton
                                    color="default"
                                    className={classes.iconButton}
                                    aria-label="settings"
                                    onClick={() => setMobileOptionsOpen(true)}
                                    size="large"
                                >
                                    <SettingsIcon />
                                </IconButton>
                            </Toolbar>
                        </AppBar>
                    </Hidden>
                    <MapWrapper>
                        <Map />
                    </MapWrapper>
                    <Disclaimer />
                    <Hidden smUp>
                        <AppBar position="static" color="default">
                            <Tabs
                                value={themes.indexOf(theme)}
                                onChange={onChange}
                                indicatorColor="primary"
                                textColor="primary"
                                variant="fullWidth"
                                aria-label="full width tabs example"
                                TabIndicatorProps={{
                                    style: {
                                        backgroundColor: colors[theme].N,
                                    },
                                }}
                            >
                                <StyledTab
                                    color={theme === "prevention" ? colors.prevention.N : undefined}
                                    icon={<PreventionIcon selected={theme === "prevention"} size={36} />}
                                />
                                <StyledTab
                                    color={theme === "diagnosis" ? colors.diagnosis.N : undefined}
                                    icon={<DiagnosisIcon selected={theme === "diagnosis"} size={36} />}
                                />
                                <StyledTab
                                    color={theme === "treatment" ? colors.treatment.N : undefined}
                                    icon={<TreatmentIcon selected={theme === "treatment"} size={36} />}
                                />
                                <StyledTab
                                    label=""
                                    color={theme === "invasive" ? colors.invasive.N : undefined}
                                    icon={<InvasiveIcon selected={theme === "invasive"} size={36} />}
                                />
                            </Tabs>
                        </AppBar>
                        <MobileOptions />
                    </Hidden>
                </PageWrapper>
            </div>
            {sidebarOpen && (
                <Drawer
                    className={classes.drawer}
                    variant="persistent"
                    anchor={"right"}
                    open={sidebarOpen}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <StudyDetailsSidebar />
                </Drawer>
            )}
        </div>
    );
}
export default connect(mapStateToProps, mapDispatchToProps)(PersistentDrawerLeft);
