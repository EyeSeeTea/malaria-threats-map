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
import { INTENSITY_STATUS } from "./utils";
import { IntensityStatusColors } from "./symbols";

export default function Legend() {
  return (
    <LegendContainer>
      <LegendTitleContainer>
        <LegendTitleTypography color="textPrimary" gutterBottom>
          Intensity Status
        </LegendTitleTypography>
      </LegendTitleContainer>
      <LegendEntries>
        <LegendEntry>
          <LegendSymbol
            color={IntensityStatusColors[INTENSITY_STATUS.HIGH_INTENSITY][0]}
          />
          <LegendText>{"High"}</LegendText>
        </LegendEntry>
        <LegendEntry>
          <LegendSymbol
            color={
              IntensityStatusColors[
                INTENSITY_STATUS.MODERATE_TO_HIGH_INTENSITY
              ][0]
            }
          />
          <LegendText>{"Moderate to high"}</LegendText>
        </LegendEntry>
        <LegendEntry>
          <LegendSymbol
            color={
              IntensityStatusColors[INTENSITY_STATUS.MODERATE_INTENSITY][0]
            }
          />
          <LegendText>{"Moderate"}</LegendText>
        </LegendEntry>
        <LegendEntry>
          <LegendSymbol
            color={IntensityStatusColors[INTENSITY_STATUS.LOW_INTENSITY][0]}
          />
          <LegendText>{"Low"}</LegendText>
        </LegendEntry>
        <LegendEntry>
          <LegendSymbol
            color={IntensityStatusColors[INTENSITY_STATUS.SUSCEPTIBLE][0]}
          />
          <LegendText>{"Susceptible"}</LegendText>
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
