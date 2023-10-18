import _, { groupBy } from "lodash";
import { PreventionStudy } from "../../../../../../../domain/entities/PreventionStudy";
import {
    SpreadOfResistanceOverTimeByCountry,
    SpreadOfResistanceOverTimeByCountryAndSpecies,
    SpreadOfResistanceOverTimeBySpecie,
    SpreadOfResistanceOverTimeChartData,
    SpreadOfResistanceOverTimeLineSeries,
    SpreadOfResistanceOverTimeScatterSeries,
    SpreadOfResistanceOverTimeScatterData,
    SpreadOfResistanceOverTimeSeries,
    SpreadOfResistanceOverTimeLineData,
    SpreadOfResistanceOverTimeTooltipData,
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
}): SpreadOfResistanceOverTimeTooltipData {
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

function getScatterChartDataByYear(
    studiesOfInsecticideClass: PreventionStudy[],
    sortedYears: number[],
    insecticideClass: string
): SpreadOfResistanceOverTimeScatterData[] {
    return sortedYears.reduce((acc, year, i) => {
        const priorSumOfSites = i === 0 ? 0 : acc[i - 1].sumOfSites;

        const priorYearSumOfConfirmedResistanceSites = i === 0 ? 0 : acc[i - 1].sumOfConfirmedResistanceSites;

        const { sumOfConfirmedResistanceSites, numberOfSites, ...restData } = getTooltipData({
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
                marker: {
                    lineWidth: 0.6,
                    lineColor: getColorByInsecticideClass(insecticideClass),
                    fillColor: getColorWithOpacityByInsecticideClass(insecticideClass),
                    radius: numberOfSites,
                },
                sumOfConfirmedResistanceSites,
                numberOfSites,
                ...restData,
            } as SpreadOfResistanceOverTimeScatterData,
        ];
    }, [] as SpreadOfResistanceOverTimeScatterData[]);
}

function createScatterChartSeriesData(
    studies: PreventionStudy[],
    sortedYears: number[],
    insecticideClasses: string[]
): SpreadOfResistanceOverTimeScatterSeries[] {
    return insecticideClasses.reduce((acc, insecticideClass) => {
        const studiesOfInsecticideClass = studies.filter(study => study.INSECTICIDE_CLASS === insecticideClass);

        const data = getScatterChartDataByYear(studiesOfInsecticideClass, sortedYears, insecticideClass);

        if (data.every(value => value.y === 0)) {
            return acc;
        }
        return [
            ...acc,
            {
                type: "scatter",
                name: insecticideClass,
                data,
                marker: {
                    symbol: "circle",
                },
            },
        ];
    }, [] as SpreadOfResistanceOverTimeScatterSeries[]);
}

function createLineChartSeriesData(
    studies: PreventionStudy[],
    sortedYears: number[],
    insecticideClasses: string[]
): SpreadOfResistanceOverTimeLineSeries[] {
    return insecticideClasses.reduce((acc, insecticideClass) => {
        const studiesOfInsecticideClass = studies.filter(study => study.INSECTICIDE_CLASS === insecticideClass);

        const data = getLineChartDataByYear(studiesOfInsecticideClass, sortedYears, insecticideClass);

        if (data.every(value => value.y === 0)) {
            return acc;
        }
        return [
            ...acc,
            {
                type: "line",
                name: insecticideClass,
                data,
                color: getColorByInsecticideClass(insecticideClass),
                marker: {
                    enabled: false,
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
        const scatterChartSeriesData = createScatterChartSeriesData(studiesOfSpecie, sortedYears, insecticideClasses);
        if (lineChartSeriesData.length === 0) {
            return acc;
        }
        return {
            ...acc,
            [specie]: [...lineChartSeriesData, ...scatterChartSeriesData] as SpreadOfResistanceOverTimeSeries[],
        };
    }, {} as SpreadOfResistanceOverTimeBySpecie);
}

function createChartDataByInsecticideClass(
    studies: PreventionStudy[],
    sortedYears: number[],
    insecticideClasses: string[],
    isDisaggregatedBySpecies: boolean
): SpreadOfResistanceOverTimeSeries[] | SpreadOfResistanceOverTimeBySpecie {
    if (isDisaggregatedBySpecies) {
        return createChartDataBySpecies(studies, sortedYears, insecticideClasses);
    }
    const lineChartSeriesData = createLineChartSeriesData(studies, sortedYears, insecticideClasses);
    const scatterChartSeriesData = createScatterChartSeriesData(studies, sortedYears, insecticideClasses);
    return [...lineChartSeriesData, ...scatterChartSeriesData] as SpreadOfResistanceOverTimeSeries[];
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
                const dataOfSpecie = dataOfCountryBySpecie[specie] as SpreadOfResistanceOverTimeSeries[];
                const lineChartSeriesDataOfSpecie = dataOfSpecie.filter(
                    ({ type }) => type === "line"
                ) as SpreadOfResistanceOverTimeLineSeries[];
                return getMaxSumConfirmedResistanceOfSeriesData(lineChartSeriesDataOfSpecie);
            });
            return Math.max(acc, ...allSumConfirmedResistanceOfSeriesData);
        }
        const dataOfCountry = dataByCountry[isoCountry] as SpreadOfResistanceOverTimeSeries[];
        const lineChartSeriesDataOfCountry = dataOfCountry.filter(
            ({ type }) => type === "line"
        ) as SpreadOfResistanceOverTimeLineSeries[];

        const maxOfSeriesData = getMaxSumConfirmedResistanceOfSeriesData(lineChartSeriesDataOfCountry);
        return Math.max(acc, maxOfSeriesData);
    }, 0);
}

function getMaxNumberOfSitesOfDataSeries(scatterChartDataSeries: SpreadOfResistanceOverTimeScatterSeries[]): number {
    const allNumberOfSitesOfDataSeries = scatterChartDataSeries
        .flatMap(dataOfYear => dataOfYear.data)
        .map(({ marker }) => marker.radius);

    return Math.max(...allNumberOfSitesOfDataSeries);
}

function getMaxNumberOfSites(
    dataByCountry: SpreadOfResistanceOverTimeByCountry | SpreadOfResistanceOverTimeByCountryAndSpecies,
    isDisaggregatedBySpecies: boolean
): number {
    return Object.keys(dataByCountry).reduce((acc, isoCountry) => {
        if (isDisaggregatedBySpecies) {
            const dataOfCountryBySpecie = dataByCountry[isoCountry] as SpreadOfResistanceOverTimeBySpecie;
            const allNumberOfSites = Object.keys(dataOfCountryBySpecie).map(specie => {
                const dataOfSpecie = dataOfCountryBySpecie[specie] as SpreadOfResistanceOverTimeSeries[];
                const scatterChartDataSeriesOfSpecie = dataOfSpecie.filter(
                    ({ type }) => type === "scatter"
                ) as SpreadOfResistanceOverTimeScatterSeries[];
                return scatterChartDataSeriesOfSpecie.length
                    ? getMaxNumberOfSitesOfDataSeries(scatterChartDataSeriesOfSpecie)
                    : 0;
            });
            return Math.max(acc, ...allNumberOfSites);
        }
        const dataOfCountry = dataByCountry[isoCountry] as SpreadOfResistanceOverTimeSeries[];
        const scatterChartDataSeriesOfCountry = dataOfCountry.filter(
            ({ type }) => type === "scatter"
        ) as SpreadOfResistanceOverTimeScatterSeries[];

        const maxOfData = scatterChartDataSeriesOfCountry.length
            ? getMaxNumberOfSitesOfDataSeries(scatterChartDataSeriesOfCountry)
            : 0;

        return Math.max(acc, maxOfData);
    }, 0);
}

function getNormalizedRadius(
    dataSeries: SpreadOfResistanceOverTimeScatterSeries,
    maxNumberOfSites: number
): SpreadOfResistanceOverTimeScatterSeries {
    const maxRadius = 20;
    const scalingFactor = maxRadius / maxNumberOfSites;
    return {
        ...dataSeries,
        data: dataSeries.data.map(data => {
            return {
                ...data,
                marker: {
                    ...data.marker,
                    radius: data.marker.radius * scalingFactor,
                },
            };
        }),
    };
}

function normalizeScatterChartRadius(
    dataByCountry: SpreadOfResistanceOverTimeByCountry | SpreadOfResistanceOverTimeByCountryAndSpecies,
    isDisaggregatedBySpecies: boolean
): SpreadOfResistanceOverTimeByCountry | SpreadOfResistanceOverTimeByCountryAndSpecies {
    const maxNumberOfSites = getMaxNumberOfSites(dataByCountry, isDisaggregatedBySpecies);

    if (isDisaggregatedBySpecies) {
        return Object.keys(dataByCountry).reduce((accByCountry, isoCountry) => {
            const dataOfCountryBySpecie = dataByCountry[isoCountry] as SpreadOfResistanceOverTimeBySpecie;
            return {
                ...accByCountry,
                [isoCountry]: Object.keys(dataOfCountryBySpecie).reduce((accBySpecie, specie) => {
                    const dataOfSpecie = dataOfCountryBySpecie[specie] as SpreadOfResistanceOverTimeSeries[];
                    return {
                        ...accBySpecie,
                        [specie]: dataOfSpecie.map(dataSeries => {
                            return dataSeries.type === "scatter"
                                ? getNormalizedRadius(dataSeries, maxNumberOfSites)
                                : dataSeries;
                        }),
                    } as SpreadOfResistanceOverTimeBySpecie;
                }, {} as SpreadOfResistanceOverTimeBySpecie),
            } as SpreadOfResistanceOverTimeByCountryAndSpecies;
        }, {} as SpreadOfResistanceOverTimeByCountryAndSpecies);
    }

    return Object.keys(dataByCountry).reduce((accByCountry, isoCountry) => {
        const dataOfCountry = dataByCountry[isoCountry] as SpreadOfResistanceOverTimeSeries[];
        return {
            ...accByCountry,
            [isoCountry]: dataOfCountry.map(dataSeries => {
                return dataSeries.type === "scatter" ? getNormalizedRadius(dataSeries, maxNumberOfSites) : dataSeries;
            }),
        } as SpreadOfResistanceOverTimeByCountry;
    }, {} as SpreadOfResistanceOverTimeByCountry);
}

export function createChartData(
    filteredsStudies: PreventionStudy[],
    selectedCountries: string[],
    sortedYears: number[],
    insecticideClasses: string[],
    disaggregateBySpeciesSelectionFilter: DisaggregateBySpeciesOptions
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

    const dataByCountryWithNormalizedRadius = normalizeScatterChartRadius(dataByCountry, isDisaggregatedBySpecies);

    return {
        kind: "InsecticideByClass",
        data: {
            years: sortedYears,
            dataByCountry: dataByCountryWithNormalizedRadius,
            maxSumOfConfirmedResistance: getMaxSumConfirmedResistance(dataByCountry, isDisaggregatedBySpecies),
        },
    };
}
