import React from "react";
import {
  LegendContainer,
  LegendFooter,
  LegendLabels,
  LegendTitleContainer,
  LegendTitleTypography
} from "../../../Leyend";
import { TREATMENT_FAILURE_STATUS } from "./utils";
import { TreatmentFailureColors } from "./treatmentLayerSymbols";
import { useTranslation } from "react-i18next";

export default function TreatmentFailureLeyend() {
  const { t } = useTranslation("common");
  const labels = [
    {
      label: "treatment.legend.treatment_failure.high",
      color: TreatmentFailureColors[TREATMENT_FAILURE_STATUS.HIGH][0]
    },
    {
      label: "treatment.legend.treatment_failure.medium_high",
      color: TreatmentFailureColors[TREATMENT_FAILURE_STATUS.MEDIUM_HIGH][0]
    },
    {
      label: "treatment.legend.treatment_failure.medium",
      color: TreatmentFailureColors[TREATMENT_FAILURE_STATUS.MEDIUM][0]
    },
    {
      label: "treatment.legend.treatment_failure.low",
      color: TreatmentFailureColors[TREATMENT_FAILURE_STATUS.LOW][0]
    },
    {
      label: "treatment.legend.treatment_failure.unknown",
      color: TreatmentFailureColors[TREATMENT_FAILURE_STATUS.UNKNOWN][0]
    }
  ];
  return (
    <LegendContainer>
      <LegendTitleContainer>
        <LegendTitleTypography color="textPrimary" gutterBottom>
          {t("treatment.treatment_failure")}
        </LegendTitleTypography>
      </LegendTitleContainer>
      <LegendLabels labels={labels} />
      <LegendFooter />
    </LegendContainer>
  );
}
