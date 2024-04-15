import { groupBy, uniq } from "lodash";
import i18next from "i18next";

import { PreventionStudy } from "../../../../../../../domain/entities/PreventionStudy";
import {
    SpreadOfResistanceOverTimeByCountryAndSpeciesBarChart,
    SpreadOfResistanceOverTimeByCountryBarChart,
    SpreadOfResistanceOverTimeBySpecieBarChart,
    SpreadOfResistanceOverTimeSeriesBarChart,
    SpreadOfResistanceOverTimeBarData,
    SpreadOfResistanceOverTimeChartType,
    SpreadOfResistanceOverTimeChartData,
} from "../../types";
import { DisaggregateBySpeciesOptions } from "../../../../../../components/filters/DisaggregateBySpecies";
import { ResistanceStatusColors } from "../../../../../../components/layers/prevention/ResistanceStatus/symbols";
import _ from "lodash";

function createSerieByStatusAndYear(
    studies: PreventionStudy[],
    sortedYears: number[],
    resistanceStatus: string,
    insecticideClassOrType: string,
    name: string,
    color: string
): SpreadOfResistanceOverTimeSeriesBarChart {
    const resistanceStudiesOfStatus = studies.filter(study => study.RESISTANCE_STATUS === resistanceStatus);
    return {
        type: "column",
        name,
        color,
        data: getBarChartDataByYear(
            studies,
            resistanceStudiesOfStatus,
            sortedYears,
            resistanceStatus,
            insecticideClassOrType
        ),
    };
}

function getBarChartDataByYear(
    studies: PreventionStudy[],
    resistanceStudiesOfStatus: PreventionStudy[],
    sortedYears: number[],
    resistanceStatus: string,
    insecticideClassOrType: string
): SpreadOfResistanceOverTimeBarData[] {
    return sortedYears.reduce((acc, year) => {
        const studiesOfYear = studies.filter(study => study.YEAR_START === year);
        const studiesOfYearGroupedBySite = groupBy(studiesOfYear, "SITE_ID");
        const numberOfSitesOfYear = Object.keys(studiesOfYearGroupedBySite)?.length || 0;

        const resistanceStudiesOfStatusOfYear = resistanceStudiesOfStatus.filter(study => study.YEAR_START === year);
        const resistanceStudiesOfStatusOfYearGroupedBySite = groupBy(resistanceStudiesOfStatusOfYear, "SITE_ID");
        const numberOfSitesWithThisStatusOfYear =
            Object.keys(resistanceStudiesOfStatusOfYearGroupedBySite)?.length || 0;

        const species = uniq(resistanceStudiesOfStatus.map(study => study.SPECIES)).sort();
        return [
            ...acc,
            {
                y: numberOfSitesWithThisStatusOfYear,
                insecticide: insecticideClassOrType,
                year,
                species,
                resistanceStatus,
                totalNumberOfSites: numberOfSitesOfYear,
                numberOfSitesWithThisStatus: numberOfSitesWithThisStatusOfYear,
            },
        ] as SpreadOfResistanceOverTimeBarData[];
    }, [] as SpreadOfResistanceOverTimeBarData[]);
}

function createBarChartSeriesData(
    studies: PreventionStudy[],
    sortedYears: number[],
    insecticideClassOrType: string
): SpreadOfResistanceOverTimeSeriesBarChart[] {
    const resistanceConfirmed = createSerieByStatusAndYear(
        studies,
        sortedYears,
        "CONFIRMED_RESISTANCE",
        insecticideClassOrType,
        i18next.t("common.dashboard.phenotypicInsecticideResistanceDashboards.confirmed"),
        ResistanceStatusColors.Confirmed[0]
    );

    const resistancePosible = createSerieByStatusAndYear(
        studies,
        sortedYears,
        "POSSIBLE_RESISTANCE",
        insecticideClassOrType,
        i18next.t("common.dashboard.phenotypicInsecticideResistanceDashboards.possible"),
        ResistanceStatusColors.Possible[0]
    );

    const resistanceSusceptible = createSerieByStatusAndYear(
        studies,
        sortedYears,
        "SUSCEPTIBLE",
        insecticideClassOrType,
        i18next.t("common.dashboard.phenotypicInsecticideResistanceDashboards.susceptible"),
        ResistanceStatusColors.Susceptible[0]
    );

    const isAllEmpty = [resistanceSusceptible, resistancePosible, resistanceConfirmed].every(({ data }) => {
        return data.every(value => value.y === 0);
    });
    return isAllEmpty ? [] : [resistanceSusceptible, resistancePosible, resistanceConfirmed];
}

function createChartDataBySpecies(
    studies: PreventionStudy[],
    sortedYears: number[],
    insecticideClassOrType: string,
    sortedSpecies: string[]
): SpreadOfResistanceOverTimeBySpecieBarChart {
    return sortedSpecies.reduce((acc, specie) => {
        const studiesOfSpecie = studies.filter(study => study.SPECIES === specie);
        const barChartSeriesData = createBarChartSeriesData(studiesOfSpecie, sortedYears, insecticideClassOrType);
        return barChartSeriesData.length === 0
            ? acc
            : {
                  ...acc,
                  [specie]: barChartSeriesData as SpreadOfResistanceOverTimeSeriesBarChart[],
              };
    }, {} as SpreadOfResistanceOverTimeBySpecieBarChart);
}

function getMaxNumberOfSitesSeriesData(barChartSeriesData: SpreadOfResistanceOverTimeSeriesBarChart[]): number {
    const maxValues = barChartSeriesData.reduce((acc: number[], barChartSerieData) => {
        return acc.length === 0
            ? barChartSerieData.data.map(({ y }) => y)
            : barChartSerieData.data.map((value, index) => value.y + acc[index]);
    }, []);

    return Math.max(...maxValues);
}

function getMaxNumberOfSites(
    dataByCountry: SpreadOfResistanceOverTimeByCountryBarChart | SpreadOfResistanceOverTimeByCountryAndSpeciesBarChart,
    isDisaggregatedBySpecies: boolean
): number {
    return Object.keys(dataByCountry).reduce((acc, isoCountry) => {
        if (isDisaggregatedBySpecies) {
            const dataOfCountryBySpecie = dataByCountry[isoCountry] as SpreadOfResistanceOverTimeBySpecieBarChart;
            const allNumberOfSitesSeriesData = Object.keys(dataOfCountryBySpecie).map(specie => {
                const dataOfSpecie = dataOfCountryBySpecie[specie] as SpreadOfResistanceOverTimeSeriesBarChart[];
                return getMaxNumberOfSitesSeriesData(dataOfSpecie);
            });

            return Math.max(acc, ...allNumberOfSitesSeriesData);
        }
        const dataOfCountry = dataByCountry[isoCountry] as SpreadOfResistanceOverTimeSeriesBarChart[];

        return getMaxNumberOfSitesSeriesData(dataOfCountry);
    }, 0);
}

export function createBarChartData(
    filteredsStudies: PreventionStudy[],
    selectedCountries: string[],
    sortedYears: number[],
    insecticideClassOrType: string,
    disaggregateBySpeciesSelectionFilter: DisaggregateBySpeciesOptions,
    chartType: SpreadOfResistanceOverTimeChartType
): SpreadOfResistanceOverTimeChartData {
    const isDisaggregatedBySpecies = disaggregateBySpeciesSelectionFilter === "disaggregate_species";

    const chartByKey = chartType === "by-insecticide-class" ? "INSECTICIDE_CLASS" : "INSECTICIDE_TYPE";
    const studiesOfInsecticideClassOrType = filteredsStudies.filter(
        study => study[chartByKey] === insecticideClassOrType
    );

    const sortCountries = _.orderBy(selectedCountries, country => i18next.t(country), "asc");

    const dataByCountry = sortCountries.reduce((acc, countryISO) => {
        const filteredStudiesOfCountry = studiesOfInsecticideClassOrType.filter(study => study.ISO2 === countryISO);
        if (insecticideClassOrType && filteredStudiesOfCountry.length) {
            const sortedSpecies = uniq(filteredStudiesOfCountry.map(study => study.SPECIES)).sort();

            return {
                ...acc,
                [countryISO]: isDisaggregatedBySpecies
                    ? createChartDataBySpecies(
                          filteredStudiesOfCountry,
                          sortedYears,
                          insecticideClassOrType,
                          sortedSpecies
                      )
                    : createBarChartSeriesData(filteredStudiesOfCountry, sortedYears, insecticideClassOrType),
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
            maxValue: getMaxNumberOfSites(dataByCountry, isDisaggregatedBySpecies),
        },
    };
}
