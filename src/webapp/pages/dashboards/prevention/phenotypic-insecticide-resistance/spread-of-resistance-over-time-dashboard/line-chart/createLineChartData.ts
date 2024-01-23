import _, { groupBy } from "lodash";
import { PreventionStudy } from "../../../../../../../domain/entities/PreventionStudy";
import {
    SpreadOfResistanceOverTimeLineSeries,
    SpreadOfResistanceOverTimeLineData,
    SpreadOfResistanceOverTimeTooltipDataLineChart,
    SpreadOfResistanceOverTimeBySpecie,
    SpreadOfResistanceOverTimeByCountryAndSpecies,
    SpreadOfResistanceOverTimeByCountry,
    SpreadOfResistanceOverTimeChartData,
    SpreadOfResistanceOverTimeChartType,
} from "../../types";
import { DisaggregateBySpeciesOptions } from "../../../../../../components/filters/DisaggregateBySpecies";
import i18next from "i18next";

export const INSECTICIDE_TYPE_COLORS: Record<string, string> = {
    "ALPHA-CYPERMETHRIN": "#7B5FD9",
    BENDIOCARB: "#002366",
    BIFENTHRIN: "#ED5565",
    CARBOSULFAN: "#DAACD5",
    CHLORFENAPYR: "#f06800",
    CLOTHIANIDIN: "#461417",
    CYFLUTHRIN: "#ad5c61",
    CYPERMETHRIN: "#5e6e47",
    DDT: "#81252A",
    DELTAMETHRIN: "#e7a98e",
    DIELDRIN: "#8E4585",
    ETOFENPROX: "#e53d77",
    FENITROTHION: "#f68a24",
    "LAMBDA-CYHALOTHRIN": "#e81225",
    MALATHION: "#439336",
    PERMETHRIN: "#5FB4AE",
    "PIRIMIPHOS-METHYL": "#4876a8",
    PROPOXUR: "#89B5D4",
    DEFAULT: "#BEBEBE",
};

export const INSECTICIDE_TYPE_COLORS_OPACITY: Record<string, string> = {
    "ALPHA-CYPERMETHRIN": "rgb(123,95,217, 0.6)",
    BENDIOCARB: "rgb(0, 35, 102,0.6)",
    BIFENTHRIN: "rgb(237, 85, 101,0.6)",
    CARBOSULFAN: "rgb(218, 172, 213,0.6)",
    CHLORFENAPYR: "rgb(240, 104, 0,0.6)",
    CLOTHIANIDIN: "rgb(70, 20, 23,0.6)",
    CYFLUTHRIN: "rgb(173, 92, 97,0.6)",
    CYPERMETHRIN: "rgb(94, 110, 71, 0.6)",
    DDT: "rgb(129,37,42,0.6)",
    DELTAMETHRIN: "rgb(231,169,142,0.6)",
    DIELDRIN: "rgb(142,69,133,0.6)",
    ETOFENPROX: "rgb(229,61,119,0.6)",
    FENITROTHION: "rgb(246,138,36,0.6)",
    "LAMBDA-CYHALOTHRIN": "rgb(232,18,37,0.6)",
    MALATHION: "rgb(67,147,54,0.6)",
    PERMETHRIN: "rgb(95,180,174,0.6)",
    "PIRIMIPHOS-METHYL": "rgb(72,118,168,0.6)",
    PROPOXUR: "rgb(137,181,212, 0.6)",
    DEFAULT: "rgb(190, 190, 190, 0.6)",
};

export const INSECTICIDE_CLASS_COLORS: Record<string, string> = {
    NEONICOTINOIDS: "#e53d77",
    ORGANOCHLORINES: "#f68a24",
    ORGANOPHOSPHATES: "#e81225",
    PYRROLES: "#439336",
    PYRETHROIDS: "#5FB4AE",
    CARBAMATES: "#4876a8",
    DEFAULT: "#BEBEBE",
};

export const INSECTICIDE_CLASS_COLORS_OPACITY: Record<string, string> = {
    NEONICOTINOIDS: "rgb(229,61,119,0.6)",
    ORGANOCHLORINES: "rgb(246,138,36,0.6)",
    ORGANOPHOSPHATES: "rgb(232,18,37,0.6)",
    PYRROLES: "rgb(67,147,54,0.6)",
    PYRETHROIDS: "rgb(95,180,174,0.6)",
    CARBAMATES: "rgb(72,118,168,0.6)",
    DEFAULT: "rgb(190, 190, 190, 0.6)",
};

function getColorByInsecticideClassOrType(
    insecticideClassOrType: string,
    chartType: SpreadOfResistanceOverTimeChartType
): string {
    return chartType === "by-insecticide-class"
        ? INSECTICIDE_CLASS_COLORS[insecticideClassOrType] || INSECTICIDE_CLASS_COLORS.DEFAULT
        : INSECTICIDE_TYPE_COLORS[insecticideClassOrType] || INSECTICIDE_TYPE_COLORS.DEFAULT;
}

function getColorWithOpacityByInsecticideClassOrType(
    insecticideClassOrType: string,
    chartType: SpreadOfResistanceOverTimeChartType
): string {
    return chartType === "by-insecticide-class"
        ? INSECTICIDE_CLASS_COLORS_OPACITY[insecticideClassOrType] || INSECTICIDE_CLASS_COLORS_OPACITY.DEFAULT
        : INSECTICIDE_TYPE_COLORS_OPACITY[insecticideClassOrType] || INSECTICIDE_TYPE_COLORS_OPACITY.DEFAULT;
}

function getTooltipData(params: {
    studiesOfInsecticideClassOrType: PreventionStudy[];
    currentYear: number;
    firstYear: number;
    priorSumOfSites: number;
    priorYearSumOfConfirmedResistanceSites: number;
    insecticideClassOrType: string;
}): SpreadOfResistanceOverTimeTooltipDataLineChart {
    const {
        studiesOfInsecticideClassOrType,
        currentYear,
        firstYear,
        priorSumOfSites,
        priorYearSumOfConfirmedResistanceSites,
        insecticideClassOrType,
    } = params;

    const studiesOfYear = studiesOfInsecticideClassOrType.filter(study => Number(study.YEAR_START) === currentYear);
    const studiesOfYearGroupedBySite = groupBy(studiesOfYear, "SITE_ID");
    const numberOfSitesOfYear = Object.keys(studiesOfYearGroupedBySite)?.length || 0;
    const sumOfSites = priorSumOfSites + numberOfSitesOfYear;

    const confirmedStudiesOfInsecticideTypeOfYear = studiesOfYear.filter(
        study => study.RESISTANCE_STATUS === "CONFIRMED_RESISTANCE"
    );
    const confirmedStudiesOfYearGroupedBySite = groupBy(confirmedStudiesOfInsecticideTypeOfYear, "SITE_ID");
    const numberOfSitesConfirmedResistanceOfYear = Object.keys(confirmedStudiesOfYearGroupedBySite)?.length || 0;
    const sumOfConfirmedResistanceSites =
        priorYearSumOfConfirmedResistanceSites + numberOfSitesConfirmedResistanceOfYear;

    return {
        insecticideClassOrType,
        sumOfConfirmedResistanceSites,
        sumOfSites,
        numberOfSites: numberOfSitesOfYear,
        numberOfSitesConfirmedResistance: numberOfSitesConfirmedResistanceOfYear,
        year: currentYear.toString(),
        rangeYears: `${firstYear}-${currentYear}`,
    };
}

function getLineChartDataByYear(
    studiesOfInsecticideClassOrType: PreventionStudy[],
    sortedYears: number[],
    insecticideClassOrType: string
): SpreadOfResistanceOverTimeLineData[] {
    return sortedYears.reduce((acc, year, i) => {
        const priorSumOfSites = i === 0 ? 0 : acc[i - 1].sumOfSites;

        const priorYearSumOfConfirmedResistanceSites = i === 0 ? 0 : acc[i - 1].sumOfConfirmedResistanceSites;

        const { sumOfConfirmedResistanceSites, ...restData } = getTooltipData({
            studiesOfInsecticideClassOrType,
            currentYear: year,
            firstYear: sortedYears[0],
            priorSumOfSites,
            priorYearSumOfConfirmedResistanceSites,
            insecticideClassOrType,
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
    insecticideClassesOrTypes: string[],
    chartType: SpreadOfResistanceOverTimeChartType
): SpreadOfResistanceOverTimeLineSeries[] {
    return insecticideClassesOrTypes.reduce((acc, insecticideClassOrType) => {
        const chartByKey = chartType === "by-insecticide-class" ? "INSECTICIDE_CLASS" : "INSECTICIDE_TYPE";
        const studiesOfInsecticideClassOrType = studies.filter(study => study[chartByKey] === insecticideClassOrType);

        const data = getLineChartDataByYear(studiesOfInsecticideClassOrType, sortedYears, insecticideClassOrType);

        return data.every(value => value.y === 0)
            ? acc
            : [
                  ...acc,
                  {
                      type: "line",
                      name: insecticideClassOrType,
                      data,
                      color: getColorByInsecticideClassOrType(insecticideClassOrType, chartType),
                      marker: {
                          symbol: "circle",
                          radius: 5,
                          lineWidth: 0.6,
                          lineColor: getColorByInsecticideClassOrType(insecticideClassOrType, chartType),
                          fillColor: getColorWithOpacityByInsecticideClassOrType(insecticideClassOrType, chartType),
                      },
                  },
              ];
    }, [] as SpreadOfResistanceOverTimeLineSeries[]);
}

function createChartDataBySpecies(
    studies: PreventionStudy[],
    sortedYears: number[],
    insecticideClassesOrTypes: string[],
    chartType: SpreadOfResistanceOverTimeChartType
): SpreadOfResistanceOverTimeBySpecie {
    const sortedSpecies = _.uniq(studies.map(study => study.SPECIES)).sort();
    return sortedSpecies.reduce((acc, specie) => {
        const studiesOfSpecie = studies.filter(study => study.SPECIES === specie);
        const lineChartSeriesData = createLineChartSeriesData(
            studiesOfSpecie,
            sortedYears,
            insecticideClassesOrTypes,
            chartType
        );
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
    insecticideClassesOrTypes: string[],
    disaggregateBySpeciesSelectionFilter: DisaggregateBySpeciesOptions,
    chartType: SpreadOfResistanceOverTimeChartType
): SpreadOfResistanceOverTimeChartData {
    const isDisaggregatedBySpecies = disaggregateBySpeciesSelectionFilter === "disaggregate_species";

    const sortCountries = _.orderBy(selectedCountries, country => i18next.t(country), "asc");

    const dataByCountry = sortCountries.reduce((acc, countryISO) => {
        const filteredStudiesOfCountry = filteredsStudies.filter(study => study.ISO2 === countryISO);
        if (insecticideClassesOrTypes.length && filteredStudiesOfCountry.length) {
            return {
                ...acc,
                [countryISO]: isDisaggregatedBySpecies
                    ? createChartDataBySpecies(
                          filteredStudiesOfCountry,
                          sortedYears,
                          insecticideClassesOrTypes,
                          chartType
                      )
                    : createLineChartSeriesData(
                          filteredStudiesOfCountry,
                          sortedYears,
                          insecticideClassesOrTypes,
                          chartType
                      ),
            };
        }
        return {
            ...acc,
            [countryISO]: isDisaggregatedBySpecies ? {} : [],
        };
    }, {});

    return {
        kind: chartType === "by-insecticide-class" ? "InsecticideByClass" : "InsecticideByType",
        data: {
            years: sortedYears,
            dataByCountry,
            maxValue: getMaxSumConfirmedResistance(dataByCountry, isDisaggregatedBySpecies),
        },
    };
}
