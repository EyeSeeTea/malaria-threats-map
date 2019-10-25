import React from "react";
import {
  LegendContainer,
  LegendEntries,
  LegendEntry,
  LegendFooterContainer,
  LegendFooterTypography,
  LegendSymbol,
  LegendText,
  LegendTitleContainer,
  LegendTitleTypography
} from "../../../Leyend";
import { TreatmentCountryColors } from "./treatment-country-symbols";

export default function TreatmentCountryLegend() {
  return (
    <LegendContainer>
      <LegendTitleContainer>
        <LegendTitleTypography color="textPrimary" gutterBottom>
          Treatment
        </LegendTitleTypography>
      </LegendTitleContainer>

      <LegendEntries>
        <LegendEntry>
          <LegendSymbol color={TreatmentCountryColors.COUNTRIES[0]} />
          <LegendText>{"Number of studies"}</LegendText>
        </LegendEntry>
      </LegendEntries>
      <LegendFooterContainer>
        <LegendFooterTypography color="textSecondary">
          Most recent data shown
        </LegendFooterTypography>
      </LegendFooterContainer>
    </LegendContainer>
  );
}
