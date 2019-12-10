import React from "react";
import {
  LegendContainer,
  LegendFooter,
  LegendLabels,
  LegendTitleContainer,
  LegendTitleTypography
} from "../../../Leyend";
import { DIAGNOSIS_STATUS } from "./utils";
import { DiagnosisStatusColors } from "./symbols";
import { useTranslation } from "react-i18next";

export default function Legend() {
  const { t } = useTranslation("common");
  const labels = [
    {
      label: "diagnosis.legend.gene_deletions.confirmed",
      color: DiagnosisStatusColors[DIAGNOSIS_STATUS.CONFIRMED][0]
    },
    {
      label: "diagnosis.legend.gene_deletions.not_identified",
      color: DiagnosisStatusColors[DIAGNOSIS_STATUS.NOT_IDENTIFIED][0]
    }
  ];
  return (
    <LegendContainer>
      <LegendTitleContainer>
        <LegendTitleTypography color="textPrimary" gutterBottom>
          {t("diagnosis.gene_deletions")}
        </LegendTitleTypography>
      </LegendTitleContainer>
      <LegendLabels labels={labels} />
      <LegendFooter />
    </LegendContainer>
  );
}
