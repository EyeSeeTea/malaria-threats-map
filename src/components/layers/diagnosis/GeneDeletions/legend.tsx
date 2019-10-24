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
import { DIAGNOSIS_STATUS } from "./utils";
import { DiagnosisStatusColors } from "./symbols";

export default function Legend() {
  return (
    <LegendContainer>
      <LegendTitleContainer>
        <LegendTitleTypography color="textPrimary" gutterBottom>
          Diagnosis Status
        </LegendTitleTypography>
      </LegendTitleContainer>
      <LegendEntries>
        <LegendEntry>
          <LegendSymbol
            color={DiagnosisStatusColors[DIAGNOSIS_STATUS.CONFIRMED][0]}
          />
          <LegendText>{"Confirmed"}</LegendText>
        </LegendEntry>
        <LegendEntry>
          <LegendSymbol
            color={DiagnosisStatusColors[DIAGNOSIS_STATUS.NOT_IDENTIFIED][0]}
          />
          <LegendText>{"Not Identified"}</LegendText>
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
