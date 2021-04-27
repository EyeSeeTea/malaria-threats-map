import React from "react";
import {
    LegendContainer,
    LegendFooter,
    LegendLabels,
    LegendTitleContainer,
    LegendTitleTypography,
} from "../../../Leyend";
import { PreventionCountryColors } from "./PreventionCountrySymbols";
import { useTranslation } from "react-i18next";

export default function PreventionCountryLegend() {
    const { t } = useTranslation("common");
    const labels = [
        {
            label: "legend.number_of_studies",
            color: PreventionCountryColors.COUNTRIES[0],
        },
    ];
    return (
        <LegendContainer>
            <LegendTitleContainer>
                <LegendTitleTypography color="textPrimary" gutterBottom>
                    {t("themes.prevention")}
                </LegendTitleTypography>
            </LegendTitleContainer>
            <LegendLabels labels={labels} />
            <LegendFooter />
        </LegendContainer>
    );
}
