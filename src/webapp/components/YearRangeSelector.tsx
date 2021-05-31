import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Slider, FormLabel } from "@material-ui/core";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import * as R from "ramda";
import { State } from "../store/types";
import { selectFilters } from "../store/reducers/base-reducer";
import { setFiltersAction } from "../store/actions/base-actions";
import { sendAnalytics } from "../utils/analytics";

export function range(start: number, end: number, reverse?: boolean) {
    const years = Array(end - start + 1)
        .fill(1)
        .map((_, idx) => start + idx);
    return reverse ? R.reverse(years) : years;
}
const marks = (start: number, end: number) =>
    range(start, end).map(year =>
        year % 5 === 0
            ? {
                  value: year,
                  label: year.toString(),
              }
            : {
                  value: year,
              }
    );

const useStyles = makeStyles({
    root: {
        margin: "0px 24px",
    },
    slider: {
        marginBottom: 20,
        marginTop: 8,
    },
});

function valuetext(value: number) {
    return `${value}°C`;
}

const mapStateToProps = (state: State) => ({
    filters: selectFilters(state),
});

const mapDispatchToProps = {
    setFilters: setFiltersAction,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type OwnProps = {
    minYear?: number;
    maxYear?: number;
};
type Props = OwnProps & DispatchProps & StateProps;

const YearRangeSelector = ({ filters, setFilters, minYear = 1988, maxYear = 2021 }: Props) => {
    const classes = useStyles({});
    const { t } = useTranslation();

    const handleChange = (event: any, newValue: number | number[]) => {
        const [start, end] = newValue as number[];
        const [prevStart, prevEnd] = filters;
        const label = `(${start}, ${end})`;

        if (prevStart !== start || prevEnd !== end) {
            sendAnalytics({ type: "event", category: "filter", action: "Years", label });
            setFilters(newValue as number[]);
        }
    };

    return (
        <div className={classes.root}>
            <FormLabel component="legend">{t("common.filters.years")}</FormLabel>
            <Slider
                className={classes.slider}
                value={filters}
                onChange={handleChange}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
                getAriaValueText={valuetext}
                marks={marks(minYear, maxYear)}
                step={1}
                min={minYear}
                max={maxYear}
            />
        </div>
    );
};
export default connect(mapStateToProps, mapDispatchToProps)(YearRangeSelector);
