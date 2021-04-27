import React from "react";
import {
    LegendContainer,
    LegendFooter,
    LegendLabels,
    LegendTitleContainer,
    LegendTitleTypography,
} from "../../../Leyend";
import { INTENSITY_STATUS } from "./utils";
import { IntensityStatusColors } from "./symbols";
import { useTranslation } from "react-i18next";

export default function Legend() {
    const { t } = useTranslation("common");
    const labels = [
        {
            label: "prevention.legend.resistance_intensity.high_intensity",
            color: IntensityStatusColors[INTENSITY_STATUS.HIGH_INTENSITY][0],
        },
        {
            label: "prevention.legend.resistance_intensity.moderate_to_high_intensity",
            color: IntensityStatusColors[INTENSITY_STATUS.MODERATE_TO_HIGH_INTENSITY][0],
        },
        {
            label: "prevention.legend.resistance_intensity.moderate_intensity",
            color: IntensityStatusColors[INTENSITY_STATUS.MODERATE_INTENSITY][0],
        },
        {
            label: "prevention.legend.resistance_intensity.low_intensity",
            color: IntensityStatusColors[INTENSITY_STATUS.LOW_INTENSITY][0],
        },
        {
            label: "prevention.legend.resistance_intensity.susceptible",
            color: IntensityStatusColors[INTENSITY_STATUS.SUSCEPTIBLE][0],
        },
    ];
    return (
        <LegendContainer>
            <LegendTitleContainer>
                <LegendTitleTypography color="textPrimary" gutterBottom>
                    {t("prevention.resistance_intensity")}
                </LegendTitleTypography>
            </LegendTitleContainer>
            <LegendLabels labels={labels} />
            <LegendFooter />
        </LegendContainer>
    );
}
