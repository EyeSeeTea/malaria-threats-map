import { PreventionStudy } from "../../../../../../../domain/entities/PreventionStudy";
import {
    SpreadOfResistanceOverTimeByCountryAndSpeciesBarChart,
    SpreadOfResistanceOverTimeByCountryBarChart,
    SpreadOfResistanceOverTimeBySpecieBarChart,
    SpreadOfResistanceOverTimeChartDataByClass,
    SpreadOfResistanceOverTimeSeriesBarChart,
} from "../../types";
import { DisaggregateBySpeciesOptions } from "../../../../../../components/filters/DisaggregateBySpecies";
import { groupBy, uniq } from "lodash";
import { ResistanceStatusColors } from "../../../../../../components/layers/prevention/ResistanceStatus/symbols";
import i18next from "i18next";

function createSerieByStatusAndYear(
    studies: PreventionStudy[],
    sortedYears: number[],
    resitanceStatus: string,
    name: string,
    color: string
): SpreadOfResistanceOverTimeSeriesBarChart {
    const resistanceConfirmedStudies = studies.filter(study => study.RESISTANCE_STATUS === resitanceStatus);
    return {
        type: "column",
        name,
        color,
        data: getNumberOfSitesByYear(resistanceConfirmedStudies, sortedYears),
    };
}

function getNumberOfSitesByYear(studies: PreventionStudy[], sortedYears: number[]): number[] {
    return sortedYears.reduce((acc, year) => {
        const studiesOfYear = studies.filter(study => Number(study.YEAR_START) === year);
        const studiesOfYearGroupedBySite = groupBy(studiesOfYear, "SITE_ID");
        const numberOfSitesOfYear = Object.keys(studiesOfYearGroupedBySite)?.length || 0;
        return [...acc, numberOfSitesOfYear];
    }, [] as number[]);
}

function createBarChartSeriesData(
    studies: PreventionStudy[],
    sortedYears: number[]
): SpreadOfResistanceOverTimeSeriesBarChart[] {
    const resistanceConfirmed = createSerieByStatusAndYear(
        studies,
        sortedYears,
        "CONFIRMED_RESISTANCE",
        i18next.t("common.dashboard.phenotypicInsecticideResistanceDashboards.confirmed"),
        ResistanceStatusColors.Confirmed[0]
    );

    const resistancePosible = createSerieByStatusAndYear(
        studies,
        sortedYears,
        "POSSIBLE_RESISTANCE",
        i18next.t("common.dashboard.phenotypicInsecticideResistanceDashboards.possible"),
        ResistanceStatusColors.Possible[0]
    );

    const resistanceSusceptible = createSerieByStatusAndYear(
        studies,
        sortedYears,
        "SUSCEPTIBLE",
        i18next.t("common.dashboard.phenotypicInsecticideResistanceDashboards.susceptible"),
        ResistanceStatusColors.Susceptible[0]
    );

    return [resistanceSusceptible, resistancePosible, resistanceConfirmed];
}

function createChartDataBySpecies(
    studies: PreventionStudy[],
    sortedYears: number[]
): SpreadOfResistanceOverTimeBySpecieBarChart {
    const sortedSpecies = uniq(studies.map(study => study.SPECIES)).sort();

    return sortedSpecies.reduce((acc, specie) => {
        const studiesOfSpecie = studies.filter(study => study.SPECIES === specie);
        const barChartSeriesData = createBarChartSeriesData(studiesOfSpecie, sortedYears);
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
            ? barChartSerieData.data
            : barChartSerieData.data.map((value, index) => value + acc[index]);
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
    insecticideClass: string,
    disaggregateBySpeciesSelectionFilter: DisaggregateBySpeciesOptions
): SpreadOfResistanceOverTimeChartDataByClass {
    const isDisaggregatedBySpecies = disaggregateBySpeciesSelectionFilter === "disaggregate_species";
    const studiesOfInsecticideClass = filteredsStudies.filter(study => study.INSECTICIDE_CLASS === insecticideClass);

    const dataByCountry = selectedCountries.reduce((acc, countryISO) => {
        const filteredStudiesOfCountry = studiesOfInsecticideClass.filter(study => study.ISO2 === countryISO);
        if (insecticideClass && filteredStudiesOfCountry.length) {
            return {
                ...acc,
                [countryISO]: isDisaggregatedBySpecies
                    ? createChartDataBySpecies(filteredStudiesOfCountry, sortedYears)
                    : createBarChartSeriesData(filteredStudiesOfCountry, sortedYears),
            };
        }
        return {
            ...acc,
            [countryISO]: [],
        };
    }, {});

    return {
        kind: "InsecticideByClass",
        data: {
            years: sortedYears,
            dataByCountry,
            maxValue: getMaxNumberOfSites(dataByCountry, isDisaggregatedBySpecies),
        },
    };
}
