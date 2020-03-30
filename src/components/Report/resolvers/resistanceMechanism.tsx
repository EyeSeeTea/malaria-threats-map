import { PreventionStudy } from "../../../types/Prevention";
import {
  filterByResistanceMechanism,
  filterByType
} from "../../layers/studies-filters";

export function resolveMechanism(
  type: string,
  countrySpeciesStudies: PreventionStudy[]
) {
  const studies = [filterByResistanceMechanism, filterByType(type)].reduce(
    (studies, filter) => studies.filter(filter),
    countrySpeciesStudies
  );
  const detected = studies.filter(
    study => parseFloat(study.MORTALITY_ADJUSTED) < 0.9
  );
  const percentage = (detected.length * 100) / studies.length;
  return {
    percentage,
    n: detected.length
  };
}
