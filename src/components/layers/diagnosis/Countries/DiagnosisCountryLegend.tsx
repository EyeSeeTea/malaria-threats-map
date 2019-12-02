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
import { DiagnosisCountryColors } from "./DiagnosisCountrySymbols";

export default function DiagnosisCountryLegend() {
  return (
    <LegendContainer>
      <LegendTitleContainer>
        <LegendTitleTypography color="textPrimary" gutterBottom>
          Vector Insecticide Resistance
        </LegendTitleTypography>
      </LegendTitleContainer>

      <LegendEntries>
        <LegendEntry>
          <LegendSymbol color={DiagnosisCountryColors.COUNTRIES[0]} />
          <LegendText>{"Number of surveys"}</LegendText>
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
