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
import {DELAYED_PARASITE_CLEARANCE_STATUS} from "./utils";
import {DelayedParasiteClearanceColors} from "./delayedParasiteClearanceSymbols";

export default function DelayedParasiteClearanceLeyend() {
  return (
    <LegendContainer>
      <LegendTitleContainer>
        <LegendTitleTypography color="textPrimary" gutterBottom>
          % of patients positive on day 3
        </LegendTitleTypography>
      </LegendTitleContainer>
      <LegendEntries>
        <LegendEntry>
          <LegendSymbol
            color={
              DelayedParasiteClearanceColors[
                DELAYED_PARASITE_CLEARANCE_STATUS.HIGH
              ][0]
            }
          />
          <LegendText>{"> 20%"}</LegendText>
        </LegendEntry>
        <LegendEntry>
          <LegendSymbol
            color={
              DelayedParasiteClearanceColors[
                DELAYED_PARASITE_CLEARANCE_STATUS.MEDIUM_HIGH
              ][0]
            }
          />
          <LegendText>{"10% - 20%"}</LegendText>
        </LegendEntry>
        <LegendEntry>
          <LegendSymbol
            color={
              DelayedParasiteClearanceColors[
                DELAYED_PARASITE_CLEARANCE_STATUS.MEDIUM
              ][0]
            }
          />
          <LegendText>{"5% - 10%"}</LegendText>
        </LegendEntry>
        <LegendEntry>
          <LegendSymbol
            color={
              DelayedParasiteClearanceColors[
                DELAYED_PARASITE_CLEARANCE_STATUS.LOW
              ][0]
            }
          />
          <LegendText>{"< 5%"}</LegendText>
        </LegendEntry>
        <LegendEntry>
          <LegendSymbol
            color={
              DelayedParasiteClearanceColors[
                DELAYED_PARASITE_CLEARANCE_STATUS.UNKNOWN
              ][0]
            }
          />
          <LegendText>{"Data not available"}</LegendText>
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
