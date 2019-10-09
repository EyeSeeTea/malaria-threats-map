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
import { LevelOfInvolvementColors } from "./symbols";
import { LEVEL_OF_INVOLVEMENT } from "./utils";

export default function Legend() {
  return (
    <LegendContainer>
      <LegendTitleContainer>
        <LegendTitleTypography color="textPrimary" gutterBottom>
          Level of Involvement
        </LegendTitleTypography>
      </LegendTitleContainer>
      <LegendEntries>
        <LegendEntry>
          <LegendSymbol
            color={
              LevelOfInvolvementColors[LEVEL_OF_INVOLVEMENT.FULL_INVOLVEMENT][0]
            }
          />
          <LegendText>{"Full Involvement"}</LegendText>
        </LegendEntry>
        <LegendEntry>
          <LegendSymbol
            color={
              LevelOfInvolvementColors[
                LEVEL_OF_INVOLVEMENT.PARTIAL_INVOLVEMENT
              ][0]
            }
          />
          <LegendText>{"Partial Involvement"}</LegendText>
        </LegendEntry>
        <LegendEntry>
          <LegendSymbol
            color={
              LevelOfInvolvementColors[LEVEL_OF_INVOLVEMENT.NO_INVOLVEMENT][0]
            }
          />
          <LegendText>{"No Involvement"}</LegendText>
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
