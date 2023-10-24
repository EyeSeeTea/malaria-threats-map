import _, { groupBy } from "lodash";
import { PreventionStudy } from "../../../../../../../domain/entities/PreventionStudy";
import {
    SpreadOfResistanceOverTimeLineSeries,
    SpreadOfResistanceOverTimeLineData,
    SpreadOfResistanceOverTimeTooltipDataLineChart,
    SpreadOfResistanceOverTimeChartDataByClass,
    SpreadOfResistanceOverTimeBySpecie,
    SpreadOfResistanceOverTimeByCountryAndSpecies,
    SpreadOfResistanceOverTimeByCountry,
} from "../../types";
import { DisaggregateBySpeciesOptions } from "../../../../../../components/filters/DisaggregateBySpecies";

export const INSECTICIDE_CLASS_COLORS: Record<string, string> = {
    NEONICOTINOIDS: "#e53d77",
    ORGANOCHLORINES: "#f68a24",
    ORGANOPHOSPHATES: "#e81225",
    PYRROLES: "#439336",
    PYRETHROIDS: "#5FB4AE",
    CARBAMATES: "#4876a8",
    NA: "#7B5FD9",
    DEFAULT: "#5FB4AE",
};

export const INSECTICIDE_CLASS_COLORS_OPACITY: Record<string, string> = {
    NEONICOTINOIDS: "rgb(229,61,119,0.6)",
    ORGANOCHLORINES: "rgb(246,138,36,0.6)",
    ORGANOPHOSPHATES: "rgb(232,18,37,0.6)",
    PYRROLES: "rgb(67,147,54,0.6)",
    PYRETHROIDS: "rgb(95,180,174,0.6)",
    CARBAMATES: "rgb(72,118,168,0.6)",
    NA: "rgb(123,95,217)",
    DEFAULT: "rgb(95,180,174,0.6)",
};

function getColorByInsecticideClass(insecticideClass: string): string {
    return INSECTICIDE_CLASS_COLORS[insecticideClass] || INSECTICIDE_CLASS_COLORS.DEFAULT;
}

function getColorWithOpacityByInsecticideClass(insecticideClass: string): string {
    return INSECTICIDE_CLASS_COLORS_OPACITY[insecticideClass] || INSECTICIDE_CLASS_COLORS_OPACITY.DEFAULT;
}

function getTooltipData(params: {
    studiesOfInsecticideClass: PreventionStudy[];
    currentYear: number;
    firstYear: number;
    priorSumOfSites: number;
    priorYearSumOfConfirmedResistanceSites: number;
    insecticideClass: string;
}): SpreadOfResistanceOverTimeTooltipDataLineChart {
    const {
        studiesOfInsecticideClass,
        currentYear,
        firstYear,
        priorSumOfSites,
        priorYearSumOfConfirmedResistanceSites,
        insecticideClass,
    } = params;

    const studiesOfYear = studiesOfInsecticideClass.filter(study => Number(study.YEAR_START) === currentYear);
    const studiesOfYearGroupedBySite = groupBy(studiesOfYear, "SITE_ID");
    const numberOfSitesOfYear = Object.keys(studiesOfYearGroupedBySite)?.length || 0;
    const sumOfSites = priorSumOfSites + numberOfSitesOfYear;

    const confirmedStudiesOfInsecticideClassOfYear = studiesOfYear.filter(
        study => study.RESISTANCE_STATUS === "CONFIRMED_RESISTANCE"
    );
    const confirmedStudiesOfYearGroupedBySite = groupBy(confirmedStudiesOfInsecticideClassOfYear, "SITE_ID");
    const numberOfSitesConfirmedResistanceOfYear = Object.keys(confirmedStudiesOfYearGroupedBySite)?.length || 0;
    const sumOfConfirmedResistanceSites =
        priorYearSumOfConfirmedResistanceSites + numberOfSitesConfirmedResistanceOfYear;

    return {
        insecticideClass,
        sumOfConfirmedResistanceSites,
        sumOfSites,
        numberOfSites: numberOfSitesOfYear,
        numberOfSitesConfirmedResistance: numberOfSitesConfirmedResistanceOfYear,
        year: currentYear.toString(),
        rangeYears: `${firstYear}-${currentYear}`,
    };
}

function getLineChartDataByYear(
    studiesOfInsecticideClass: PreventionStudy[],
    sortedYears: number[],
    insecticideClass: string
): SpreadOfResistanceOverTimeLineData[] {
    return sortedYears.reduce((acc, year, i) => {
        const priorSumOfSites = i === 0 ? 0 : acc[i - 1].sumOfSites;

        const priorYearSumOfConfirmedResistanceSites = i === 0 ? 0 : acc[i - 1].sumOfConfirmedResistanceSites;

        const { sumOfConfirmedResistanceSites, ...restData } = getTooltipData({
            studiesOfInsecticideClass,
            currentYear: year,
            firstYear: sortedYears[0],
            priorSumOfSites,
            priorYearSumOfConfirmedResistanceSites,
            insecticideClass,
        });

        return [
            ...acc,
            {
                y: sumOfConfirmedResistanceSites,
                sumOfConfirmedResistanceSites,
                ...restData,
            },
        ];
    }, [] as SpreadOfResistanceOverTimeLineData[]);
}

function createLineChartSeriesData(
    studies: PreventionStudy[],
    sortedYears: number[],
    insecticideClasses: string[]
): SpreadOfResistanceOverTimeLineSeries[] {
    return insecticideClasses.reduce((acc, insecticideClass) => {
        const studiesOfInsecticideClass = studies.filter(study => study.INSECTICIDE_CLASS === insecticideClass);

        const data = getLineChartDataByYear(studiesOfInsecticideClass, sortedYears, insecticideClass);

        return data.every(value => value.y === 0)
            ? acc
            : [
                  ...acc,
                  {
                      type: "line",
                      name: insecticideClass,
                      data,
                      color: getColorByInsecticideClass(insecticideClass),
                      marker: {
                          symbol: "circle",
                          radius: 5,
                          lineWidth: 0.6,
                          lineColor: getColorByInsecticideClass(insecticideClass),
                          fillColor: getColorWithOpacityByInsecticideClass(insecticideClass),
                      },
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
        const studiesOfSpecie = studies.filter(study => study.SPECIES === specie);
        const lineChartSeriesData = createLineChartSeriesData(studiesOfSpecie, sortedYears, insecticideClasses);
        return lineChartSeriesData.length === 0
            ? acc
            : {
                  ...acc,
                  [specie]: lineChartSeriesData,
              };
    }, {} as SpreadOfResistanceOverTimeBySpecie);
}

function getMaxSumConfirmedResistanceOfSeriesData(lineChartSeriesData: SpreadOfResistanceOverTimeLineSeries[]): number {
    const totalSumsConfirmedResistanceOfData = lineChartSeriesData.flatMap(dataOfYear =>
        dataOfYear.data.length ? dataOfYear.data[dataOfYear.data.length - 1].sumOfConfirmedResistanceSites : 0
    );
    return Math.max(...totalSumsConfirmedResistanceOfData);
}

function getMaxSumConfirmedResistance(
    dataByCountry: SpreadOfResistanceOverTimeByCountry | SpreadOfResistanceOverTimeByCountryAndSpecies,
    isDisaggregatedBySpecies: boolean
): number {
    return Object.keys(dataByCountry).reduce((acc, isoCountry) => {
        if (isDisaggregatedBySpecies) {
            const dataOfCountryBySpecie = dataByCountry[isoCountry] as SpreadOfResistanceOverTimeBySpecie;
            const allSumConfirmedResistanceOfSeriesData = Object.keys(dataOfCountryBySpecie).map(specie => {
                const dataOfSpecie = dataOfCountryBySpecie[specie] as SpreadOfResistanceOverTimeLineSeries[];
                return getMaxSumConfirmedResistanceOfSeriesData(dataOfSpecie);
            });
            return Math.max(acc, ...allSumConfirmedResistanceOfSeriesData);
        }
        const dataOfCountry = dataByCountry[isoCountry] as SpreadOfResistanceOverTimeLineSeries[];
        const maxOfSeriesData = getMaxSumConfirmedResistanceOfSeriesData(dataOfCountry);
        return Math.max(acc, maxOfSeriesData);
    }, 0);
}

export function createLineChartData(
    filteredsStudies: PreventionStudy[],
    selectedCountries: string[],
    sortedYears: number[],
    insecticideClasses: string[],
    disaggregateBySpeciesSelectionFilter: DisaggregateBySpeciesOptions
): SpreadOfResistanceOverTimeChartDataByClass {
    const isDisaggregatedBySpecies = disaggregateBySpeciesSelectionFilter === "disaggregate_species";

    const dataByCountry = selectedCountries.reduce((acc, countryISO) => {
        const filteredStudiesOfCountry = filteredsStudies.filter(study => study.ISO2 === countryISO);
        return {
            ...acc,
            [countryISO]: isDisaggregatedBySpecies
                ? createChartDataBySpecies(filteredStudiesOfCountry, sortedYears, insecticideClasses)
                : createLineChartSeriesData(filteredStudiesOfCountry, sortedYears, insecticideClasses),
        };
    }, {});

    return {
        kind: "InsecticideByClass",
        data: {
            years: sortedYears,
            dataByCountry,
            maxValue: getMaxSumConfirmedResistance(dataByCountry, isDisaggregatedBySpecies),
        },
    };
}
