import _ from "lodash";
import { PreventionStudy } from "../../../../domain/entities/PreventionStudy";
import {
    filterByInsecticideClasses,
    filterByInsecticideTypes,
    filterByOnlyDataByHealthMinistries,
    filterByOnlyIncludeBioassaysWithMoreMosquitoes,
    filterBySpecies,
    filterByType,
    filterByYearRange,
} from "../../../components/layers/studies-filters";
import { PreventionFiltersState } from "./filters/PreventionFiltersState";

export function filterStudies(
    studies: PreventionStudy[],
    baseFilters: ((study: PreventionStudy) => boolean)[],
    preventionFilters: Pick<
        PreventionFiltersState,
        | "insecticideClasses"
        | "insecticideTypes"
        | "species"
        | "type"
        | "years"
        | "onlyIncludeBioassaysWithMoreMosquitoes"
        | "onlyIncludeDataByHealth"
        | "maxMinYears"
    >
): PreventionStudy[] {
    const filters = _.compact([
        ...baseFilters,
        filterByInsecticideClasses(preventionFilters.insecticideClasses),
        filterByInsecticideTypes(preventionFilters.insecticideTypes),
        filterBySpecies(preventionFilters.species),
        filterByType(preventionFilters.type),
        filterByOnlyIncludeBioassaysWithMoreMosquitoes(preventionFilters.onlyIncludeBioassaysWithMoreMosquitoes),
        filterByOnlyDataByHealthMinistries(preventionFilters.onlyIncludeDataByHealth),
        preventionFilters.years && filterByYearRange(preventionFilters.years),
    ]);

    const filteredStudies = filters.reduce((studies, filter) => studies.filter(filter), studies);

    return filteredStudies;
}
