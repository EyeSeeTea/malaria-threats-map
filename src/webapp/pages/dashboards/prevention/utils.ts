import { PreventionStudy } from "../../../../domain/entities/PreventionStudy";
import {
    filterByInsecticideClasses,
    filterByInsecticideTypes,
    filterByResistanceStatus,
    filterByYearRange,
} from "../../../components/layers/studies-filters";
import { PreventionFiltersState } from "./filters/PreventionFiltersState";

export function filterStudies(
    studies: PreventionStudy[],
    preventionFilters: PreventionFiltersState
): PreventionStudy[] {
    const filters = [
        filterByResistanceStatus,
        filterByInsecticideClasses(preventionFilters.insecticideClasses),
        filterByInsecticideTypes(preventionFilters.insecticideTypes),
        filterByOnlyIncludeBioassaysWithMoreMosquitoes(preventionFilters.onlyIncludeBioassaysWithMoreMosquitoes),
        filterByOnlyIncludeDataByHealth(preventionFilters.onlyIncludeDataByHealth),
        filterByYearRange(preventionFilters.years),
    ];

    const filteredStudies = filters.reduce((studies, filter) => studies.filter(filter), studies);

    return filteredStudies;
}

export const filterByOnlyIncludeBioassaysWithMoreMosquitoes =
    (numberMosquitoes: number) => (study: PreventionStudy) => {
        return +study.NUMBER >= numberMosquitoes;
    };

export const filterByOnlyIncludeDataByHealth = (value: boolean) => (study: PreventionStudy) => {
    return !value || study.INSTITUTION_TYPE === "MoH";
};
