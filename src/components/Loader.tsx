import React from "react";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { State } from "../store/types";
import { selectTheme } from "../store/reducers/base-reducer";
import { selectPreventionStudiesLoading } from "../store/reducers/prevention-reducer";
import { selectDiagnosisStudiesLoading } from "../store/reducers/diagnosis-reducer";
import { selectInvasiveStudiesLoading } from "../store/reducers/invasive-reducer";
import { selectTreatmentStudiesLoading } from "../store/reducers/treatment-reducer";
import { connect } from "react-redux";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff"
    }
  })
);

const mapStateToProps = (state: State) => ({
  theme: selectTheme(state),
  preventionLoading: selectPreventionStudiesLoading(state),
  diagnosisLoading: selectDiagnosisStudiesLoading(state),
  treatmentLoading: selectTreatmentStudiesLoading(state),
  invasiveLoading: selectInvasiveStudiesLoading(state)
});

const mapDispatchToProps = {};
type OwnProps = {};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps & OwnProps;

function SimpleBackdrop(props: Props) {
  const classes = useStyles(props);

  const isLoading = () => {
    switch (props.theme) {
      case "prevention":
        return props.preventionLoading;
      case "diagnosis":
        return props.diagnosisLoading;
      case "treatment":
        return props.treatmentLoading;
      case "invasive":
        return props.invasiveLoading;
      default:
        return false;
    }
  };

  return (
    <div>
      <Backdrop className={classes.backdrop} open={isLoading()}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SimpleBackdrop);
