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
import { MOLECULAR_MARKER_STATUS } from "./utils";
import { MolecularMarkerColors } from "./molecularMarkerSymbols";

export default function MolecularMarkerLeyend() {
  return (
    <LegendContainer>
      <LegendTitleContainer>
        <LegendTitleTypography color="textPrimary" gutterBottom>
          WT gene mutation frequency
        </LegendTitleTypography>
      </LegendTitleContainer>
      <LegendEntries>
        <LegendEntry>
          <LegendSymbol
            color={MolecularMarkerColors[MOLECULAR_MARKER_STATUS.HIGH][0]}
          />
          <LegendText>{"> 80%"}</LegendText>
        </LegendEntry>
        <LegendEntry>
          <LegendSymbol
            color={
              MolecularMarkerColors[MOLECULAR_MARKER_STATUS.MEDIUM_HIGH][0]
            }
          />
          <LegendText>{"51% - 80%"}</LegendText>
        </LegendEntry>
        <LegendEntry>
          <LegendSymbol
            color={MolecularMarkerColors[MOLECULAR_MARKER_STATUS.MEDIUM][0]}
          />
          <LegendText>{"10% - 50%"}</LegendText>
        </LegendEntry>
        <LegendEntry>
          <LegendSymbol
            color={MolecularMarkerColors[MOLECULAR_MARKER_STATUS.LOW][0]}
          />
          <LegendText>{"< 10%"}</LegendText>
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
