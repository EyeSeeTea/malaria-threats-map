import _ from "lodash";
import { PreventionStudy } from "../../../../domain/entities/PreventionStudy";
import {
    filterByInsecticideClasses,
    filterByInsecticideTypes,
    filterByOnlyDataByHealthMinistries,
    filterByResistanceStatus,
    filterBySpecies,
    filterByType,
    filterByYearRange,
} from "../../../components/layers/studies-filters";
import { PreventionFiltersState } from "./filters/PreventionFiltersState";

export function filterStudies(
    studies: PreventionStudy[],
    preventionFilters: PreventionFiltersState
): PreventionStudy[] {
    const filters = _.compact([
        filterByResistanceStatus,
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

export const filterByOnlyIncludeBioassaysWithMoreMosquitoes =
    (numberMosquitoes: number) => (study: PreventionStudy) => {
        return +study.NUMBER >= numberMosquitoes;
    };
