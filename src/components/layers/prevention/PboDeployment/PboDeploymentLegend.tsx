import React from "react";
import {
  LegendContainer,
  LegendFooter,
  LegendLabels,
  LegendTitleContainer,
  LegendTitleTypography
} from "../../../Leyend";
import {
  PboDeploymentColors,
  PboDeploymentStatus
} from "./PboDeploymentSymbols";
import { useTranslation } from "react-i18next";

export default function PboDeploymentLegend() {
  const { t } = useTranslation("common");
  const labels = [
    {
      label: "prevention.legend.pbo_deployment.eligible",
      color: PboDeploymentColors[PboDeploymentStatus.ELIGIBLE][0]
    },
    {
      label: "prevention.legend.pbo_deployment.not_eligible",
      color: PboDeploymentColors[PboDeploymentStatus.NOT_ELIGIBLE][0]
    },
    {
      label: "prevention.legend.pbo_deployment.not_enough_data",
      color: PboDeploymentColors[PboDeploymentStatus.NOT_ENOUGH_DATA][0]
    }
  ];
  return (
    <LegendContainer>
      <LegendTitleContainer>
        <LegendTitleTypography color="textPrimary" gutterBottom>
          {t("prevention.pbo_deployment")}
        </LegendTitleTypography>
      </LegendTitleContainer>
      <LegendLabels labels={labels} />
      <LegendFooter />
    </LegendContainer>
  );
}
