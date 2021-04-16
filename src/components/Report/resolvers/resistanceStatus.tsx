import { PreventionStudy } from "../../../types/Prevention";
import { filterByInsecticideClass } from "../../layers/studies-filters";
import * as R from "ramda";

export function resolvePyrethroids(insecticideClass: string, countrySpeciesStudies: PreventionStudy[], t: any) {
    const studies = countrySpeciesStudies.filter(filterByInsecticideClass(insecticideClass));
    const detectedPyrethroidsStudies = studies.filter(study => parseFloat(study.MORTALITY_ADJUSTED) < 0.9);
    const percentage: number | "-" = studies.length
        ? Number(((detectedPyrethroidsStudies.length * 100) / studies.length).toFixed(2))
        : "-";
    const sorted = R.sortBy(study => -parseInt(study.YEAR_START), studies);
    return {
        percentage,
        sorted,
        n: detectedPyrethroidsStudies.length,
    };
}
