import React from "react";
import {
    LegendContainer,
    LegendFooter,
    LegendLabels,
    LegendTitleContainer,
    LegendTitleTypography,
} from "../../../Leyend";
import { INVASIVE_STATUS } from "./utils";
import { InvasiveStatusColors } from "./vector-ocurrance-symbols";
import { useTranslation } from "react-i18next";

export default function VectorOcurranceLegend() {
    const { t } = useTranslation();
    const labels = [
        {
            label: "invasive.legend.vector_occurrance.invasive",
            color: InvasiveStatusColors[INVASIVE_STATUS.INVASIVE][0],
        },
        {
            label: "invasive.legend.vector_occurrance.native",
            color: InvasiveStatusColors[INVASIVE_STATUS.NATIVE][0],
        },
    ];
    return (
        <LegendContainer expandIcon={false}>
            <LegendTitleContainer>
                <LegendTitleTypography color="textPrimary" gutterBottom>
                    {t("common.invasive.vector_occurrance")}
                </LegendTitleTypography>
            </LegendTitleContainer>
            <LegendLabels labels={labels} />
            <LegendFooter />
        </LegendContainer>
    );
}
