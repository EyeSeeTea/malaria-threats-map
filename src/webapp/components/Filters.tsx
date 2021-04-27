import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import Slide from "@material-ui/core/Slide";
import { TransitionProps } from "@material-ui/core/transitions";
import { AppBar, Fab, Paper, Toolbar, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import styled from "styled-components";
import { DiagnosisMapType, InvasiveMapType, PreventionMapType, State, TreatmentMapType } from "../store/types";
import { selectAreFiltersOpen, selectFilters, selectTheme } from "../store/reducers/base-reducer";
import { selectFilteredPreventionStudies, selectPreventionFilters } from "../store/reducers/prevention-reducer";
import { setPreventionMapType } from "../store/actions/prevention-actions";
import { connect } from "react-redux";
import ResistanceStatusFilters from "./layers/prevention/ResistanceStatus/ResistanceStatusFilters";
import IntensityStatusFilters from "./layers/prevention/IntensityStatus/IntensityStatusFilters";
import ResistanceMechanismFilters from "./layers/prevention/ResistanceMechanisms/ResistanceMechanismFilters";
import LevelOfInvolvementFilters from "./layers/prevention/Involvement/LevelOfInvolvementFilters";
import GeneDeletionFilters from "./layers/diagnosis/GeneDeletions/GeneDeletionFilters";
import { selectDiagnosisFilters, selectFilteredDiagnosisStudies } from "../store/reducers/diagnosis-reducer";
import PboDeploymentFilters from "./layers/prevention/PboDeployment/PboDeploymentFilters";
import TreatmentFailureFilters from "./layers/treatment/TreatmentFailure/TreatmentFailureFilters";
import { selectFilteredTreatmentStudies, selectTreatmentFilters } from "../store/reducers/treatment-reducer";
import VectorOccuranceFilters from "./layers/invasive/VectorOccurance/VectorOccuranceFilters";
import { selectFilteredInvasiveStudies, selectInvasiveFilters } from "../store/reducers/invasive-reducer";
import DelayedParasiteClearanceFilters from "./layers/treatment/DelayedParasiteClearance/DelayedParasiteClearanceFilters";
import MolecularMarkerFilters from "./layers/treatment/MolecularMarkers/MolecularMarkerFilters";
import { setFiltersOpen } from "../store/actions/base-actions";
import { dispatchCustomEvent } from "../utils/dom-utils";
import { useTranslation } from "react-i18next";
import { FilterIconSimple } from "./Icons";
import { sendAnalytics } from "../utils/analytics";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        appBar: {
            backgroundColor: "#008dc9",
            position: "relative",
        },
        title: {
            marginLeft: theme.spacing(2),
            flex: 1,
        },
        fab: {
            pointerEvents: "all",
            margin: theme.spacing(0.5, 0),
        },
        extendedIcon: {
            marginRight: theme.spacing(0.5),
        },
        paper: {
            backgroundColor: "#f3f3f3",
        },
        popover: {
            padding: theme.spacing(2),
        },
    })
);

const FiltersWrapper = styled.div`
    margin-top: 10px;
`;

export const Snackbar = styled(Paper)`
    margin: 16px;
    padding: 16px;
`;

export const WarningSnackbar = styled(Snackbar)`
    box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.14), 0 7px 10px -5px rgba(255, 152, 0, 0.4) !important;
    background-color: #ffa21a !important;
    color: #fff !important;
`;

export const SuccessSnackbar = styled(Snackbar)`
    box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.14), 0 7px 10px -5px rgba(76, 175, 80, 0.4) !important;
    background-color: #5cb860 !important;
    color: #fff !important;
`;

const Transition = React.forwardRef<unknown, TransitionProps>(function Transition(props: any, ref: any) {
    return <Slide direction="right" ref={ref} {...props} />;
});

const mapStateToProps = (state: State) => ({
    filters: selectFilters(state),
    theme: selectTheme(state),
    filteredPreventionStudies: selectFilteredPreventionStudies(state),
    filteredDiagnosisStudies: selectFilteredDiagnosisStudies(state),
    filteredTreatmentStudies: selectFilteredTreatmentStudies(state),
    filteredInvasiveStudies: selectFilteredInvasiveStudies(state),
    preventionFilters: selectPreventionFilters(state),
    diagnosisFilters: selectDiagnosisFilters(state),
    treatmentFilters: selectTreatmentFilters(state),
    invasiveFilters: selectInvasiveFilters(state),
    filtersOpen: selectAreFiltersOpen(state),
});

const mapDispatchToProps = {
    setPreventionMapType: setPreventionMapType,
    setFiltersOpen: setFiltersOpen,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

function Filters({
    theme,
    filteredPreventionStudies,
    filteredDiagnosisStudies,
    filteredTreatmentStudies,
    filteredInvasiveStudies,
    preventionFilters,
    diagnosisFilters,
    treatmentFilters,
    invasiveFilters,
    filtersOpen,
    setFiltersOpen,
}: Props) {
    const classes = useStyles({});
    const [open, setOpen] = React.useState(false);

    const filteredStudies = (() => {
        switch (theme) {
            case "prevention":
                return filteredPreventionStudies;
            case "diagnosis":
                return filteredDiagnosisStudies;
            case "treatment":
                return filteredTreatmentStudies;
            case "invasive":
                return filteredInvasiveStudies;
            default:
                return [];
        }
    })();

    function handleClickOpen() {
        sendAnalytics({ type: "event", category: "menu", action: "filter" });
        setFiltersOpen(!filtersOpen);
    }

    function handleClose() {
        setOpen(false);
    }

    function resolveFilters() {
        switch (theme) {
            case "prevention":
                switch (preventionFilters.mapType) {
                    case PreventionMapType.RESISTANCE_STATUS:
                        return <ResistanceStatusFilters />;
                    case PreventionMapType.INTENSITY_STATUS:
                        return <IntensityStatusFilters />;
                    case PreventionMapType.RESISTANCE_MECHANISM:
                        return <ResistanceMechanismFilters />;
                    case PreventionMapType.LEVEL_OF_INVOLVEMENT:
                        return <LevelOfInvolvementFilters />;
                    case PreventionMapType.PBO_DEPLOYMENT:
                        return <PboDeploymentFilters />;
                    default:
                        return <div />;
                }
            case "diagnosis":
                switch (diagnosisFilters.mapType) {
                    case DiagnosisMapType.GENE_DELETIONS:
                        return <GeneDeletionFilters />;
                    default:
                        return <div />;
                }
            case "treatment":
                switch (treatmentFilters.mapType) {
                    case TreatmentMapType.TREATMENT_FAILURE:
                        return <TreatmentFailureFilters />;
                    case TreatmentMapType.DELAYED_PARASITE_CLEARANCE:
                        return <DelayedParasiteClearanceFilters />;
                    case TreatmentMapType.MOLECULAR_MARKERS:
                        return <MolecularMarkerFilters />;
                    default:
                        return <div />;
                }
            case "invasive":
                switch (invasiveFilters.mapType) {
                    case InvasiveMapType.VECTOR_OCCURANCE:
                        return <VectorOccuranceFilters />;
                    default:
                        return <div />;
                }
            default:
                return <div />;
        }
    }
    dispatchCustomEvent("resize");

    const { t } = useTranslation("common");

    return (
        <div>
            <Fab
                id="filters"
                variant="extended"
                size="small"
                color={filtersOpen ? "primary" : "default"}
                className={classes.fab}
            >
                <FilterIconSimple className={classes.extendedIcon} fontSize="small" onClick={handleClickOpen} />
                <span onClick={handleClickOpen}>{t("filters.filters")}</span>
            </Fab>
            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
                BackdropProps={{
                    style: {
                        backgroundColor: "transparent",
                    },
                }}
                PaperProps={{
                    className: classes.paper,
                }}
                style={{
                    position: "absolute",
                    left: 0,
                    maxWidth: "400px",
                }}
            >
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <FilterIconSimple />
                        <Typography variant="h6" className={classes.title}>
                            {t("filters.filters")}
                        </Typography>
                        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <WarningSnackbar>
                    <Typography variant="body2">There are no studies available with the specified criteria</Typography>
                </WarningSnackbar>
                {!filteredStudies.length ? (
                    <WarningSnackbar>
                        <Typography variant="body2">
                            There are no studies available wioth the specified criteria
                        </Typography>
                    </WarningSnackbar>
                ) : (
                    <SuccessSnackbar>
                        <Typography variant="body2">
                            There are {filteredStudies.length} studies found with specified criteria
                        </Typography>
                    </SuccessSnackbar>
                )}
                <FiltersWrapper>{resolveFilters()}</FiltersWrapper>
            </Dialog>
        </div>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(Filters);
