import React from "react";
import clsx from "clsx";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import Map from "./Map";
import Disclaimer from "./Disclaimer";
import styled from "styled-components";
import { connect } from "react-redux";
import { State } from "../store/types";
import { selectAreFiltersOpen, selectFilters, selectStoryMode, selectTheme } from "../store/reducers/base-reducer";
import {
    setFiltersOpen,
    setMobileOptionsOpen,
    setStoryModeAction,
    setThemeAction,
} from "../store/actions/base-actions";
import { selectPreventionFilters } from "../store/reducers/prevention-reducer";
import { selectDiagnosisFilters } from "../store/reducers/diagnosis-reducer";
import { selectTreatmentFilters } from "../store/reducers/treatment-reducer";
import { selectInvasiveFilters } from "../store/reducers/invasive-reducer";
import { setPreventionMapType } from "../store/actions/prevention-actions";
import { AppBar, Hidden, IconButton, Tab, Tabs, Toolbar } from "@material-ui/core";
import StoryModeStepper from "./StoryModeStepper";
import FiltersSidebar from "./FiltersSidebar";
import SettingsIcon from "@material-ui/icons/Settings";
import { DiagnosisIcon, FilterIcon, InvasiveIcon, PreventionIcon, TreatmentIcon } from "./Icons";
import { colors } from "../constants/theme";
import MapTypesSelector from "./MapTypesSelector";
import MobileOptions from "./MobileOptions";
import Loader from "./Loader";

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
        appBar: {
            transition: theme.transitions.create(["margin", "width"], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
        },
        appBarShift: {
            width: (props: ThemeProps) => `calc(100% - ${props.drawerWidth})`,
            marginLeft: (props: ThemeProps) => props.drawerWidth,
            transition: theme.transitions.create(["margin", "width"], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        hide: {
            display: "none",
        },
        drawer: {
            width: (props: ThemeProps) => props.drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: (props: ThemeProps) => props.drawerWidth,
            backgroundColor: "#f3f3f3",
        },
        drawerHeader: {
            display: "flex",
            alignItems: "center",
            ...theme.mixins.toolbar,
            justifyContent: "flex-end",
        },
        content: {
            flexGrow: 1,
            transition: theme.transitions.create("margin", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            marginLeft: `-${(props: ThemeProps) => props.drawerWidth}`,
        },
        contentShift: {
            transition: theme.transitions.create("margin", {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
            position: "relative",
        },
        tab: {
            minWidth: 0,
        },
        iconButton: {
            padding: 10,
            margin: theme.spacing(0, 1),
        },
        input: {
            flex: 1,
        },
        divider: {
            width: 1,
            height: 28,
            margin: 4,
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
    filters: selectFilters(state),
    theme: selectTheme(state),
    storyMode: selectStoryMode(state),
    preventionFilters: selectPreventionFilters(state),
    diagnosisFilters: selectDiagnosisFilters(state),
    treatmentFilters: selectTreatmentFilters(state),
    invasiveFilters: selectInvasiveFilters(state),
});
const mapDispatchToProps = {
    setMobileOptionsOpen: setMobileOptionsOpen,
    setPreventionMapType: setPreventionMapType,
    setFiltersOpen: setFiltersOpen,
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
    theme,
}: Props) {
    const classes = useStyles({ drawerWidth });
    const isOpen = filtersOpen || storyMode;
    const themes = ["prevention", "diagnosis", "treatment", "invasive"];

    const onChange = (event: React.ChangeEvent<{}>, newValue: number) => {
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
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={isOpen}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <>{storyMode ? <StoryModeStepper /> : <FiltersSidebar />}</>
            </Drawer>
            <div
                className={clsx(classes.content, {
                    [classes.contentShift]: isOpen,
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
                                >
                                    <FilterIcon />
                                </IconButton>
                                <MapTypesSelector />
                                <IconButton
                                    color="default"
                                    className={classes.iconButton}
                                    aria-label="settings"
                                    onClick={() => setMobileOptionsOpen(true)}
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
                                    icon={<PreventionIcon active={theme === "prevention"} size={36} />}
                                />
                                <StyledTab
                                    color={theme === "diagnosis" ? colors.diagnosis.N : undefined}
                                    icon={<DiagnosisIcon active={theme === "diagnosis"} size={36} />}
                                />
                                <StyledTab
                                    color={theme === "treatment" ? colors.treatment.N : undefined}
                                    icon={<TreatmentIcon active={theme === "treatment"} size={36} />}
                                />
                                <StyledTab
                                    label=""
                                    color={theme === "invasive" ? colors.invasive.N : undefined}
                                    icon={<InvasiveIcon active={theme === "invasive"} size={36} />}
                                />
                            </Tabs>
                        </AppBar>
                        <MobileOptions />
                    </Hidden>
                </PageWrapper>
            </div>
        </div>
    );
}
export default connect(mapStateToProps, mapDispatchToProps)(PersistentDrawerLeft);
