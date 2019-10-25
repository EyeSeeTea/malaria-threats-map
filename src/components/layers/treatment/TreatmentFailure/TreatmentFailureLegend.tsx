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
import { TREATMENT_FAILURE_STATUS } from "./utils";
import { TreatmentFailureColors } from "./treatmentLayerSymbols";

export default function TreatmentFailureLeyend() {
  return (
    <LegendContainer>
      <LegendTitleContainer>
        <LegendTitleTypography color="textPrimary" gutterBottom>
          Treatment Failure
        </LegendTitleTypography>
      </LegendTitleContainer>
      <LegendEntries>
        <LegendEntry>
          <LegendSymbol
            color={TreatmentFailureColors[TREATMENT_FAILURE_STATUS.HIGH][0]}
          />
          <LegendText>{"> 20%"}</LegendText>
        </LegendEntry>
        <LegendEntry>
          <LegendSymbol
            color={
              TreatmentFailureColors[TREATMENT_FAILURE_STATUS.MEDIUM_HIGH][0]
            }
          />
          <LegendText>{"10% - 20%"}</LegendText>
        </LegendEntry>
        <LegendEntry>
          <LegendSymbol
            color={TreatmentFailureColors[TREATMENT_FAILURE_STATUS.MEDIUM][0]}
          />
          <LegendText>{"5% - 10%"}</LegendText>
        </LegendEntry>
        <LegendEntry>
          <LegendSymbol
            color={TreatmentFailureColors[TREATMENT_FAILURE_STATUS.LOW][0]}
          />
          <LegendText>{"< 5%"}</LegendText>
        </LegendEntry>
        <LegendEntry>
          <LegendSymbol
            color={TreatmentFailureColors[TREATMENT_FAILURE_STATUS.UNKNOWN][0]}
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
