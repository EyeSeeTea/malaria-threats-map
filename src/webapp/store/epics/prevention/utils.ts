import i18next from "i18next";
import { PreventionStudy } from "../../../../domain/entities/PreventionStudy";
import { Study } from "../../../../domain/entities/Study";
import { Option } from "../../../components/BasicSelect";
import { getSiteTitle } from "../../../components/site-title/utils";
import { isNA, isNotNull, isNR } from "../../../utils/number-utils";
import {
    PreventionChartData,
    PreventionChartDataItem,
    CitationDataSource,
    SelectionData,
    PreventionMechanismChartData,
    PreventionMechanismChartDataGroup,
    preventionChartDataTitle,
} from "../../SelectionData";
import * as R from "ramda";
import { createCitationDataSources, createCurations, selectDataSourcesByStudies } from "../common/utils";
import _ from "lodash";
import { ResistanceMechanismColors } from "../../../components/layers/prevention/ResistanceMechanisms/symbols";
import { RESISTANCE_MECHANISM } from "../../../components/layers/prevention/ResistanceMechanisms/utils";
import { PreventionMapType, SiteSelection } from "../../types";
import {
    filterByIntensityStatus,
    filterByLevelOfInvolvement,
    filterByResistanceMechanism,
    filterByResistanceStatus,
} from "../../../components/layers/studies-filters";
import { cleanMechanismTypeOptions } from "../../../components/filters/MechanismTypeFilter";
import { getMostPriorityUsignResistanceStatus } from "../../../components/layers/prevention/utils";
import { ResistanceStatusColors } from "../../../components/layers/prevention/ResistanceStatus/symbols";

type SortDirection = boolean | "asc" | "desc";

export function createPreventionSelectionData(
    theme: string,
    mapType: PreventionMapType,
    selection: SiteSelection | null,
    filteredStudies: PreventionStudy[],
    nonFilteredStudies: PreventionStudy[],
    speciesFilter: Option[] = undefined
): SelectionData | null {
    if (!selection) return null;

    const siteFilteredStudies = filteredStudies.filter(study => study.SITE_ID === selection.SITE_ID);

    if (siteFilteredStudies.length === 0) return null;

    const siteNonFilteredStudies = nonFilteredStudies
        .filter(study => study.SITE_ID === selection.SITE_ID)
        .filter(buildMapTypeFilter(mapType));

    const sortedStudies = _.orderBy(siteFilteredStudies, study => +study.YEAR_START, "desc");

    const dataSources = createCitationDataSources(theme, sortedStudies);

    const speciesOptions = R.uniq(R.map(s => s.SPECIES, sortedStudies)).sort();

    const speciesFilterOptions: Option[] = speciesOptions.map((specie: string) => ({
        label: specie,
        value: specie,
    }));

    const speciesSelection = speciesFilter || speciesFilterOptions;

    const studyObject = sortedStudies[0];

    return {
        kind: "common",
        title: sortedStudies.length > 0 ? getSiteTitle(theme, sortedStudies[0]) : "",
        subtitle: i18next.t(studyObject?.ASSAY_TYPE),
        filterOptions: speciesFilterOptions,
        filterSelection: speciesSelection,
        studyObject,
        data:
            mapType === PreventionMapType.RESISTANCE_MECHANISM
                ? createPreventionMechanismChartData(dataSources, sortedStudies, speciesSelection)
                : createPreventionChartData(mapType, dataSources, sortedStudies, speciesSelection),
        dataSources: dataSources,
        curations: createCurations(dataSources, sortedStudies),
        othersTitle: getOtherTitle(mapType),
        othersDetected: otherDetected(mapType, sortedStudies, siteNonFilteredStudies),
    };
}

function createPreventionChartData(
    mapType: PreventionMapType,
    dataSources: CitationDataSource[],
    studies: PreventionStudy[],
    speciesFilter: Option[]
): PreventionChartData {
    const studiesFiltered = studies.filter(
        study => !speciesFilter || !speciesFilter.length || speciesFilter.map(s => s.value).includes(study.SPECIES)
    );

    //const mostRecentStudy = getByMostRecentYearAndInvolvement(studies);

    const title: preventionChartDataTitle = undefined;
    /*mapType === PreventionMapType.LEVEL_OF_INVOLVEMENT
            ? {
                  statusColor:
                      mostRecentStudy.MECHANISM_PROXY === LEVEL_OF_INVOLVEMENT.FULL_INVOLVEMENT
                          ? LevelOfInvolvementColors[LEVEL_OF_INVOLVEMENT.FULL_INVOLVEMENT][1]
                          : mostRecentStudy.MECHANISM_PROXY === LEVEL_OF_INVOLVEMENT.PARTIAL_INVOLVEMENT
                          ? LevelOfInvolvementColors[LEVEL_OF_INVOLVEMENT.PARTIAL_INVOLVEMENT][1]
                          : LevelOfInvolvementColors[LEVEL_OF_INVOLVEMENT.NO_INVOLVEMENT][1],
                  titlePrefix:
                      mostRecentStudy.MECHANISM_PROXY === LEVEL_OF_INVOLVEMENT.FULL_INVOLVEMENT
                          ? "PBO fully"
                          : mostRecentStudy.MECHANISM_PROXY === LEVEL_OF_INVOLVEMENT.PARTIAL_INVOLVEMENT
                          ? "PBO partially"
                          : "PBO no",
                  titleContent: "restores susceptibility to",
                  titleSufix: "Pyrethroids",
              }
            : undefined;*/

    const bySpeciesAndInsecticideType = _(studiesFiltered)
        .sortBy(({ SPECIES }) => SPECIES)
        .groupBy(({ SPECIES }) => SPECIES)
        .mapValues(studies => {
            return _(studies)
                .groupBy(({ TYPE }) => TYPE)
                .mapValues(studies => ({ title, seriesData: createChartDataItems(mapType, dataSources, studies) }))
                .value();
        })
        .value();

    return { kind: "prevention", data: bySpeciesAndInsecticideType };
}

function createPreventionMechanismChartData(
    dataSources: CitationDataSource[],
    studies: PreventionStudy[],
    speciesFilter: Option[]
): PreventionMechanismChartData {
    const studiesFiltered = studies.filter(
        study => !speciesFilter || !speciesFilter.length || speciesFilter.map(s => s.value).includes(study.SPECIES)
    );

    const bySpeciesAndInsecticideType = _(studiesFiltered)
        .groupBy(({ SPECIES }) => SPECIES)
        .mapValues(studies => {
            return _(studies)
                .groupBy(({ TYPE }) => TYPE)
                .mapValues(studies => {
                    const sortedStudies = R.sortBy(study => -study.YEAR_START, studies);
                    const minYear = sortedStudies[sortedStudies.length - 1].YEAR_START;
                    const maxYear = sortedStudies[0].YEAR_START;
                    const years: number[] = [];
                    for (let i = minYear; i <= maxYear; i++) {
                        years.push(i);
                    }

                    return {
                        years,
                        assays: createPreventionMechanismAssays(years, studies, dataSources),
                        allelics: createPreventionMechanismAllelics(years, studies, dataSources),
                    };
                })
                .value();
        })
        .value();

    return { kind: "prevention-mechanism", data: bySpeciesAndInsecticideType };
}

function createPreventionMechanismAssays(
    years: number[],
    studies: PreventionStudy[],
    dataSources: CitationDataSource[]
): PreventionMechanismChartDataGroup[] {
    const yearsObjects = years.map(year => {
        const yearStudies = studies.filter(study => study.YEAR_START === year);

        const dataSourceKeys = selectDataSourcesByStudies(dataSources, yearStudies);
        const formatName = (dataSourceKeys: string[]) => {
            const dataSources = !_(dataSourceKeys).isEmpty() ? `(${dataSourceKeys.join(", ")})` : "";

            return `${year.toString()} ${dataSources} `;
        };

        return { year: year, name: formatName(dataSourceKeys) };
    });

    const detected = yearsObjects.map(yearObject => {
        const yearStudies = studies.filter(study => study.YEAR_START === yearObject.year);
        const d = yearStudies.filter(study => study.MECHANISM_STATUS === "DETECTED");

        return {
            name: yearObject.name,
            y: d.length === 0 ? -0.1 : -d.length,
            yName: d.length.toString(),
        };
    });
    const notDetected = yearsObjects.map(yearObject => {
        const yearStudies = studies.filter(study => study.YEAR_START === yearObject.year);
        const nD = yearStudies.filter(study => study.MECHANISM_STATUS !== "DETECTED");

        return {
            name: yearObject.name,
            y: nD.length,
            yName: nD.length.toString(),
        };
    });
    return [
        {
            maxPointWidth: 20,
            name: i18next.t("common.prevention.chart.resistance_mechanism.DETECTED"),
            color: ResistanceMechanismColors[RESISTANCE_MECHANISM.CONFIRMED][0],
            data: detected,
        },
        {
            maxPointWidth: 20,
            name: i18next.t("common.prevention.chart.resistance_mechanism.NOT_DETECTED"),
            color: ResistanceMechanismColors[RESISTANCE_MECHANISM.NOT_CONFIRMED][0],
            data: notDetected,
        },
    ];
}

function createPreventionMechanismAllelics(
    years: number[],
    studies: PreventionStudy[],
    _dataSources: CitationDataSource[]
): PreventionMechanismChartDataGroup[] {
    return [
        {
            maxPointWidth: 20,
            name: studies[0].SPECIES,
            color: "#2D9BF0",
            data: years.map(year => {
                const study = studies.filter(study => year === study.YEAR_START)[0];

                const y =
                    study && !isNA(study.MECHANISM_FREQUENCY) && !isNR(study.MECHANISM_FREQUENCY)
                        ? parseFloat(study?.MECHANISM_FREQUENCY)
                        : 0;

                return {
                    name: `${year}`,
                    y,
                    yName: y.toString(),
                    value: !study
                        ? i18next.t("common.prevention.chart.resistance_mechanism.not_reported")
                        : isNA(study.MECHANISM_FREQUENCY) || study.MECHANISM_FREQUENCY === null
                        ? "N/A"
                        : isNR(study.MECHANISM_FREQUENCY)
                        ? i18next.t("common.prevention.chart.resistance_mechanism.not_reported")
                        : `${y}%`,
                };
            }),
        },
    ];
}

function getStudyName(mapType: PreventionMapType, study: PreventionStudy): string {
    switch (mapType) {
        case PreventionMapType.RESISTANCE_STATUS:
            return `${study.YEAR_START}, ${i18next.t(study.INSECTICIDE_TYPE)} ${i18next.t(study.INSECTICIDE_CONC)}`;
        case PreventionMapType.INTENSITY_STATUS:
            return `${study.YEAR_START}, ${study.INSECTICIDE_INTENSITY}x ${i18next.t(study.INSECTICIDE_TYPE)}`;
        case PreventionMapType.LEVEL_OF_INVOLVEMENT: {
            const base = `${study.YEAR_START}, ${i18next.t(study.INSECTICIDE_TYPE)} ${i18next.t(
                study.INSECTICIDE_CONC
            )}`;
            const syn =
                study.SYNERGIST_TYPE === "NO"
                    ? i18next.t("common.prevention.chart.synergist_involvement.no_synergist")
                    : `${i18next.t(study.SYNERGIST_TYPE)} ${i18next.t(study.SYNERGIST_CONC)}`;
            return `${base}, ${syn}`;
        }
    }
}

function getColor(mapType: PreventionMapType, study: Study): string {
    const resistanceColors: Record<string, string> = {
        CONFIRMED_RESISTANCE: ResistanceStatusColors.Confirmed[0],
        UNDETERMINED: ResistanceStatusColors.Undetermined[0],
        POSSIBLE_RESISTANCE: ResistanceStatusColors.Possible[0],
        SUSCEPTIBLE: ResistanceStatusColors.Susceptible[0],
    };

    const mortalityAdjusted = getMorlatityAdjusted(study);

    switch (mapType) {
        case PreventionMapType.RESISTANCE_STATUS:
            return resistanceColors[study.RESISTANCE_STATUS];
        case PreventionMapType.INTENSITY_STATUS:
            return mortalityAdjusted < 100 ? "#D0CECE" : "#717171";
        case PreventionMapType.LEVEL_OF_INVOLVEMENT:
            return mortalityAdjusted < 90 ? "#D0CECE" : "#717171";
        default:
            return undefined;
    }
}

function getMorlatityAdjusted(study: Study): number {
    return +(parseFloat(study.MORTALITY_ADJUSTED) * 100).toFixed(1);
}

function createChartDataItems(
    mapType: PreventionMapType,
    dataSources: CitationDataSource[],
    studies: PreventionStudy[]
): PreventionChartDataItem[] {
    const sortedStudies = R.sortBy(study => study.YEAR_START, studies);
    const cleanedStudies = R.groupBy((study: PreventionStudy) => {
        return getStudyName(mapType, study);
    }, sortedStudies);

    const firstStudiesOfGroups = Object.values(cleanedStudies).map((groupStudies: PreventionStudy[]) =>
        getMostPriorityUsignResistanceStatus(groupStudies)
    );

    const orders: [string | ((study: PreventionStudy) => unknown), SortDirection][] = _.compact([
        ["YEAR_START", "desc"],
        ["INSECTICIDE_TYPE", "asc"],
        mapType === PreventionMapType.LEVEL_OF_INVOLVEMENT ? ["SYNERGIST_TYPE", "asc"] : undefined,
        mapType === PreventionMapType.INTENSITY_STATUS
            ? [(study: PreventionStudy) => +study.INSECTICIDE_INTENSITY, "asc"]
            : undefined,
    ]);

    const orderFields: _.Many<_.ListIteratee<PreventionStudy>> = orders.map(order => order[0]);
    const orderDirections = orders.map(order => order[1]);

    const simplifiedStudies = _.orderBy(firstStudiesOfGroups, orderFields, orderDirections);

    const data = _(simplifiedStudies)
        .map(study => {
            const studiesByGroup = cleanedStudies[getStudyName(mapType, study)];

            const dataSourceKeys = selectDataSourcesByStudies(dataSources, studiesByGroup);

            return {
                name: `${getStudyName(mapType, study)} (${dataSourceKeys.join(", ")}) `,
                y: getMorlatityAdjusted(study),
                number: study.NUMBER,
                resistanceStatus: study.RESISTANCE_STATUS,
                color: getColor(mapType, study),
            };
        })
        .sortBy(study => -study.y)
        .value();

    return data;
}

function otherDetected(mapType: PreventionMapType, siteFilteredStudies: Study[], siteNonFilteredStudies: Study[]) {
    if (mapType === PreventionMapType.LEVEL_OF_INVOLVEMENT) {
        return [];
    } else if (mapType === PreventionMapType.RESISTANCE_MECHANISM) {
        const currentMechanisms = _.uniq(siteFilteredStudies.map(study => study.TYPE));
        const othertMechanisms = _.uniq(
            siteNonFilteredStudies
                .filter(
                    study =>
                        !currentMechanisms.includes(study.TYPE) &&
                        isNotNull(study.TYPE) &&
                        study.MECHANISM_STATUS === "DETECTED"
                )
                .map(study => study.TYPE)
        );

        return cleanMechanismTypeOptions(othertMechanisms).map(type => i18next.t(`TYPE.${type}`));
    } else {
        const currentInsecticideClasses = _.uniq(siteFilteredStudies.map(study => study.INSECTICIDE_CLASS));
        const otherInsecticideClasses = _.uniq(
            siteNonFilteredStudies
                .filter(
                    study =>
                        !currentInsecticideClasses.includes(study.INSECTICIDE_CLASS) &&
                        isNotNull(study.INSECTICIDE_CLASS) &&
                        study.RESISTANCE_STATUS === "CONFIRMED_RESISTANCE"
                )
                .map(study => i18next.t(study.INSECTICIDE_CLASS))
        );

        return otherInsecticideClasses;
    }
}

function getOtherTitle(mapType: PreventionMapType) {
    if (mapType === PreventionMapType.LEVEL_OF_INVOLVEMENT) {
        return "";
    } else if (mapType === PreventionMapType.RESISTANCE_MECHANISM) {
        return i18next.t("common.prevention.chart.other_mechanisms");
    } else {
        return i18next.t("common.prevention.chart.other_insecticide_class_label");
    }
}

function buildMapTypeFilter(mapType: PreventionMapType) {
    switch (mapType) {
        case PreventionMapType.RESISTANCE_STATUS:
            return filterByResistanceStatus;
        case PreventionMapType.INTENSITY_STATUS:
            return filterByIntensityStatus;
        case PreventionMapType.RESISTANCE_MECHANISM:
            return filterByResistanceMechanism;
        case PreventionMapType.LEVEL_OF_INVOLVEMENT:
            return filterByLevelOfInvolvement;
    }
}
