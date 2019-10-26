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
import { INVASIVE_STATUS } from "./utils";
import { InvasiveStatusColors } from "./vector-ocurrance-symbols";

export default function VectorOcurranceLegend() {
  return (
    <LegendContainer>
      <LegendTitleContainer>
        <LegendTitleTypography color="textPrimary" gutterBottom>
          Invasive Status
        </LegendTitleTypography>
      </LegendTitleContainer>
      <LegendEntries>
        <LegendEntry>
          <LegendSymbol
            color={InvasiveStatusColors[INVASIVE_STATUS.INVASIVE][0]}
          />
          <LegendText>{"Invasive"}</LegendText>
        </LegendEntry>
        <LegendEntry>
          <LegendSymbol
            color={InvasiveStatusColors[INVASIVE_STATUS.NATIVE][0]}
          />
          <LegendText>{"Native"}</LegendText>
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
