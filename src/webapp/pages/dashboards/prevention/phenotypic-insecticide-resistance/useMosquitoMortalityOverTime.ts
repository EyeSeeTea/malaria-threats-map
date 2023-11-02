import i18next from "i18next";
import _ from "lodash";
import * as R from "ramda";
import React from "react";
import { PreventionStudy } from "../../../../../domain/entities/PreventionStudy";
import { filterByResistanceStatus } from "../../../../components/layers/studies-filters";
import { PreventionFiltersState } from "../filters/PreventionFiltersState";
import { usePrevention } from "../usePrevention";
import { MosquitoOverTimeBySpecie, MosquitoOverTimeChart, MosquitoOverTimeData } from "./types";

const baseFilters = [filterByResistanceStatus];

export function useMosquitoMortalityOverTime() {
    const { filteredStudies, insecticideTypeOptions, selectedCountries, filters, speciesOptions, typeOptions } =
        usePrevention(baseFilters);

    const [data, setData] = React.useState<MosquitoOverTimeChart>({ years: [], dataByCountry: {} });
    const [count, setCount] = React.useState<number>(0);

    React.useEffect(() => {
        filters.onInsecticideClassChange(["PYRETHROIDS"]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.onInsecticideClassChange]);

    React.useEffect(() => {
        filters.onSpeciesChange(speciesOptions.map(option => option.value));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.onSpeciesChange, speciesOptions]);

    React.useEffect(() => {
        if (typeOptions.length > 0) {
            filters.onTypeChange(typeOptions[0].value);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.onTypeChange, typeOptions]);

    React.useEffect(() => {
        setCount(filteredStudies.length);
    }, [filteredStudies]);

    React.useEffect(() => {
        setData(createChartData(filteredStudies, selectedCountries));
    }, [filteredStudies, selectedCountries]);

    return {
        filteredStudies,
        insecticideTypeOptions,
        count,
        data,
        filters: { ...filters, onInsecticideTypesChange: undefined } as PreventionFiltersState,
        speciesOptions,
        typeOptions,
    };
}

export function createChartData(studies: PreventionStudy[], selectedCountries: string[]): MosquitoOverTimeChart {
    const sortCountries = _.orderBy(selectedCountries, country => i18next.t(country), "asc");
    const sortedStudies = R.sortBy(study => -parseInt(study.YEAR_START), studies);
    const years = _.uniq(sortedStudies.map(study => parseInt(study.YEAR_START)).sort());

    const dataByCountry = sortCountries.reduce((acc, countryISO) => {
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

            return [yearIndex, +(+study.MORTALITY_ADJUSTED * 100).toFixed(1)];
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
    const mortalityAjustedMin = +Math.min(...mortalityAjustedValues).toFixed(1);
    const mortalityAjustedMax = +Math.max(...mortalityAjustedValues).toFixed(1);
    const mortalityAjustedDiff = +(mortalityAjustedMax - mortalityAjustedMin).toFixed(1);
    const mortalityAjustedMiddle = +(mortalityAjustedMin + Math.floor(mortalityAjustedDiff / 2)).toFixed(1);
    const mortalityAjusted25 = +(mortalityAjustedMin + Math.floor(mortalityAjustedDiff * 0.25)).toFixed(1);
    const mortalityAjusted75 = +(mortalityAjustedMin + Math.floor(mortalityAjustedDiff * 0.75)).toFixed(1);

    return [mortalityAjustedMin, mortalityAjusted25, mortalityAjustedMiddle, mortalityAjusted75, mortalityAjustedMax];
}
