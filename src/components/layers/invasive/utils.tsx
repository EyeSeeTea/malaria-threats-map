import {
  InvasiveFilters,
  PreventionFilters,
  TreatmentFilters
} from "../../../store/types";
import resistanceStatusSymbols from "../prevention/ResistanceStatus/symbols";

export const resolveMapTypeSymbols = (
  invasiveFilters: InvasiveFilters,
  countryMode: boolean
) => {
  return resistanceStatusSymbols;
};
