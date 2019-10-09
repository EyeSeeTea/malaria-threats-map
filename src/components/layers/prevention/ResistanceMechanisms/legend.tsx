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
import { ResistanceMechanismColors } from "./symbols";
import { RESISTANCE_MECHANISM } from "./utils";

export default function Legend() {
  return (
    <LegendContainer>
      <LegendTitleContainer>
        <LegendTitleTypography color="textPrimary" gutterBottom>
          Resistance Mechanism
        </LegendTitleTypography>
      </LegendTitleContainer>
      <LegendEntries>
        <LegendEntry>
          <LegendSymbol
            color={ResistanceMechanismColors[RESISTANCE_MECHANISM.CONFIRMED][0]}
          />
          <LegendText>{"Confirmed"}</LegendText>
        </LegendEntry>
        <LegendEntry>
          <LegendSymbol
            color={
              ResistanceMechanismColors[RESISTANCE_MECHANISM.NOT_CONFIRMED][0]
            }
          />
          <LegendText>{"Not confirmed"}</LegendText>
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
