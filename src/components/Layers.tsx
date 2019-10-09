import React from "react";
import LayersIcon from "@material-ui/icons/Layers";
import { State } from "../store/types";
import { connect } from "react-redux";
import { createStyles, Fab, makeStyles, Theme } from "@material-ui/core";
import { selectEndemicity } from "../store/reducers/base-reducer";
import {
  setFiltersAction,
  toggleEndemicityLayerAction
} from "../store/actions/base-actions";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      margin: theme.spacing(0.5, 0)
    }
  })
);

function Layers({ toogleEndemicityLayer, endemicityLayer }: any) {
  const classes = useStyles({});
  const handleToggle = () => {
    toogleEndemicityLayer(!endemicityLayer);
  };
  return (
    <div>
      <Fab
        size="small"
        color={endemicityLayer ? "primary" : "default"}
        onClick={handleToggle}
        className={classes.fab}
      >
        <LayersIcon />
      </Fab>
    </div>
  );
}

const mapStateToProps = (state: State) => ({
  endemicityLayer: selectEndemicity(state)
});

const mapDispatchToProps = {
  toogleEndemicityLayer: toggleEndemicityLayerAction,
  setFilters: setFiltersAction
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Layers);
