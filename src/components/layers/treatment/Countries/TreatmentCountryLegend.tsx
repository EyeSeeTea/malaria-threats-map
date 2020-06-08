import React, { useState } from "react";
import {
  LegendContainer,
  LegendFooter,
  LegendLabels,
  LegendTitleContainer,
  LegendTitleTypography
} from "../../../Leyend";
import { TreatmentCountryColors } from "./treatment-country-symbols";
import { useTranslation } from "react-i18next";

export default function TreatmentCountryLegend() {
  const { t } = useTranslation("common");
  const labels = [
    {
      label: "legend.number_of_studies",
      color: TreatmentCountryColors.COUNTRIES[0]
    }
  ];
  return (
    <LegendContainer>
      <LegendTitleContainer>
        <LegendTitleTypography color="textPrimary" gutterBottom>
          {t("themes.treatment")}
        </LegendTitleTypography>
      </LegendTitleContainer>
      <LegendLabels labels={labels} />
      <LegendFooter />
    </LegendContainer>
  );
}
