import React from "react";
import { connect } from "react-redux";
import { logEventAction } from "../../../store/actions/base-actions";
import { Slider, styled as MuiStyled, Typography } from "@mui/material";
import styled from "styled-components";
import { Divider, FilterColumContainer } from "../Filters";

type OwnProps = {
    label: string;
    minLabel: string;
    maxLabel: string;
    onChange: (value: number) => void;
    value: number;
    min: number;
    max: number;
    analyticsFilterAction?: string;
    background?: string;
    fontWeight?: string;
    margin?: string;
    padding?: string;
};

const mapDispatchToProps = {
    logEventAction: logEventAction,
};

type DispatchProps = typeof mapDispatchToProps;
type Props = OwnProps & DispatchProps;

function SliderFilter({
    label,
    minLabel,
    maxLabel,
    onChange,
    value,
    min,
    max,
    analyticsFilterAction,
    logEventAction,
    background,
    fontWeight,
    margin,
    padding,
}: Props) {
    const handleChange = (_event: Event, newValue: number | number[]) => {
        if (!Array.isArray(newValue)) {
            onChange(newValue);

            if (analyticsFilterAction) {
                logEventAction({ category: "filter", action: analyticsFilterAction, label: value.toString() });
            }
        }
    };

    return (
        <FilterColumContainer background={background} margin={margin} padding={padding}>
            <Typography variant="body2" fontWeight={fontWeight} sx={{ marginBottom: "20px" }}>
                {label}
            </Typography>
            <Divider />
            <StyledSlider
                color="primary"
                size="small"
                value={value}
                onChange={handleChange}
                valueLabelDisplay="on"
                aria-labelledby="range-slider"
                step={1}
                min={min}
                max={max}
            />
            <Row>
                <Typography variant="caption" fontWeight={fontWeight}>
                    {minLabel}
                </Typography>
                <Typography variant="caption" fontWeight={fontWeight}>
                    {maxLabel}
                </Typography>
            </Row>
        </FilterColumContainer>
    );
}

export default connect(null, mapDispatchToProps)(SliderFilter);

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

const Row = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-size: 10px;
    margin: 15px 0px;
    padding: 0px 15px;
`;
