import _ from "lodash";
import * as R from "ramda";
import React from "react";
import { PreventionStudy } from "../../../../../domain/entities/PreventionStudy";
import { usePrevention } from "../usePrevention";
import { MosquitoOverTimeBySpecie, MosquitoOverTimeChart, MosquitoOverTimeData } from "./types";

export function useMosquitoMortalityOverTime() {
    const {
        filteredStudies,
        insecticideTypeOptions,
        selectedCountries,
        filters,
        speciesOptions,
        typeOptions,
        onInsecticideClassChange,
        onSpeciesChange,
        onInsecticideTypesChange,
        onTypeChange,
        onYearsChange,
        onOnlyIncludeBioassaysWithMoreMosquitoesChange,
        onOnlyIncludeDataByHealthChange,
    } = usePrevention();

    const [data, setData] = React.useState<MosquitoOverTimeChart>({ years: [], dataByCountry: {} });
    const [count, setCount] = React.useState<number>(0);

    React.useEffect(() => {
        onInsecticideClassChange(["PYRETHROIDS"]);
    }, [onInsecticideClassChange]);

    React.useEffect(() => {
        setCount(filteredStudies.length);
    }, [filteredStudies]);

    React.useEffect(() => {
        setData(createChartData(filteredStudies, selectedCountries));
    }, [filteredStudies, selectedCountries, filters]);

    return {
        filteredStudies,
        insecticideTypeOptions,
        count,
        data,
        filters,
        speciesOptions,
        typeOptions,
        onInsecticideClassChange,
        onSpeciesChange,
        onInsecticideTypesChange,
        onTypeChange,
        onYearsChange,
        onOnlyIncludeBioassaysWithMoreMosquitoesChange,
        onOnlyIncludeDataByHealthChange,
    };
}

export function createChartData(studies: PreventionStudy[], selectedCountries: string[]): MosquitoOverTimeChart {
    const sortedStudies = R.sortBy(study => -parseInt(study.YEAR_START), studies);
    const years = _.uniq(sortedStudies.map(study => parseInt(study.YEAR_START)).sort());

    const dataByCountry = selectedCountries.reduce((acc, countryISO) => {
        const studiesByCountry = studies.filter(study => study.ISO2 === countryISO);

        return { ...acc, [countryISO]: createChartDataBySpecies(studiesByCountry, years) };
    }, {});

    return {
        years,
        dataByCountry,
    };
}

function createChartDataBySpecies(studies: PreventionStudy[], years: number[]): MosquitoOverTimeBySpecie {
    const species = _.uniq(studies.map(study => study.SPECIES)).sort();

    const result = species.reduce((acc, specie) => {
        const studiesBySpecie = studies.filter(study => study.SPECIES === specie);

        const rangesByYear = years.map(year => calculateBloxpotByYear(studiesBySpecie, year));

        const mortalityAjustedByYear = studiesBySpecie.map(study => {
            const yearIndex = years.indexOf(+study.YEAR_START);

            return [yearIndex, +study.MORTALITY_ADJUSTED * 100];
        });

        return {
            ...acc,
            [specie]: {
                boxplotData: rangesByYear,
                outliersData: mortalityAjustedByYear,
            },
        };
    }, {} as Record<string, MosquitoOverTimeData>);

    return result;
}

function calculateBloxpotByYear(studies: PreventionStudy[], year: number): number[] {
    const studiesByYear = studies.filter(study => +study.YEAR_START === year);

    if (studiesByYear.length === 0) return [];

    const mortalityAjustedValues = studiesByYear.map(study => +study.MORTALITY_ADJUSTED * 100);
    const mortalityAjustedMin = Math.min(...mortalityAjustedValues);
    const mortalityAjustedMax = Math.max(...mortalityAjustedValues);
    const mortalityAjustedDiff = mortalityAjustedMax - mortalityAjustedMin;
    const mortalityAjustedMiddle = mortalityAjustedMin + Math.floor(mortalityAjustedDiff / 2);
    const mortalityAjusted25 = mortalityAjustedMin + Math.floor(mortalityAjustedDiff * 0.25);
    const mortalityAjusted75 = mortalityAjustedMin + Math.floor(mortalityAjustedDiff * 0.75);

    return [mortalityAjustedMin, mortalityAjusted25, mortalityAjustedMiddle, mortalityAjusted75, mortalityAjustedMax];
}
