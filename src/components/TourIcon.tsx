import React from "react";
import { createStyles, Fab, makeStyles, Theme } from "@material-ui/core";
import HelpIcon from "@material-ui/icons/Help";
import { State } from "../store/types";
import {
  setInitialDialogOpen,
  setTourOpenAction,
} from "../store/actions/base-actions";
import { selectTour } from "../store/reducers/base-reducer";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(1),
      "& > *": {
        margin: theme.spacing(1),
        width: "25ch",
      },
    },
    fab: {
      pointerEvents: "all",
      margin: theme.spacing(0.5, 0.5),
    },
    paper: {
      margin: theme.spacing(1),
      padding: theme.spacing(3),
      width: "100%",
    },
  })
);

const mapStateToProps = (state: State) => ({
  tour: selectTour(state),
});

const mapDispatchToProps = {
  setTourOpen: setTourOpenAction,
  setInitialDialogOpen: setInitialDialogOpen,
};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

const TourIcon = ({ tour, setTourOpen, setInitialDialogOpen }: Props) => {
  const classes = useStyles({});
  const { t } = useTranslation("common");

  return (
    <React.Fragment>
      <Fab
        id="country-button"
        size="small"
        color={"default"}
        className={classes.fab}
        onClick={() => {
          localStorage.setItem("tour", "");
          window.history.pushState({}, document.title, "/");
          window.location.reload();
        }}
        title={t("icons.help")}
      >
        <HelpIcon />
      </Fab>
    </React.Fragment>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(TourIcon);
