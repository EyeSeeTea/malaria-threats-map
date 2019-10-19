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
import {
  PboDeploymentColors,
  PboDeploymentStatus
} from "./PboDeploymentSymbols";

export default function PboDeploymentLegend() {
  return (
    <LegendContainer>
      <LegendTitleContainer>
        <LegendTitleTypography color="textPrimary" gutterBottom>
          PBO Deployment Status
        </LegendTitleTypography>
      </LegendTitleContainer>
      <LegendEntries>
        <LegendEntry>
          <LegendSymbol
            color={PboDeploymentColors[PboDeploymentStatus.ELIGIBLE][0]}
          />
          <LegendText>{"All criteria met"}</LegendText>
        </LegendEntry>
        <LegendEntry>
          <LegendSymbol
            color={PboDeploymentColors[PboDeploymentStatus.NOT_ELIGIBLE][0]}
          />
          <LegendText>{"At least one criteria is not met"}</LegendText>
        </LegendEntry>
        <LegendEntry>
          <LegendSymbol
            color={PboDeploymentColors[PboDeploymentStatus.NOT_ENOUGH_DATA][0]}
          />
          <LegendText>{"More data needs to be collected to evaluate criteria"}</LegendText>
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
