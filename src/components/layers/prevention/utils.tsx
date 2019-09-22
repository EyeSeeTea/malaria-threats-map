import {
  PreventionFilters,
  PreventionMapType
} from "../../../malaria/prevention/reducer";
import resistanceStatusSymbols from "./ResistanceStatus/symbols";
import intensityStatusSymbols from "./IntensityStatus/symbols";

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
