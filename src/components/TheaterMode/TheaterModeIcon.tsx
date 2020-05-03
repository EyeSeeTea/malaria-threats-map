import React from "react";
import TheaterIcon from "@material-ui/icons/PlayCircleFilled";
import { connect } from "react-redux";
import { createStyles, Fab, makeStyles, Theme } from "@material-ui/core";
import { setTheaterModeAction } from "../../store/actions/base-actions";
import { State } from "../../store/types";
import {
  selectIsFeedbackOpen,
  selectTheaterMode
} from "../../store/reducers/base-reducer";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      pointerEvents: "all",
      margin: theme.spacing(0.5, 0)
    }
  })
);

const mapStateToProps = (state: State) => ({
  theaterMode: selectTheaterMode(state)
});

const mapDispatchToProps = {
  setTheaterMode: setTheaterModeAction
};

function TheaterModeIcon({ theaterMode, setTheaterMode }: any) {
  const classes = useStyles({});
  return (
    <div>
      <Fab
        size="small"
        color={theaterMode ? "primary" : "default"}
        onClick={() => setTheaterMode(!theaterMode)}
        className={classes.fab}
      >
        <TheaterIcon />
      </Fab>
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(TheaterModeIcon);
