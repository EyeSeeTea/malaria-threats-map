import _, { groupBy } from "lodash";
import { PreventionStudy } from "../../../../../../../domain/entities/PreventionStudy";
import {
    SpreadOfResistanceOverTimeByCountry,
    SpreadOfResistanceOverTimeByCountryAndSpecies,
    SpreadOfResistanceOverTimeBySpecie,
    SpreadOfResistanceOverTimeChartData,
    SpreadOfResistanceOverTimeChartType,
    SpreadOfResistanceOverTimeLineSeries,
} from "../../types";
import { DisaggregateBySpeciesOptions } from "../../../../../../components/filters/DisaggregateBySpecies";

export const INSECTICIDE_CLASS_COLORS: Record<string, string> = {
    NEONICOTINOIDS: "#e53d77",
    ORGANOCHLORINES: "#f68a24",
    ORGANOPHOSPHATES: "#e81225",
    PYRROLES: "#439336",
    PYRETHROIDS: "#5FB4AE",
    CARBAMATES: "#4876a8",
    DEFAULT: "#5FB4AE",
};

export const INSECTICIDE_CLASS_COLORS_OPACITY: Record<string, string> = {
    NEONICOTINOIDS: "rgb(229,61,119,0.6)",
    ORGANOCHLORINES: "rgb(246,138,36,0.6)",
    ORGANOPHOSPHATES: "rgb(232,18,37,0.6)",
    PYRROLES: "rgb(67,147,54,0.6)",
    PYRETHROIDS: "rgb(95,180,174,0.6)",
    CARBAMATES: "rgb(72,118,168,0.6)",
    DEFAULT: "rgb(95,180,174,0.6)",
};

function getMaxSumConfirmedResistanceOfData(data: SpreadOfResistanceOverTimeLineSeries[]): number {
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
                const dataBySpecie = dataOfCountry[specie] as SpreadOfResistanceOverTimeLineSeries[];
                return getMaxSumConfirmedResistanceOfData(dataBySpecie);
            });
            return [...acc, Math.max(...allSumConfirmedResistanceOfData)];
        }
        const dataOfCountry = dataByCountry[isoCountry] as SpreadOfResistanceOverTimeLineSeries[];
        const maxOfData = getMaxSumConfirmedResistanceOfData(dataOfCountry);
        return [...acc, maxOfData];
    }, [] as number[]);
    return Math.max(...maxDataByCountry);
}

function getLineChartDataByYear(
    confirmedStudiesOfInsecticideClass: PreventionStudy[],
    sortedYears: number[]
): number[] {
    return sortedYears.reduce((acc, year, i) => {
        const studiesOfYear = confirmedStudiesOfInsecticideClass.filter(study => Number(study.YEAR_START) === year);
        const studiesOfYearGroupedBySite = groupBy(studiesOfYear, "SITE_ID");

        const numberOfSitesConfirmedResistanceOfYear = Object.keys(studiesOfYearGroupedBySite)?.length || 0;
        const priorYearSumOfConfirmedResistanceStudies = i === 0 ? 0 : acc[i - 1];

        const sumOfConfirmedResistanceStudies =
            priorYearSumOfConfirmedResistanceStudies + numberOfSitesConfirmedResistanceOfYear;
        return [...acc, sumOfConfirmedResistanceStudies];
    }, [] as number[]);
}

function getColorByInsecticideClass(insecticideClass: string): string {
    return INSECTICIDE_CLASS_COLORS[insecticideClass] || INSECTICIDE_CLASS_COLORS.DEFAULT;
}

function createLineChartData(
    studies: PreventionStudy[],
    sortedYears: number[],
    insecticideClasses: string[]
): SpreadOfResistanceOverTimeLineSeries[] {
    return insecticideClasses.reduce((acc, insecticideClass) => {
        const resistanceConfirmedStudies = studies.filter(study => study.RESISTANCE_STATUS === "CONFIRMED_RESISTANCE");
        const confirmedStudiesOfInsecticideClass = resistanceConfirmedStudies.filter(
            study => study.INSECTICIDE_CLASS === insecticideClass
        );

        const data = getLineChartDataByYear(confirmedStudiesOfInsecticideClass, sortedYears);

        if (data.every(value => value === 0)) {
            return acc;
        }
        return [
            ...acc,
            {
                type: "line",
                name: insecticideClass,
                data,
                color: getColorByInsecticideClass(insecticideClass),
            },
        ];
    }, [] as SpreadOfResistanceOverTimeLineSeries[]);
}

function createChartDataBySpecies(
    studies: PreventionStudy[],
    sortedYears: number[],
    insecticideClasses: string[]
): SpreadOfResistanceOverTimeBySpecie {
    const sortedSpecies = _.uniq(studies.map(study => study.SPECIES)).sort();

    return sortedSpecies.reduce((acc, specie) => {
        const studiesBySpecie = studies.filter(study => study.SPECIES === specie);
        const lineCharData = createLineChartData(studiesBySpecie, sortedYears, insecticideClasses);
        if (lineCharData.length === 0) {
            return acc;
        }
        return {
            ...acc,
            [specie]: lineCharData,
        };
    }, {} as SpreadOfResistanceOverTimeBySpecie);
}

function createChartDataByInsecticideClass(
    studies: PreventionStudy[],
    sortedYears: number[],
    insecticideClasses: string[],
    isDisaggregatedBySpecies: boolean
): SpreadOfResistanceOverTimeLineSeries[] | SpreadOfResistanceOverTimeBySpecie {
    return isDisaggregatedBySpecies
        ? createChartDataBySpecies(studies, sortedYears, insecticideClasses)
        : createLineChartData(studies, sortedYears, insecticideClasses);
}

export function createChartDataByType(
    filteredsStudies: PreventionStudy[],
    selectedCountries: string[],
    sortedYears: number[],
    insecticideClasses: string[],
    disaggregateBySpeciesSelectionFilter: DisaggregateBySpeciesOptions,
    type: SpreadOfResistanceOverTimeChartType
): SpreadOfResistanceOverTimeChartData {
    const isDisaggregatedBySpecies = disaggregateBySpeciesSelectionFilter === "disaggregate_species";

    const dataByCountry = selectedCountries.reduce((acc, countryISO) => {
        const filteredStudiesOfCountry = filteredsStudies.filter(study => study.ISO2 === countryISO);
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
