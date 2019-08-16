import React from "react";
import IconButton from "@material-ui/core/IconButton";
import LayersIcon from "@material-ui/icons/Layers";
import { State } from "../store/types";
import { selectEndemicity } from "../malaria/reducer";
import {
  setFiltersAction,
  toggleEndemicityLayerAction
} from "../malaria/actions";
import { connect } from "react-redux";

function Layers({ toogleEndemicityLayer, endemicityLayer }: any) {
  const handleToggle = () => {
    toogleEndemicityLayer(!endemicityLayer);
  };
  return (
    <IconButton onClick={handleToggle}>
      <LayersIcon />
    </IconButton>
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
