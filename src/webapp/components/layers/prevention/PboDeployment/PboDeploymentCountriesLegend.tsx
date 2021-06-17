import React from "react";
import { LegendContainer, LegendLabels, LegendTitleContainer, LegendTitleTypography } from "../../../Leyend";
import { PboDeploymentColors, PboDeploymentStatus } from "./PboDeploymentSymbols";
import { useTranslation } from "react-i18next";

export default function PboDeploymentCountriesLegend() {
    const { t } = useTranslation();
    const labels = [
        {
            label: "prevention.legend.pbo_deployment.countries_legend.at_least_one_site",
            color: PboDeploymentColors[PboDeploymentStatus.ELIGIBLE][0],
        },
        {
            label: "prevention.legend.pbo_deployment.countries_legend.insufficient_to_judge",
            color: PboDeploymentColors[PboDeploymentStatus.NOT_ENOUGH_DATA][0],
        },
        {
            label: "prevention.legend.pbo_deployment.countries_legend.no_reports_available",
            color: PboDeploymentColors[PboDeploymentStatus.NOT_ELIGIBLE][0],
        },
        {
            label: "prevention.legend.pbo_deployment.countries_legend.not_malaria_endemic",
            color: "#FFFFFF",
            border: true,
        },
        {
            label: "prevention.legend.pbo_deployment.countries_legend.not_applicable",
            color: "#AAAAAA",
        },
    ];
    return (
        <LegendContainer>
            <LegendTitleContainer>
                <LegendTitleTypography color="textPrimary" gutterBottom>
                    {t("common.prevention.pbo_deployment_legend")}
                </LegendTitleTypography>
            </LegendTitleContainer>
            <LegendLabels labels={labels} />
        </LegendContainer>
    );
}
