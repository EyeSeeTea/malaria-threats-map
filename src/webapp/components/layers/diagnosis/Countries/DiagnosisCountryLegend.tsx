import React from "react";
import {
    LegendContainer,
    LegendFooter,
    LegendLabels,
    LegendTitleContainer,
    LegendTitleTypography,
} from "../../../Leyend";
import { DiagnosisCountryColors } from "./DiagnosisCountrySymbols";
import { useTranslation } from "react-i18next";

export default function DiagnosisCountryLegend() {
    const { t } = useTranslation("common");
    const labels = [
        {
            label: "legend.number_of_surveys",
            color: DiagnosisCountryColors.COUNTRIES[0],
        },
    ];
    return (
        <LegendContainer>
            <LegendTitleContainer>
                <LegendTitleTypography color="textPrimary" gutterBottom>
                    {t("themes.diagnosis")}
                </LegendTitleTypography>
            </LegendTitleContainer>
            <LegendLabels labels={labels} />
            <LegendFooter />
        </LegendContainer>
    );
}
