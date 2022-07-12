import i18next from "i18next";
import { PreventionStudy } from "../../../../domain/entities/PreventionStudy";
import { Study } from "../../../../domain/entities/Study";
import { Option } from "../../../components/BasicSelect";
import { getSiteTitle } from "../../../components/site-title/utils";
import { isNotNull } from "../../../utils/number-utils";
import {
    PreventionChartData,
    PreventionChartDataItem,
    CitationDataSource,
    SelectionData,
    SiteSelection,
} from "../../types";
import * as R from "ramda";
import { createCitationDataSources, createCurations, selectDataSourcesByStudies } from "../common/utils";
import _ from "lodash";

export function createPreventionSelectionData(
    theme: string,
    selection: SiteSelection | null,
    filteredStudies: PreventionStudy[],
    nonFilteredStudies: PreventionStudy[],
    speciesFilter: Option[] = undefined
): SelectionData | null {
    if (!selection) return null;

    const siteFilteredStudies = filteredStudies.filter(study => study.SITE_ID === selection.SITE_ID);

    const siteNonFilteredStudies = nonFilteredStudies.filter(study => study.SITE_ID === selection.SITE_ID);

    const dataSources = createCitationDataSources(theme, siteFilteredStudies);

    const speciesOptions = R.uniq(R.map(s => s.SPECIES, siteFilteredStudies));
    const speciesFilterOptions: Option[] = speciesOptions.map((specie: string) => ({
        label: specie,
        value: specie,
    }));

    const speciesSelection = speciesFilter || speciesFilterOptions;

    const studyObject = siteFilteredStudies[0];

    return {
        title: siteFilteredStudies.length > 0 ? getSiteTitle(theme, siteFilteredStudies[0]) : "",
        subtitle: i18next.t(studyObject?.ASSAY_TYPE),
        filterOptions: speciesFilterOptions,
        filterSelection: speciesSelection,
        studyObject,
        data: createChartData(dataSources, siteFilteredStudies, speciesSelection),
        dataSources: dataSources,
        curations: createCurations(dataSources, siteFilteredStudies),
        othersDetected: otherInsecticideClasses(siteFilteredStudies, siteNonFilteredStudies),
    };
}

function createChartData(
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
                .mapValues(studies => createChartDataItems(dataSources, studies))
                .value();
        })
        .value();

    return { kind: "prevention", data: bySpeciesAndInsecticideType };
}

function createChartDataItems(
    dataSources: CitationDataSource[],
    studies: PreventionStudy[]
): PreventionChartDataItem[] {
    const getStudyKey = (study: Study) => `${study.YEAR_START}, ${study.INSECTICIDE_TYPE} ${study.INSECTICIDE_CONC}`;

    const sortedStudies = R.sortBy(study => parseInt(study.YEAR_START), studies);
    const cleanedStudies = R.groupBy((study: PreventionStudy) => {
        return getStudyKey(study);
    }, sortedStudies);

    const simplifiedStudies = R.sortWith(
        [R.descend(R.prop("YEAR_START")), R.ascend(R.prop("INSECTICIDE_TYPE"))],
        R.values(cleanedStudies).map(
            (groupStudies: PreventionStudy[]) =>
                R.sortBy(study => parseFloat(study.MORTALITY_ADJUSTED), groupStudies)[0]
        )
    );

    const data = simplifiedStudies.map(study => {
        const studiesByGroup = cleanedStudies[getStudyKey(study)];

        const dataSourceKeys = selectDataSourcesByStudies(dataSources, studiesByGroup);

        return {
            name: `${study.YEAR_START}, ${i18next.t(study.INSECTICIDE_TYPE)} ${i18next.t(
                study.INSECTICIDE_CONC
            )} (${dataSourceKeys.join(", ")}) `,
            y: Math.round(parseFloat(study.MORTALITY_ADJUSTED) * 100),
            number: study.NUMBER,
        };
    });

    return data;
}

function otherInsecticideClasses(siteFilteredStudies: Study[], siteNonFilteredStudies: Study[]) {
    const currentInsecticideClasses = _.uniq(siteFilteredStudies.map(study => study.INSECTICIDE_CLASS));
    const otherInsecticideClasses = _.uniq(
        siteNonFilteredStudies
            .filter(
                study =>
                    !currentInsecticideClasses.includes(study.INSECTICIDE_CLASS) && isNotNull(study.INSECTICIDE_CLASS)
            )
            .map(study => study.INSECTICIDE_CLASS)
    );

    return otherInsecticideClasses;
}
