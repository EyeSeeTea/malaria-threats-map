import React from "react";
import { Slider, FormLabel, styled as muiStyled } from "@mui/material";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import * as R from "ramda";
import { State } from "../store/types";
import { selectFilters } from "../store/reducers/base-reducer";
import { setFiltersAction } from "../store/actions/base-actions";
import { sendAnalytics } from "../utils/analytics";
import { Divider, FilterColumContainer } from "./filters/Filters";
import styled from "styled-components";

const Row = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-size: 10px;
    margin-top: 5px;
`;

const StyledSlider = muiStyled(Slider)(() => ({
    color: "#2fb3af",
    display: "table",
    margin: "0 auto",
    padding: "5px 0px",
    width: "90%",
    "& .MuiSlider-valueLabel": {
        fontSize: 10,
        fontWeight: "bold",
        backgroundColor: "unset",
        color: "#2fb3af",
        top: "-2px",
        "&:before": {
            display: "none",
        },
        "& *": {
            background: "transparent",
            color: "#2fb3af",
        },
    },
}));

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

export function range(start: number, end: number, reverse?: boolean) {
    const years = Array(end - start + 1)
        .fill(1)
        .map((_, idx) => start + idx);
    return reverse ? R.reverse(years) : years;
}

const YearRangeSelector = ({ filters, setFilters, minYear = 1988, maxYear = new Date().getFullYear() }: Props) => {
    const { t } = useTranslation();

    const handleChange = (event: Event, newValue: number | number[]) => {
        const [start, end] = newValue as number[];
        const [prevStart, prevEnd] = filters;
        const label = `(${start}, ${end})`;

        if (prevStart !== start || prevEnd !== end) {
            sendAnalytics({ type: "event", category: "filter", action: "Years", label });
            setFilters(newValue as number[]);
        }
    };

    return (
        <FilterColumContainer padding={"10px"}>
            <FormLabel component="legend" sx={{ marginBottom: "20px" }}>
                {t("common.filters.years")}
            </FormLabel>
            <Divider />
            <StyledSlider
                size="small"
                value={filters}
                onChange={handleChange}
                valueLabelDisplay="on"
                aria-labelledby="range-slider"
                getAriaValueText={valuetext}
                step={1}
                min={minYear}
                max={maxYear}
            />
            <Row>
                {[minYear, maxYear - 10, maxYear].map(year => {
                    return <span key={year}>{year}</span>;
                })}
            </Row>
        </FilterColumContainer>
    );
};
export default connect(mapStateToProps, mapDispatchToProps)(YearRangeSelector);
