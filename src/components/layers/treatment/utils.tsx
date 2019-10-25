import { PreventionFilters, TreatmentFilters } from "../../../store/types";
import resistanceStatusSymbols from "../prevention/ResistanceStatus/symbols";

export const resolveMapTypeSymbols = (
  treatmentFilters: TreatmentFilters,
  countryMode: boolean
) => {
  return resistanceStatusSymbols;
};
