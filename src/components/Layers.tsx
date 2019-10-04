import React from "react";
import LayersIcon from "@material-ui/icons/Layers";
import { State } from "../store/types";
import { selectEndemicity } from "../malaria/reducer";
import {
  setFiltersAction,
  toggleEndemicityLayerAction
} from "../malaria/actions";
import { connect } from "react-redux";
import FilterIcon from "@material-ui/core/SvgIcon/SvgIcon";
import { createStyles, Fab, makeStyles, Theme } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      margin: theme.spacing(0.5, 0)
    },
    extendedIcon: {
      marginRight: theme.spacing(1)
    }
  })
);

function Layers({ toogleEndemicityLayer, endemicityLayer }: any) {
  const classes = useStyles({});
  const handleToggle = () => {
    toogleEndemicityLayer(!endemicityLayer);
  };
  return (
    <Fab
      variant="extended"
      color="default"
      onClick={handleToggle}
      className={classes.fab}
    >
      <LayersIcon className={classes.extendedIcon} />
      Layers
    </Fab>
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
