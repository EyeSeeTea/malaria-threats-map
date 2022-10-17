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
} from "../../SelectionData";
import * as R from "ramda";
import { createCitationDataSources, createCurations, selectDataSourcesByStudies } from "../common/utils";
import _ from "lodash";
import { ResistanceMechanismColors } from "../../../components/layers/prevention/ResistanceMechanisms/symbols";
import { RESISTANCE_MECHANISM } from "../../../components/layers/prevention/ResistanceMechanisms/utils";
import { PreventionMapType, SiteSelection } from "../../types";

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

    const siteNonFilteredStudies = nonFilteredStudies.filter(study => study.SITE_ID === selection.SITE_ID);

    const sortedStudies = _.orderBy(siteFilteredStudies, study => +study.YEAR_START, "desc");

    const dataSources = createCitationDataSources(theme, sortedStudies);

    const speciesOptions = R.uniq(R.map(s => s.SPECIES, sortedStudies));
    const speciesFilterOptions: Option[] = speciesOptions.map((specie: string) => ({
        label: specie,
        value: specie,
    }));

    const speciesSelection = speciesFilter || speciesFilterOptions;

    const studyObject = sortedStudies[0];

    return {
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

    const bySpeciesAndInsecticideType = _(studiesFiltered)
        .groupBy(({ SPECIES }) => SPECIES)
        .mapValues(studies => {
            return _(studies)
                .groupBy(({ TYPE }) => TYPE)
                .mapValues(studies => createChartDataItems(mapType, dataSources, studies))
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
                    const sortedStudies = R.sortBy(study => -parseInt(study.YEAR_START), studies);
                    const minYear = parseInt(sortedStudies[sortedStudies.length - 1].YEAR_START);
                    const maxYear = parseInt(sortedStudies[0].YEAR_START);
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
        const yearStudies = studies.filter(study => parseInt(study.YEAR_START) === year);

        const dataSourceKeys = selectDataSourcesByStudies(dataSources, yearStudies);

        return { year, name: `${year.toString()} (${dataSourceKeys.join(", ")}) ` };
    });

    const detected = yearsObjects.map(yearObject => {
        const yearStudies = studies.filter(study => parseInt(study.YEAR_START) === yearObject.year);
        const d = yearStudies.filter(study => study.MECHANISM_STATUS === "DETECTED");

        return {
            name: yearObject.name,
            y: -d.length,
        };
    });
    const notDetected = yearsObjects.map(yearObject => {
        const yearStudies = studies.filter(study => parseInt(study.YEAR_START) === yearObject.year);
        const nD = yearStudies.filter(study => study.MECHANISM_STATUS !== "DETECTED");

        return {
            name: yearObject.name,
            y: nD.length,
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
                const study = studies.filter(study => year === parseInt(study.YEAR_START))[0];

                const y = parseFloat(study?.MECHANISM_FREQUENCY);

                return {
                    name: `${year}`,
                    y: study && !isNA(study.MECHANISM_FREQUENCY) && !isNR(study.MECHANISM_FREQUENCY) ? y : 0,
                    value: !study
                        ? i18next.t("common.prevention.chart.resistance_mechanism.not_reported")
                        : isNA(study.MECHANISM_FREQUENCY)
                        ? "N/A"
                        : isNR(study.MECHANISM_FREQUENCY)
                        ? i18next.t("common.prevention.chart.resistance_mechanism.not_reported")
                        : `${y}%`,
                };
            }),
        },
    ];
}

function getStudyName(mapType: PreventionMapType, study: Study): string {
    switch (mapType) {
        case PreventionMapType.RESISTANCE_STATUS:
            return `${study.YEAR_START}, ${i18next.t(study.INSECTICIDE_TYPE)} ${i18next.t(study.INSECTICIDE_CONC)}`;
        case PreventionMapType.INTENSITY_STATUS:
            return `${study.YEAR_START}, ${i18next.t(study.INSECTICIDE_INTENSITY)} ${i18next.t(
                study.INSECTICIDE_TYPE
            )}`;
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

function createChartDataItems(
    mapType: PreventionMapType,
    dataSources: CitationDataSource[],
    studies: PreventionStudy[]
): PreventionChartDataItem[] {
    const sortedStudies = R.sortBy(study => parseInt(study.YEAR_START), studies);
    const cleanedStudies = R.groupBy((study: PreventionStudy) => {
        return getStudyName(mapType, study);
    }, sortedStudies);

    const simplifiedStudies = R.sortWith(
        [R.descend(R.prop("YEAR_START")), R.ascend(R.prop("INSECTICIDE_TYPE"))],
        R.values(cleanedStudies).map(
            (groupStudies: PreventionStudy[]) =>
                R.sortBy(study => parseFloat(study.MORTALITY_ADJUSTED), groupStudies)[0]
        )
    );

    const data = simplifiedStudies.map(study => {
        const studiesByGroup = cleanedStudies[getStudyName(mapType, study)];

        const dataSourceKeys = selectDataSourcesByStudies(dataSources, studiesByGroup);

        return {
            name: `${getStudyName(mapType, study)} (${dataSourceKeys.join(", ")}) `,
            y: Math.round(parseFloat(study.MORTALITY_ADJUSTED) * 100),
            number: study.NUMBER,
        };
    });

    return data;
}

function otherDetected(mapType: PreventionMapType, siteFilteredStudies: Study[], siteNonFilteredStudies: Study[]) {
    if (mapType === PreventionMapType.LEVEL_OF_INVOLVEMENT) {
        return [];
    } else if (mapType === PreventionMapType.RESISTANCE_MECHANISM) {
        const currentMechanisms = _.uniq(siteFilteredStudies.map(study => study.TYPE));
        const othertMechanisms = _.uniq(
            siteNonFilteredStudies
                .filter(study => !currentMechanisms.includes(study.TYPE) && isNotNull(study.TYPE))
                .map(study => study.TYPE)
        );

        return othertMechanisms;
    } else {
        const currentInsecticideClasses = _.uniq(siteFilteredStudies.map(study => study.INSECTICIDE_CLASS));
        const otherInsecticideClasses = _.uniq(
            siteNonFilteredStudies
                .filter(
                    study =>
                        !currentInsecticideClasses.includes(study.INSECTICIDE_CLASS) &&
                        isNotNull(study.INSECTICIDE_CLASS)
                )
                .map(study => study.INSECTICIDE_CLASS)
        );

        return otherInsecticideClasses;
    }
}
