import React from "react";
import { Slider, styled as MuiStyled, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import * as R from "ramda";
import styled from "styled-components";
import { Divider } from "../../../../components/filters/Filters";

const StyledSlider = MuiStyled(Slider)(() => ({
    display: "table",
    margin: "0 auto",
    padding: "0px 0px 8px 0px",
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

type DashboardsYearRangeSelectorProps = {
    years: [number, number];
    maxMinYears: [number, number];
    onChange: (years: [number, number]) => void;
};

export function range(start: number, end: number, reverse?: boolean) {
    const years = Array(end - start + 1)
        .fill(1)
        .map((_, idx) => start + idx);
    return reverse ? R.reverse(years) : years;
}

const DashboardsYearRangeSelector: React.FC<DashboardsYearRangeSelectorProps> = ({ years, onChange, maxMinYears }) => {
    const { t } = useTranslation();

    const handleChange = (_event: Event, newValue: number | number[]) => {
        const [start, end] = newValue as number[];
        const [prevStart, prevEnd] = years;

        if (prevStart !== start || prevEnd !== end) {
            onChange(newValue as [number, number]);
        }
    };

    return (
        <Container>
            <Typography variant="body2" fontWeight="bold" sx={{ marginBottom: "20px" }}>
                {t("common.filters.years")}
            </Typography>
            <Divider />
            <StyledSlider
                color="primary"
                size="small"
                value={years}
                onChange={handleChange}
                valueLabelDisplay="on"
                aria-labelledby="range-slider"
                getAriaValueText={valuetext}
                step={1}
                min={maxMinYears[0]}
                max={maxMinYears[1]}
            />
            <Row>
                {[maxMinYears[0], Math.floor((maxMinYears[0] + maxMinYears[1]) / 2), maxMinYears[1]].map(year => {
                    return <span key={year}>{year}</span>;
                })}
            </Row>
        </Container>
    );
};
export default DashboardsYearRangeSelector;

const Row = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-size: 10px;
    margin: 15px 0px;
    padding: 0px 15px;
`;

export const Container = styled.div``;
