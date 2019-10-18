import React from "react";
import pfhrp2Symbols from "./PFHRP2/symbols";
import Pfhrp2Legend from "./PFHRP2/legend";
import { DiagnosisFilters, DiagnosisMapType } from "../../../store/types";

export const resolveMapTypeSymbols = (diagnosisFilters: DiagnosisFilters) => {
  switch (diagnosisFilters.mapType) {
    case DiagnosisMapType.PFHRP2:
      return pfhrp2Symbols;
    default:
      return pfhrp2Symbols;
  }
};

export const resolveMapTypeLegend = (diagnosisFilters: DiagnosisFilters) => {
  switch (diagnosisFilters.mapType) {
    case DiagnosisMapType.PFHRP2:
      return <Pfhrp2Legend />;
    default:
      return <Pfhrp2Legend />;
  }
};
