import React from "react";
import { State } from "../store/types";
import { connect } from "react-redux";
import { createStyles, Fab, makeStyles, Theme } from "@material-ui/core";
import { selectCountryMode } from "../store/reducers/base-reducer";
import { setCountryModeAction } from "../store/actions/base-actions";
import { GlobeIcon } from "./Icons";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      margin: theme.spacing(0.5, 0)
    }
  })
);

function Layers({ countryMode, setCountryMode, disabled }: any) {
  const classes = useStyles({});
  const handleToggle = () => {
    setCountryMode(!countryMode);
  };
  return (
    <div>
      <Fab
        size="small"
        color={countryMode ? "primary" : "default"}
        onClick={handleToggle}
        className={classes.fab}
        disabled={disabled}
        aria-label={"Show studies per country"}
        title={"Show studies per country"}
      >
        <GlobeIcon />
      </Fab>
    </div>
  );
}

const mapStateToProps = (state: State) => ({
  countryMode: selectCountryMode(state)
});

const mapDispatchToProps = {
  setCountryMode: setCountryModeAction
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Layers);
