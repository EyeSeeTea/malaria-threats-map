import React from "react";
import resistanceStatusSymbols from "./ResistanceStatus/symbols";
import intensityStatusSymbols from "./IntensityStatus/symbols";
import resistanceMechanismSymbols from "./ResistanceMechanisms/symbols";
import levelOfInvolvementSymbols from "./Involvement/symbols";
import { default as ResistanceStatusLegend } from "./ResistanceStatus/legend";
import { default as IntensityStatusLegend } from "./IntensityStatus/legend";
import { default as ResistanceMechanismsLegend } from "./ResistanceMechanisms/legend";
import { default as LevelOfInvolvementLegend } from "./Involvement/legend";
import { PreventionFilters, PreventionMapType } from "../../../store/types";

export const resolveMapTypeSymbols = (preventionFilters: PreventionFilters) => {
  switch (preventionFilters.mapType) {
    case PreventionMapType.RESISTANCE_STATUS:
      return resistanceStatusSymbols;
    case PreventionMapType.INTENSITY_STATUS:
      return intensityStatusSymbols;
    case PreventionMapType.RESISTANCE_MECHANISM:
      return resistanceMechanismSymbols;
    case PreventionMapType.LEVEL_OF_INVOLVEMENT:
      return levelOfInvolvementSymbols;
    default:
      return;
  }
};

export const resolveMapTypeLegend = (preventionFilters: PreventionFilters) => {
  switch (preventionFilters.mapType) {
    case PreventionMapType.RESISTANCE_STATUS:
      return <ResistanceStatusLegend />;
    case PreventionMapType.INTENSITY_STATUS:
      return <IntensityStatusLegend />;
    case PreventionMapType.RESISTANCE_MECHANISM:
      return <ResistanceMechanismsLegend />;
    case PreventionMapType.LEVEL_OF_INVOLVEMENT:
      return <LevelOfInvolvementLegend />;
    default:
      return <span />;
  }
};
