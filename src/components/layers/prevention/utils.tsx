import React from "react";
import {
  PreventionFilters,
  PreventionMapType
} from "../../../malaria/prevention/reducer";
import resistanceStatusSymbols from "./ResistanceStatus/symbols";
import intensityStatusSymbols from "./IntensityStatus/symbols";
import { default as ResistanceStatusLegend } from "./ResistanceStatus/legend";
import { default as IntensityStatusLegend } from "./IntensityStatus/legend";

export const resolveMapTypeSymbols = (preventionFilters: PreventionFilters) => {
  switch (preventionFilters.mapType) {
    case PreventionMapType.RESISTANCE_STATUS:
      return resistanceStatusSymbols;
    case PreventionMapType.INTENSITY_STATUS:
      return intensityStatusSymbols;
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
    default:
      return;
  }
};
