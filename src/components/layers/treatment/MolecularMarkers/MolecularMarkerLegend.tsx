import React from "react";
import {
  LegendContainer,
  LegendFooter,
  LegendLabels,
  LegendTitleContainer,
  LegendTitleTypography
} from "../../../Leyend";
import { MOLECULAR_MARKER_STATUS } from "./utils";
import { MolecularMarkerColors } from "./molecularMarkerSymbols";
import { useTranslation } from "react-i18next";

export default function MolecularMarkerLeyend() {
  const { t } = useTranslation("common");
  const labels = [
    {
      label: "treatment.legend.molecular_markers.high",
      color: MolecularMarkerColors[MOLECULAR_MARKER_STATUS.HIGH][0]
    },
    {
      label: "treatment.legend.molecular_markers.medium_high",
      color: MolecularMarkerColors[MOLECULAR_MARKER_STATUS.MEDIUM_HIGH][0]
    },
    {
      label: "treatment.legend.molecular_markers.medium",
      color: MolecularMarkerColors[MOLECULAR_MARKER_STATUS.MEDIUM][0]
    },
    {
      label: "treatment.legend.molecular_markers.low",
      color: MolecularMarkerColors[MOLECULAR_MARKER_STATUS.LOW][0]
    }
  ];
  return (
    <LegendContainer>
      <LegendTitleContainer>
        <LegendTitleTypography color="textPrimary" gutterBottom>
          {t("treatment.molecular_markers")}
        </LegendTitleTypography>
      </LegendTitleContainer>
      <LegendLabels labels={labels} />
      <LegendFooter />
    </LegendContainer>
  );
}
