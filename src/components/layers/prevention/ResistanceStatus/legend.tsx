import React from "react";
import {
  LegendContainer,
  LegendFooter,
  LegendLabels,
  LegendTitleContainer,
  LegendTitleTypography
} from "../../../Leyend";
import { useTranslation } from "react-i18next";

export default function Legend() {
  const { t } = useTranslation("common");
  const labels = [
    {
      label: "prevention.legend.resistance_status.confirmed",
      color: "#d43501"
    },
    {
      label: "prevention.legend.resistance_status.possible",
      color: "#ff9502"
    },
    {
      label: "prevention.legend.resistance_status.susceptible",
      color: "#869c66"
    }
  ];
  return (
    <LegendContainer>
      <LegendTitleContainer>
        <LegendTitleTypography color="textPrimary" gutterBottom>
          {t("prevention.resistance_status")}
        </LegendTitleTypography>
      </LegendTitleContainer>
      <LegendLabels labels={labels} />
      <LegendFooter />
    </LegendContainer>
  );
}
