import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";
import FormLabel from "@material-ui/core/FormLabel";
import { connect } from "react-redux";
import { State } from "../store/types";
import { selectFilters } from "../store/reducers/base-reducer";
import { setFiltersAction } from "../store/actions/base-actions";

function range(start: number, end: number) {
  return Array(end - start + 1)
    .fill(1)
    .map((_, idx) => start + idx);
}
const marks = range(1988, 2019).map(year =>
  year % 5 === 0
    ? {
        value: year,
        label: year.toString()
      }
    : {
        value: year
      }
);

const useStyles = makeStyles({
  root: {
    margin: 24
  },
  slider: {
    marginBottom: 20,
    marginTop: 8
  }
});

function valuetext(value: number) {
  return `${value}°C`;
}

const mapStateToProps = (state: State) => ({
  filters: selectFilters(state)
});

const mapDispatchToProps = {
  setFilters: setFiltersAction
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type OwnProps = {
  minYear?: number;
  maxYear?: number;
};
type Props = OwnProps & DispatchProps & StateProps;

const YearRangeSelector = ({
  filters,
  setFilters,
  minYear = 1988,
  maxYear = 2019
}: Props) => {
  const classes = useStyles({});

  const handleChange = (event: any, newValue: number | number[]) => {
    setFilters(newValue as number[]);
  };

  return (
    <div className={classes.root}>
      <FormLabel component="legend">Years</FormLabel>
      <Slider
        className={classes.slider}
        value={filters}
        onChange={handleChange}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        getAriaValueText={valuetext}
        marks={marks}
        step={1}
        min={minYear}
        max={maxYear}
      />
    </div>
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(YearRangeSelector);
