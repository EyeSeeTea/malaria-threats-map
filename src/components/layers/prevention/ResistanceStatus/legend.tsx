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
  LegendTitleTypography,
  LegendTypography
} from "../../../Leyend";

export default function Legend() {
  return (
    <LegendContainer>
      <LegendTitleContainer>
        <LegendTitleTypography color="textPrimary" gutterBottom>
          Resistance Status
        </LegendTitleTypography>
        <LegendTypography color="textSecondary">
          (% mosquito mortality)
        </LegendTypography>
      </LegendTitleContainer>
      <LegendEntries>
        <LegendEntry>
          <LegendSymbol color="#d43501" />
          <LegendText>{"Confirmed (<90%)"}</LegendText>
        </LegendEntry>
        <LegendEntry>
          <LegendSymbol color="#ff9502" />
          <LegendText>{"Possible (90-97%)"}</LegendText>
        </LegendEntry>
        <LegendEntry>
          <LegendSymbol color="#869c66" />
          <LegendText>{"Susceptible (≥98%)"}</LegendText>
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
