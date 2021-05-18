import React from "react";
import {
    LegendContainer,
    LegendFooter,
    LegendLabels,
    LegendTitleContainer,
    LegendTitleTypography,
} from "../../../Leyend";
import { ResistanceMechanismColors } from "./symbols";
import { RESISTANCE_MECHANISM } from "./utils";
import { useTranslation } from "react-i18next";

export default function Legend() {
    const { t } = useTranslation("common");
    const labels = [
        {
            label: "prevention.legend.resistance_mechanism.confirmed",
            color: ResistanceMechanismColors[RESISTANCE_MECHANISM.CONFIRMED][0],
        },
        {
            label: "prevention.legend.resistance_mechanism.not_confirmed",
            color: ResistanceMechanismColors[RESISTANCE_MECHANISM.NOT_CONFIRMED][0],
        },
    ];
    return (
        <LegendContainer>
            <LegendTitleContainer>
                <LegendTitleTypography color="textPrimary" gutterBottom>
                    {t("prevention.resistance_mechanism")}
                </LegendTitleTypography>
            </LegendTitleContainer>
            <LegendLabels labels={labels} />
            <LegendFooter />
        </LegendContainer>
    );
}
