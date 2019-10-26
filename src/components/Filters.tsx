import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import Slide from "@material-ui/core/Slide";
import { TransitionProps } from "@material-ui/core/transitions";
import FilterIcon from "@material-ui/icons/FilterList";
import { AppBar, Fab, Toolbar, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import styled from "styled-components";
import {
  DiagnosisMapType,
  InvasiveMapType,
  PreventionMapType,
  State,
  TreatmentMapType
} from "../store/types";
import { selectFilters, selectTheme } from "../store/reducers/base-reducer";
import { selectPreventionFilters } from "../store/reducers/prevention-reducer";
import { setPreventionMapType } from "../store/actions/prevention-actions";
import { connect } from "react-redux";
import ResistanceStatusFilters from "./layers/prevention/ResistanceStatus/ResistanceStatusFilters";
import IntensityStatusFilters from "./layers/prevention/IntensityStatus/IntensityStatusFilters";
import ResistanceMechanismFilters from "./layers/prevention/ResistanceMechanisms/ResistanceMechanismFilters";
import LevelOfInvolvementFilters from "./layers/prevention/Involvement/LevelOfInvolvementFilters";
import GeneDeletionFilters from "./layers/diagnosis/GeneDeletions/GeneDeletionFilters";
import { selectDiagnosisFilters } from "../store/reducers/diagnosis-reducer";
import PboDeploymentFilters from "./layers/prevention/PboDeployment/PboDeploymentFilters";
import TreatmentFailureFilters from "./layers/treatment/TreatmentFailure/TreatmentFailureFilters";
import { selectTreatmentFilters } from "../store/reducers/treatment-reducer";
import VectorOccuranceFilters from "./layers/invasive/VectorOccurance/VectorOccuranceFilters";
import { selectInvasiveFilters } from "../store/reducers/invasive-reducer";
import DelayedParasiteClearanceFilters from "./layers/treatment/DelayedParasiteClearance/DelayedParasiteClearanceFilters";
import MolecularMarkerFilters from "./layers/treatment/MolecularMarkers/MolecularMarkerFilters";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      backgroundColor: "#008dc9",
      position: "relative"
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1
    },
    fab: {
      margin: theme.spacing(0.5, 0)
    },
    extendedIcon: {
      marginRight: theme.spacing(0.5)
    },
    paper: {
      backgroundColor: "#f3f3f3"
    }
  })
);

const FiltersWrapper = styled.div`
  margin-top: 10px;
`;

const Transition = React.forwardRef<unknown, TransitionProps>(
  function Transition(props: any, ref: any) {
    return <Slide direction="right" ref={ref} {...props} />;
  }
);

const mapStateToProps = (state: State) => ({
  filters: selectFilters(state),
  theme: selectTheme(state),
  preventionFilters: selectPreventionFilters(state),
  diagnosisFilters: selectDiagnosisFilters(state),
  treatmentFilters: selectTreatmentFilters(state),
  invasiveFilters: selectInvasiveFilters(state)
});

const mapDispatchToProps = {
  setPreventionMapType: setPreventionMapType
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

function Filters({
  theme,
  preventionFilters,
  diagnosisFilters,
  treatmentFilters,
  invasiveFilters
}: Props) {
  const classes = useStyles({});
  const [open, setOpen] = React.useState(false);

  function handleClickOpen() {
    setOpen(true);
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

  return (
    <div>
      <Fab
        variant="extended"
        size="small"
        color="primary"
        onClick={handleClickOpen}
        className={classes.fab}
      >
        <FilterIcon className={classes.extendedIcon} fontSize="small" />
        Filters
      </Fab>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        BackdropProps={{
          style: {
            backgroundColor: "transparent"
          }
        }}
        PaperProps={{
          className: classes.paper
        }}
        style={{
          position: "absolute",
          left: 0,
          maxWidth: "400px"
        }}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <FilterIcon />
            <Typography variant="h6" className={classes.title}>
              {" "}
              Filters
            </Typography>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <FiltersWrapper>{resolveFilters()}</FiltersWrapper>
      </Dialog>
    </div>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Filters);
