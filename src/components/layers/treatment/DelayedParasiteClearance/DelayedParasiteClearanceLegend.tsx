import React from "react";
import {
  LegendContainer,
  LegendFooter,
  LegendLabels,
  LegendTitleContainer,
  LegendTitleTypography
} from "../../../Leyend";
import { DELAYED_PARASITE_CLEARANCE_STATUS } from "./utils";
import { DelayedParasiteClearanceColors } from "./delayedParasiteClearanceSymbols";
import { useTranslation } from "react-i18next";

export default function DelayedParasiteClearanceLeyend() {
  const { t } = useTranslation("common");
  const labels = [
    {
      label: "treatment.legend.delayed_parasite_clearance.high",
      color:
        DelayedParasiteClearanceColors[
          DELAYED_PARASITE_CLEARANCE_STATUS.HIGH
        ][0]
    },
    {
      label: "treatment.legend.delayed_parasite_clearance.medium_high",
      color:
        DelayedParasiteClearanceColors[
          DELAYED_PARASITE_CLEARANCE_STATUS.MEDIUM_HIGH
        ][0]
    },
    {
      label: "treatment.legend.delayed_parasite_clearance.medium",
      color:
        DelayedParasiteClearanceColors[
          DELAYED_PARASITE_CLEARANCE_STATUS.MEDIUM
        ][0]
    },
    {
      label: "treatment.legend.delayed_parasite_clearance.low",
      color:
        DelayedParasiteClearanceColors[DELAYED_PARASITE_CLEARANCE_STATUS.LOW][0]
    },
    {
      label: "treatment.legend.delayed_parasite_clearance.unknown",
      color:
        DelayedParasiteClearanceColors[
          DELAYED_PARASITE_CLEARANCE_STATUS.UNKNOWN
        ][0]
    }
  ];
  return (
    <LegendContainer>
      <LegendTitleContainer>
        <LegendTitleTypography color="textPrimary" gutterBottom>
          {t("treatment.delayed_parasite_clearance")}
        </LegendTitleTypography>
      </LegendTitleContainer>
      <LegendLabels labels={labels} />
      <LegendFooter />
    </LegendContainer>
  );
}
