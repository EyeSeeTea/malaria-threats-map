import React, { useEffect } from "react";
import clsx from "clsx";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import CssBaseline from "@mui/material/CssBaseline";
import Disclaimer from "../../components/Disclaimer";
import styled from "styled-components";
import { connect } from "react-redux";
import { State } from "../../store/types";
import { selectFilters, selectTheme } from "../../store/reducers/base-reducer";
import { setMobileOptionsOpen, setRegionAction, setThemeAction } from "../../store/actions/base-actions";
import { selectPreventionFilters } from "../../store/reducers/prevention-reducer";
import { selectDiagnosisFilters } from "../../store/reducers/diagnosis-reducer";
import { selectTreatmentFilters } from "../../store/reducers/treatment-reducer";
import { selectInvasiveFilters } from "../../store/reducers/invasive-reducer";
import { setPreventionMapType } from "../../store/actions/prevention-actions";
import { AppBar, IconButton, Tab, Tabs, Toolbar } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { DiagnosisIcon, FilterIcon, InvasiveIcon, PreventionIcon, TreatmentIcon } from "../../components/Icons";
import { colors } from "../../constants/theme";
import MobileOptions from "../../components/MobileOptions";
import Loader from "../../components/Loader";
import Hidden from "../../components/hidden/Hidden";
import MapContainer from "../../components/MapContainer";
import DisplaySuggestionModal from "../../components/DisplaySuggestionModal";
import { useLocation } from "react-router-dom";

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
    filters: selectFilters(state),
    theme: selectTheme(state),
    preventionFilters: selectPreventionFilters(state),
    diagnosisFilters: selectDiagnosisFilters(state),
    treatmentFilters: selectTreatmentFilters(state),
    invasiveFilters: selectInvasiveFilters(state),
});
const mapDispatchToProps = {
    setMobileOptionsOpen: setMobileOptionsOpen,
    setPreventionMapType: setPreventionMapType,
    setTheme: setThemeAction,
    setRegion: setRegionAction,
};
type OwnProps = {
    drawerWidth?: string;
};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps & OwnProps;

function MapPage({ setMobileOptionsOpen, drawerWidth = "500px", setTheme, setRegion, theme }: Props) {
    const classes = useStyles({ drawerWidth });
    const { search } = useLocation();

    const themes = ["prevention", "diagnosis", "treatment", "invasive"];

    useEffect(() => {
        const params = new URLSearchParams(search);
        const theme = params.get("theme");
        const country = params.get("country");
        if (theme) {
            setTheme(theme);
        }
        if (country) {
            setTimeout(() => {
                setRegion({ country: country });
            }, 500);
        }
    }, [search, setRegion, setTheme]);

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
        <>
            <DisplaySuggestionModal />
            <div className={`${classes.root}`}>
                <Loader />
                <CssBaseline />
                <div className={clsx(classes.content)}>
                    <div className={classes.drawerHeader} />
                    <PageWrapper>
                        <Hidden smUp>
                            <AppBar position="static" color="default">
                                <Toolbar className={classes.toolbar}>
                                    <IconButton className={classes.iconButton} aria-label="menu" size="large">
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
                            <MapContainer />
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
            </div>
        </>
    );
}
export default connect(mapStateToProps, mapDispatchToProps)(MapPage);
