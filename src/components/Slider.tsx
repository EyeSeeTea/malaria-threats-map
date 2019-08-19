import React from "react";
import {
  makeStyles,
  Theme,
  createStyles,
  withStyles
} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import { State } from "../store/types";
import { selectPreventionStudies } from "../malaria/prevention/reducer";
import { selectFilters, selectTheme } from "../malaria/reducer";
import { setFiltersAction } from "../malaria/actions";
import { connect } from "react-redux";
import { colors } from "./theme";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      color: "#52af77",
      marginTop: 32
    },
    margin: {
      height: theme.spacing(3)
    }
  })
);

const PrettoSlider = withStyles({
  root: {
    color: colors.prevention.N,
    height: 8
  }
})(Slider);

const marks = [
  {
    value: 2000,
    label: "2000"
  },
  {
    value: 2005,
    label: "2005"
  },
  {
    value: 2010,
    label: "2010"
  },
  {
    value: 2015,
    label: "2015"
  },
  {
    value: 2020,
    label: "2020"
  }
];

function valuetext(value: number) {
  return `${value}°C`;
}

function valueLabelFormat(value: number) {
  return marks.findIndex(mark => mark.value === value) + 1;
}

const mapStateToProps = (state: State) => ({
  filters: selectFilters(state)
});

const mapDispatchToProps = {
  setFilter: setFiltersAction
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

type Props = StateProps & DispatchProps;

function DiscreteSlider({ filters, setFilter }: Props) {
  const classes = useStyles({});

  function onChange(event: any, value: any) {
    setFilter([value]);
  }

  return (
    <div className={classes.root}>
      <PrettoSlider
        value={filters[0]}
        valueLabelFormat={valueLabelFormat}
        getAriaValueText={valuetext}
        aria-labelledby="discrete-slider-restrict"
        valueLabelDisplay="auto"
        step={1}
        marks
        onChange={onChange}
        min={1998}
        max={2019}
      />
    </div>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DiscreteSlider);
