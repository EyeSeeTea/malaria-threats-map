import React from "react";
import { createStyles, Fab, makeStyles, Theme } from "@material-ui/core";
import ReportIcon from "@material-ui/icons/School";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import { State } from "../../store/types";
import { selectIsReportOpen } from "../../store/reducers/base-reducer";
import { setReportOpenAction } from "../../store/actions/base-actions";
import { connect } from "react-redux";
import StudiesTable from "./StudiesTable";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      pointerEvents: "all",
      margin: theme.spacing(0.5, 0)
    },
    form: {
      display: "flex",
      flexDirection: "column",
      margin: "auto",
      width: "fit-content"
    },
    formControl: {
      marginTop: theme.spacing(2),
      minWidth: 120
    },
    formControlLabel: {
      marginTop: theme.spacing(1)
    },
    paper: {
      backgroundColor: "#fafafa"
    },
    content: {
      padding: "0 !important"
    }
  })
);

const mapStateToProps = (state: State) => ({
  isReportOpen: selectIsReportOpen(state)
});
const mapDispatchToProps = {
  openReport: setReportOpenAction
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type OwnProps = {};
type Props = StateProps & OwnProps & DispatchProps;

function Report({ isReportOpen, openReport }: Props) {
  const classes = useStyles({});

  const handleClickOpen = () => {
    openReport(true);
  };

  const handleClose = () => {
    openReport(false);
  };

  return (
    <React.Fragment>
      <Fab
        id="country-button"
        size="small"
        color={isReportOpen ? "primary" : "default"}
        onClick={handleClickOpen}
        className={classes.fab}
      >
        <ReportIcon />
      </Fab>
      <Dialog
        fullWidth
        maxWidth={"xl"}
        open={isReportOpen}
        onClose={handleClose}
        aria-labelledby="max-width-dialog-title"
      >
        <DialogContent className={classes.content}>
          <StudiesTable />
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Report);
