import _ from "lodash";
import { PreventionStudy } from "../../../../../../../domain/entities/PreventionStudy";
import {
    SpreadOfResistanceOverTimeByCountry,
    SpreadOfResistanceOverTimeByCountryAndSpecies,
    SpreadOfResistanceOverTimeBySpecie,
    SpreadOfResistanceOverTimeChartData,
    SpreadOfResistanceOverTimeChartType,
    SpreadOfResistanceOverTimeData,
} from "../../types";
import { DisaggregateBySpeciesOptions } from "../../../../../../components/filters/DisaggregateBySpecies";

export const INSECTICIDE_CLASS_COLORS: Record<string, string> = {
    NEONICOTINOIDS: "#e53d77",
    ORGANOCHLORINES: "#f68a24",
    ORGANOPHOSPHATES: "#e81225",
    PYRROLES: "#439336",
    PYRETHROIDS: "#5FB4AE",
    CARBAMATES: "#4876a8",
};

function getMaxSumConfirmedResistanceOfData(data: SpreadOfResistanceOverTimeData[]): number {
    const totalSumsConfirmedResistanceOfData = data.flatMap(dataOfYear =>
        dataOfYear.data.length ? dataOfYear.data[dataOfYear.data.length - 1] : 0
    );
    return Math.max(...totalSumsConfirmedResistanceOfData);
}

function getMaxSumConfirmedResistance(
    dataByCountry: SpreadOfResistanceOverTimeByCountry | SpreadOfResistanceOverTimeByCountryAndSpecies,
    isDisaggregatedBySpecies: boolean
): number {
    const maxDataByCountry = Object.keys(dataByCountry).reduce((acc, isoCountry) => {
        if (isDisaggregatedBySpecies) {
            const dataOfCountry = dataByCountry[isoCountry] as SpreadOfResistanceOverTimeBySpecie;
            const allSumConfirmedResistanceOfData = Object.keys(dataOfCountry).map(specie => {
                const dataBySpecie = dataOfCountry[specie];
                return getMaxSumConfirmedResistanceOfData(dataBySpecie);
            });
            return [...acc, Math.max(...allSumConfirmedResistanceOfData)];
        }
        const dataOfCountry = dataByCountry[isoCountry] as SpreadOfResistanceOverTimeData[];
        const maxOfData = getMaxSumConfirmedResistanceOfData(dataOfCountry);
        return [...acc, maxOfData];
    }, [] as number[]);
    return Math.max(...maxDataByCountry);
}

function getDataByYear(studies: PreventionStudy[], sortedYears: number[]): number[] {
    return sortedYears.reduce((acc, year, i) => {
        const studiesByYear = studies.filter(study => Number(study.YEAR_START) === year);
        const priorYearSumOfConfirmedResistanceStudies = i === 0 ? 0 : acc[i - 1];
        const sumOfConfirmedResistanceStudies = priorYearSumOfConfirmedResistanceStudies + studiesByYear?.length || 0;
        return [...acc, sumOfConfirmedResistanceStudies];
    }, [] as number[]);
}

function getColorByInsecticideClass(insecticideClass: string): string {
    return INSECTICIDE_CLASS_COLORS[insecticideClass];
}

function createChartData(
    studies: PreventionStudy[],
    sortedYears: number[],
    insecticideClasses: string[]
): SpreadOfResistanceOverTimeData[] {
    return insecticideClasses.reduce((acc, insecticideClass) => {
        const studiesByInsecticideClass = studies.filter(study => study.INSECTICIDE_CLASS === insecticideClass);

        return [
            ...acc,
            {
                name: insecticideClass,
                data: getDataByYear(studiesByInsecticideClass, sortedYears),
                color: getColorByInsecticideClass(insecticideClass),
            },
        ];
    }, [] as SpreadOfResistanceOverTimeData[]);
}

function createChartDataBySpecies(
    studies: PreventionStudy[],
    sortedYears: number[],
    insecticideClasses: string[]
): SpreadOfResistanceOverTimeBySpecie {
    const sortedSpecies = _.uniq(studies.map(study => study.SPECIES)).sort();

    return sortedSpecies.reduce((acc, specie) => {
        const studiesBySpecie = studies.filter(study => study.SPECIES === specie);

        return {
            ...acc,
            [specie]: createChartData(studiesBySpecie, sortedYears, insecticideClasses),
        };
    }, {} as SpreadOfResistanceOverTimeBySpecie);
}

function createChartDataByInsecticideClass(
    studies: PreventionStudy[],
    sortedYears: number[],
    insecticideClasses: string[],
    isDisaggregatedBySpecies: boolean
): SpreadOfResistanceOverTimeData[] | SpreadOfResistanceOverTimeBySpecie {
    return isDisaggregatedBySpecies
        ? createChartDataBySpecies(studies, sortedYears, insecticideClasses)
        : createChartData(studies, sortedYears, insecticideClasses);
}

export function createChartDataByType(
    filteredsStudies: PreventionStudy[],
    selectedCountries: string[],
    insecticideClasses: string[],
    disaggregateBySpeciesSelectionFilter: DisaggregateBySpeciesOptions,
    type: SpreadOfResistanceOverTimeChartType
): SpreadOfResistanceOverTimeChartData {
    const isDisaggregatedBySpecies = disaggregateBySpeciesSelectionFilter === "disaggregate_species";
    const resistanceConfirmedStudies = filteredsStudies.filter(
        study => study.RESISTANCE_STATUS === "CONFIRMED_RESISTANCE"
    );

    const sortedStudies = _.sortBy(resistanceConfirmedStudies, study => -parseInt(study.YEAR_START));
    const sortedYears = _.uniq(sortedStudies.map(study => parseInt(study.YEAR_START)).sort());

    const dataByCountry = selectedCountries.reduce((acc, countryISO) => {
        const filteredStudiesOfCountry = resistanceConfirmedStudies.filter(study => study.ISO2 === countryISO);

        return {
            ...acc,
            [countryISO]: createChartDataByInsecticideClass(
                filteredStudiesOfCountry,
                sortedYears,
                insecticideClasses,
                isDisaggregatedBySpecies
            ),
        };
    }, {});

    return {
        kind: "InsecticideByClass",
        data: {
            years: sortedYears,
            dataByCountry,
            maxSumOfConfirmedResistance: getMaxSumConfirmedResistance(dataByCountry, isDisaggregatedBySpecies),
        },
    };
}
