import React from "react";
import {
  LegendContainer,
  LegendFooter,
  LegendLabels,
  LegendTitleContainer,
  LegendTitleTypography
} from "../../../Leyend";
import { LevelOfInvolvementColors } from "./symbols";
import { LEVEL_OF_INVOLVEMENT } from "./utils";
import { useTranslation } from "react-i18next";

export default function LevelOfInvolvementLegend() {
  const { t } = useTranslation("common");
  const labels = [
    {
      label: "prevention.legend.synergist_involvement.full_involvement",
      color: LevelOfInvolvementColors[LEVEL_OF_INVOLVEMENT.FULL_INVOLVEMENT][0]
    },
    {
      label: "prevention.legend.synergist_involvement.partial_involvement",
      color:
        LevelOfInvolvementColors[LEVEL_OF_INVOLVEMENT.PARTIAL_INVOLVEMENT][0]
    },
    {
      label: "prevention.legend.synergist_involvement.no_involvement",
      color: LevelOfInvolvementColors[LEVEL_OF_INVOLVEMENT.NO_INVOLVEMENT][0]
    }
  ];
  return (
    <LegendContainer>
      <LegendTitleContainer>
        <LegendTitleTypography color="textPrimary" gutterBottom>
          {t("prevention.synergist_involvement_legend")}
        </LegendTitleTypography>
      </LegendTitleContainer>
      <LegendLabels labels={labels} />
      <LegendFooter />
    </LegendContainer>
  );
}
