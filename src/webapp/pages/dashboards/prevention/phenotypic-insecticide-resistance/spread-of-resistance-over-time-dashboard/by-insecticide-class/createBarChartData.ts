import { PreventionStudy } from "../../../../../../../domain/entities/PreventionStudy";
import {
    SpreadOfResistanceOverTimeByCountryAndSpeciesBarChart,
    SpreadOfResistanceOverTimeByCountryBarChart,
    SpreadOfResistanceOverTimeBySpecieBarChart,
    SpreadOfResistanceOverTimeChartDataByClass,
    SpreadOfResistanceOverTimeSeriesBarChart,
    SpreadOfResistanceOverTimeBarData,
} from "../../types";
import { DisaggregateBySpeciesOptions } from "../../../../../../components/filters/DisaggregateBySpecies";
import { groupBy, uniq } from "lodash";
import { ResistanceStatusColors } from "../../../../../../components/layers/prevention/ResistanceStatus/symbols";
import i18next from "i18next";

function createSerieByStatusAndYear(
    studies: PreventionStudy[],
    sortedYears: number[],
    resistanceStatus: string,
    insecticideClass: string,
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
            insecticideClass
        ),
    };
}

function getBarChartDataByYear(
    studies: PreventionStudy[],
    resistanceStudiesOfStatus: PreventionStudy[],
    sortedYears: number[],
    resistanceStatus: string,
    insecticideClass: string
): SpreadOfResistanceOverTimeBarData[] {
    return sortedYears.reduce((acc, year) => {
        const studiesOfYear = studies.filter(study => Number(study.YEAR_START) === year);
        const studiesOfYearGroupedBySite = groupBy(studiesOfYear, "SITE_ID");
        const numberOfSitesOfYear = Object.keys(studiesOfYearGroupedBySite)?.length || 0;

        const resistanceStudiesOfStatusOfYear = resistanceStudiesOfStatus.filter(
            study => Number(study.YEAR_START) === year
        );
        const resistanceStudiesOfStatusOfYearGroupedBySite = groupBy(resistanceStudiesOfStatusOfYear, "SITE_ID");
        const numberOfSitesWithThisStatusOfYear =
            Object.keys(resistanceStudiesOfStatusOfYearGroupedBySite)?.length || 0;

        const species = uniq(resistanceStudiesOfStatus.map(study => study.SPECIES)).sort();

        return [
            ...acc,
            {
                y: numberOfSitesWithThisStatusOfYear,
                insecticideClass,
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
    insecticideClass: string
): SpreadOfResistanceOverTimeSeriesBarChart[] {
    const resistanceConfirmed = createSerieByStatusAndYear(
        studies,
        sortedYears,
        "CONFIRMED_RESISTANCE",
        insecticideClass,
        i18next.t("common.dashboard.phenotypicInsecticideResistanceDashboards.confirmed"),
        ResistanceStatusColors.Confirmed[0]
    );

    const resistancePosible = createSerieByStatusAndYear(
        studies,
        sortedYears,
        "POSSIBLE_RESISTANCE",
        insecticideClass,
        i18next.t("common.dashboard.phenotypicInsecticideResistanceDashboards.possible"),
        ResistanceStatusColors.Possible[0]
    );

    const resistanceSusceptible = createSerieByStatusAndYear(
        studies,
        sortedYears,
        "SUSCEPTIBLE",
        insecticideClass,
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
    insecticideClass: string,
    sortedSpecies: string[]
): SpreadOfResistanceOverTimeBySpecieBarChart {
    return sortedSpecies.reduce((acc, specie) => {
        const studiesOfSpecie = studies.filter(study => study.SPECIES === specie);
        const barChartSeriesData = createBarChartSeriesData(studiesOfSpecie, sortedYears, insecticideClass);
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
    insecticideClass: string,
    disaggregateBySpeciesSelectionFilter: DisaggregateBySpeciesOptions
): SpreadOfResistanceOverTimeChartDataByClass {
    const isDisaggregatedBySpecies = disaggregateBySpeciesSelectionFilter === "disaggregate_species";
    const studiesOfInsecticideClass = filteredsStudies.filter(study => study.INSECTICIDE_CLASS === insecticideClass);

    const dataByCountry = selectedCountries.reduce((acc, countryISO) => {
        const filteredStudiesOfCountry = studiesOfInsecticideClass.filter(study => study.ISO2 === countryISO);
        if (insecticideClass && filteredStudiesOfCountry.length) {
            const sortedSpecies = uniq(filteredStudiesOfCountry.map(study => study.SPECIES)).sort();

            return {
                ...acc,
                [countryISO]: isDisaggregatedBySpecies
                    ? createChartDataBySpecies(filteredStudiesOfCountry, sortedYears, insecticideClass, sortedSpecies)
                    : createBarChartSeriesData(filteredStudiesOfCountry, sortedYears, insecticideClass),
            };
        }
        return {
            ...acc,
            [countryISO]: isDisaggregatedBySpecies ? {} : [],
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
