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
import { PreventionCountryColors } from "./CountrySymbols";

export default function PreventionCountryLegend() {
  return (
    <LegendContainer>
      <LegendTitleContainer>
        <LegendTitleTypography color="textPrimary" gutterBottom>
          Vector Insecticide Resistance
        </LegendTitleTypography>
      </LegendTitleContainer>

      <LegendEntries>
        <LegendEntry>
          <LegendSymbol color={PreventionCountryColors.COUNTRIES[0]} />
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
