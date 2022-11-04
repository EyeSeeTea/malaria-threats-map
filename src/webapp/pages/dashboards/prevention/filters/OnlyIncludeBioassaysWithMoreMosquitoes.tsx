import React from "react";
import { Slider, styled as MuiStyled, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Divider } from "../../../../components/filters/Filters";

type DashboardsYearRangeSelectorProps = {
    value: number;
    onChange: (value: number) => void;
};

const OnlyIncludeBioassaysWithMoreMosquitoes: React.FC<DashboardsYearRangeSelectorProps> = ({ value, onChange }) => {
    const { t } = useTranslation();

    const handleChange = (_event: Event, newValue: number | number[]) => {
        if (!Array.isArray(newValue)) {
            onChange(newValue);
        }
    };

    return (
        <Container>
            <Typography variant="body2" fontWeight="bold" sx={{ marginBottom: "20px" }}>
                {t("common.filters.onlyIncludeBioassays")}
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
                min={0}
                max={150}
            />
            <Row>
                <Typography variant="caption" fontWeight="bold">
                    {t("common.filters.zero_all_bioassays")}
                </Typography>
                <Typography variant="caption" fontWeight="bold">
                    {"150+"}
                </Typography>
            </Row>
        </Container>
    );
};
export default OnlyIncludeBioassaysWithMoreMosquitoes;

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

export const Container = styled.div``;
