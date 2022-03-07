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
import { selectIsTooltipOpen, selectFilters, selectStoryMode, selectTheme } from "../store/reducers/base-reducer";
import {
    setTooltipOpen,
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
import FiltersSidebar from "./filters/container/FiltersSidebar";
import SettingsIcon from "@mui/icons-material/Settings";
import { DiagnosisIcon, FilterIcon, InvasiveIcon, PreventionIcon, TreatmentIcon } from "./Icons";
import { colors } from "../constants/theme";
import MapTypesSelector from "./MapTypesSelector";
import MobileOptions from "./MobileOptions";
import Loader from "./Loader";
import Hidden from "./hidden/Hidden";
import { DiagnosisStudy } from "../../domain/entities/DiagnosisStudy";

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
    tooltipOpen: selectIsTooltipOpen(state),
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
    setTooltipOpen: setTooltipOpen,
    setStoryMode: setStoryModeAction,
    setTheme: setThemeAction,
};
type OwnProps = {
    drawerWidth?: string;
    studies: DiagnosisStudy[]; //this is temporary, I would either take any type of study or just take the countryMode and study type

};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps & OwnProps;

function PersistentDrawerRight({
    setMobileOptionsOpen,
    storyMode,
    tooltipOpen,
    setTooltipOpen,
    drawerWidth = "400px",
    setTheme,
    setStoryMode,
    theme,
}: Props) {
    const classes = useStyles({ drawerWidth });
    const isOpen = tooltipOpen || storyMode;
    const prevFilterOpenRef = useRef<boolean>();
    const prevStoryModeRef = useRef<boolean>();

    useEffect(() => {
        prevFilterOpenRef.current = tooltipOpen;
        prevStoryModeRef.current = storyMode;
    });
    const prevFilterOpen = prevFilterOpenRef.current;
    const prevStoryMode = prevStoryModeRef.current;

    if (tooltipOpen && storyMode) {
        if (prevFilterOpen === tooltipOpen) {
            setTooltipOpen(!tooltipOpen);
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
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="right"
                open={isOpen}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <>{storyMode ? <StoryModeStepper /> : <FiltersSidebar />}</>
            </Drawer>
        </div>
    );
}
export default connect(mapStateToProps, mapDispatchToProps)(PersistentDrawerRight);
