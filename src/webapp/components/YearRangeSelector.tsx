import React, { useCallback, useEffect, useRef, useState } from "react";
import { Slider, styled as MuiStyled, Divider as MuiDivider, Typography, Box } from "@mui/material";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import * as R from "ramda";
import { State } from "../store/types";
import { selectFilters, selectMaxMinYears } from "../store/reducers/base-reducer";
import { setFiltersAction } from "../store/actions/base-actions";
import { sendAnalytics } from "../utils/analytics";
import { Divider, FilterColumContainer } from "./filters/Filters";
import styled from "styled-components";
import TheaterMode from "./TheaterMode/TheaterMode";

const Row = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-size: 10px;
    margin: 15px 0px;
    padding: 0px 15px;
`;

const StyledSlider = MuiStyled(Slider)(() => ({
    display: "table",
    margin: "0 auto",
    padding: "0px 0px 8px 0px",
    width: "80%",
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
    maxMinYears: selectMaxMinYears(state),
});

const mapDispatchToProps = {
    setFilters: setFiltersAction,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type OwnProps = {
    showTheatherMode?: boolean;
};
type Props = OwnProps & DispatchProps & StateProps;

export function range(start: number, end: number, reverse?: boolean) {
    const years = Array(end - start + 1)
        .fill(1)
        .map((_, idx) => start + idx);
    return reverse ? R.reverse(years) : years;
}

const YearRangeSelector = ({ maxMinYears, filters, setFilters, showTheatherMode = true }: Props) => {
    const { t } = useTranslation();

    const sliderRef = useRef<HTMLDivElement>(null);
    const [thumbPositions, setThumbPositions] = useState<[number, number]>([0, 0]);
    const [activeThumb, setActiveThumb] = useState<number>();

    const updateThumbPositions = useCallback(() => {
        if (!sliderRef.current) return;
        const sliderLeft = sliderRef.current.getBoundingClientRect().left;
        const thumbs = sliderRef.current.querySelectorAll(".MuiSlider-thumb") as NodeListOf<HTMLElement>;

        if (thumbs.length !== 2) return;
        const [thumb1, thumb2] = thumbs;
        const position1 = thumb1.getBoundingClientRect().left + thumb1.offsetWidth / 2 - sliderLeft;
        const position2 = thumb2.getBoundingClientRect().left + thumb2.offsetWidth / 2 - sliderLeft;

        setThumbPositions([position1, position2]);
    }, []);

    useEffect(() => {
        updateThumbPositions();
        window.addEventListener("resize", updateThumbPositions);
        return () => window.removeEventListener("resize", updateThumbPositions);
    }, [filters, updateThumbPositions]);

    const handleChange = (event: Event, newValue: number | number[], activeThumbIndex: number) => {
        const [start, end] = newValue as number[];
        const [prevStart, prevEnd] = filters;
        const label = `(${start}, ${end})`;

        if (prevStart !== start || prevEnd !== end) {
            sendAnalytics({ type: "event", category: "filter", action: "Years", label });
            setFilters(newValue as number[]);
            setActiveThumb(activeThumbIndex);
        }
    };

    return (
        <FilterColumContainer padding="0px">
            <Typography
                component="legend"
                variant="body2"
                color={"dimgray"}
                sx={{ marginBottom: "20px", padding: "10px" }}
            >
                {t("common.filters.years")}
            </Typography>
            <Divider />

            <Box ref={sliderRef} sx={{ position: "relative" }}>
                {filters.map((filter, index) => {
                    return (
                        <DynamicLabel
                            key={index}
                            value={filter}
                            index={index}
                            filters={filters}
                            thumbPositions={thumbPositions}
                            activeThumb={activeThumb}
                            maxMinYears={maxMinYears}
                        />
                    );
                })}

                <StyledSlider
                    color="primary"
                    size="small"
                    value={filters}
                    onChange={handleChange}
                    valueLabelDisplay="off"
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
            </Box>

            <MuiDivider />
            {showTheatherMode && <TheaterMode />}
        </FilterColumContainer>
    );
};
export default connect(mapStateToProps, mapDispatchToProps)(YearRangeSelector);

const DynamicLabel: React.FC<DynamicLabelProps> = ({
    activeThumb,
    filters,
    index,
    maxMinYears,
    thumbPositions,
    value,
}) => {
    const [minYear, maxYear] = filters;
    const steps = maxMinYears[1] - maxMinYears[0];
    const yearOverlapLimit = Math.round(steps / 10); // 10% of the range
    const overlap = Math.abs(minYear - maxYear) <= yearOverlapLimit;
    const offsetY = overlap && activeThumb === index ? -35 : -21.5;
    const leftPosition = thumbPositions[index] - 22;

    return (
        <Box
            sx={{
                position: "absolute",
                transform: `translate(50%, ${offsetY}px)`,
                left: `${leftPosition}px`,
                pointerEvents: "none",
                transition: "transform 0.2s ease",
            }}
        >
            <Typography fontWeight="bold" sx={{ color: "#2fb3af", fontSize: "10px" }}>
                {value}
            </Typography>
        </Box>
    );
};

type DynamicLabelProps = {
    activeThumb?: number;
    filters: number[];
    index: number;
    maxMinYears?: number[];
    thumbPositions: [number, number];
    value: number;
};
