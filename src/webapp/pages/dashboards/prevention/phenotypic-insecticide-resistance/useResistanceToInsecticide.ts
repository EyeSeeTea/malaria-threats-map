import i18next from "i18next";
import React from "react";
import { PreventionStudy } from "../../../../../domain/entities/PreventionStudy";
import { ResistanceStatusColors } from "../../../../components/layers/prevention/ResistanceStatus/symbols";
import { PreventionFiltersState } from "../filters/PreventionFiltersState";
import { usePrevention } from "../usePrevention";
import { ResistanceToInsecticideGroup } from "./types";

export function useResistanceToInsecticide() {
    const {
        filteredStudies,
        selectedCountries,
        filters,
        onInsecticideClassChange,
        onYearsChange,
        onOnlyIncludeBioassaysWithMoreMosquitoesChange,
        onOnlyIncludeDataByHealthChange,
    } = usePrevention();

    const [data, setData] = React.useState<ResistanceToInsecticideGroup>({});
    const [categories, setCategories] = React.useState<string[]>([]);

    React.useEffect(() => {
        setData(createChartData(filteredStudies, selectedCountries, filters));
    }, [filteredStudies, selectedCountries, filters]);

    React.useEffect(() => {
        setCategories(filters.insecticideClasses.map(insecticideClass => i18next.t(insecticideClass)));
    }, [filters.insecticideClasses]);

    return {
        categories,
        data,
        filters,
        onInsecticideClassChange,
        onYearsChange,
        onOnlyIncludeBioassaysWithMoreMosquitoesChange,
        onOnlyIncludeDataByHealthChange,
    };
}

export function createChartData(
    studies: PreventionStudy[],
    selectedCountries: string[],
    filters: PreventionFiltersState
): ResistanceToInsecticideGroup {
    const result = selectedCountries.reduce((acc, countryISO) => {
        const studiesByCountry = studies.filter(study => study.ISO2 === countryISO);

        const resistanceConfirmedStudies = studiesByCountry.filter(
            study => study.RESISTANCE_STATUS === "CONFIRMED_RESISTANCE"
        );

        const resistanceConfirmed = {
            type: "bar" as const,
            name: "Confirmed (0 to <90%)",
            color: ResistanceStatusColors.Confirmed[0],
            data: getCountByInsecticideClass(resistanceConfirmedStudies, filters.insecticideClasses),
        };

        const resistancePosibleStudies = studiesByCountry.filter(
            study => study.RESISTANCE_STATUS === "POSSIBLE_RESISTANCE"
        );

        const resistancePosible = {
            type: "bar" as const,
            name: "Possible (90 to <98%)",
            color: ResistanceStatusColors.Possible[0],
            data: getCountByInsecticideClass(resistancePosibleStudies, filters.insecticideClasses),
        };

        const resistanceSusceptibleStudies = studiesByCountry.filter(
            study => study.RESISTANCE_STATUS === "SUSCEPTIBLE"
        );

        const resistanceSusceptible = {
            type: "bar" as const,
            name: "Susceptible (≥98%)",
            color: ResistanceStatusColors.Susceptible[0],
            data: getCountByInsecticideClass(resistanceSusceptibleStudies, filters.insecticideClasses),
        };

        return { ...acc, [countryISO]: [resistanceConfirmed, resistancePosible, resistanceSusceptible] };
    }, {});

    console.log({ result });

    return result;
}

function getCountByInsecticideClass(studies: PreventionStudy[], insecticideClasses: string[]) {
    return insecticideClasses.map(
        insecticideClass => studies.filter(study => study.INSECTICIDE_CLASS === insecticideClass).length
    );
}
