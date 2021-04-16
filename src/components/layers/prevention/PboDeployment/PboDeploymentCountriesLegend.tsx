import React from "react";
import { LegendContainer, LegendLabels, LegendTitleContainer, LegendTitleTypography } from "../../../Leyend";
import { PboDeploymentColors, PboDeploymentStatus } from "./PboDeploymentSymbols";
import { useTranslation } from "react-i18next";

export default function PboDeploymentCountriesLegend() {
    const { t } = useTranslation("common");
    const labels = [
        {
            label: "at least one site meets all three WHO-recommended criteria",
            // label: "prevention.legend.pbo_deployment.eligible",
            color: PboDeploymentColors[PboDeploymentStatus.ELIGIBLE][0],
        },
        {
            label: "Reported monitoring data is insufficient to judge edibility",
            // label: "prevention.legend.pbo_deployment.not_eligible",
            color: PboDeploymentColors[PboDeploymentStatus.NOT_ENOUGH_DATA][0],
        },
        {
            label: "No reports on monitoring WHO-recommended criteria are available",
            // label: "prevention.legend.pbo_deployment.not_enough_data",
            color: PboDeploymentColors[PboDeploymentStatus.NOT_ELIGIBLE][0],
        },
        {
            label: "Not malaria endemic",
            // label: "prevention.legend.pbo_deployment.no_data",
            color: "#FFFFFF",
            border: true,
        },
        {
            label: "Not applicable",
            // label: "prevention.legend.pbo_deployment.no_data",
            color: "#AAAAAA",
        },
    ];
    return (
        <LegendContainer>
            <LegendTitleContainer>
                <LegendTitleTypography color="textPrimary" gutterBottom>
                    {t("prevention.pbo_deployment_legend")}
                </LegendTitleTypography>
            </LegendTitleContainer>
            <LegendLabels labels={labels} />
        </LegendContainer>
    );
}
