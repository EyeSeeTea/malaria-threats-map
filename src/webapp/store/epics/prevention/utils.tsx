import i18next from "i18next";
import _ from "lodash";
import { PreventionStudy } from "../../../../domain/entities/PreventionStudy";
import { Study } from "../../../../domain/entities/Study";
import { Option } from "../../../components/BasicSelect";
import { getSiteTitle } from "../../../components/site-title/utils";
import { isNotNull, isNull } from "../../../utils/number-utils";
import { ChartData, ChartDataItem, CitationDataSource, Curation, PreventionSelectionData } from "../../types";
import * as R from "ramda";

export function createSelectionData(
    theme: string,
    siteFilteredStudies: PreventionStudy[],
    siteNonFilteredStudies: PreventionStudy[],
    speciesFilter: Option[] = undefined
): PreventionSelectionData {
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
        subtitle: studyObject?.ASSAY_TYPE || "",
        speciesFilterOptions,
        speciesSelection,
        chartData: createChartData(dataSources, siteFilteredStudies, speciesSelection),
        dataSources: dataSources,
        dataCurations: createCurations(dataSources, siteFilteredStudies),
        othersDetected: otherInsecticideClasses(siteFilteredStudies, siteNonFilteredStudies),
    };
}

function createChartData(
    dataSources: CitationDataSource[],
    studies: PreventionStudy[],
    speciesFilter: Option[]
): ChartData {
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

    return bySpeciesAndInsecticideType;
}

function createChartDataItems(dataSources: CitationDataSource[], studies: PreventionStudy[]): ChartDataItem[] {
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

function createCitationDataSources(theme: string, studies: Study[]): CitationDataSource[] {
    const studiesWithURL = studies.filter(study => isNotNull(study.CITATION_URL));
    const studiesWithoutURL = studies.filter(study => isNull(study.CITATION_URL));

    const keys = "abcdefghijklmnopqrstuvwxyz".split("");

    const valueOrUndefined = (value: string) => (isNull(value) ? undefined : value.trim());

    const dataSourcesWithUrl = _.uniqBy(studiesWithURL, study => study.CITATION_URL).map(study => {
        return {
            url: study.CITATION_URL,
            text: `${
                valueOrUndefined(study.CITATION_LONG) ||
                valueOrUndefined(study.CITATION) ||
                valueOrUndefined(study.INSTITUTION) ||
                valueOrUndefined(study.CITATION_URL)
            } ${study.INSTITUTION_CITY ? `, ${study.INSTITUTION_CITY}` : ""}`,
        };
    });

    const getCitation = (study: Study) => (theme === "invasive" ? study.CITATION : study.CITATION_LONG);

    const citations = _.uniq(
        studiesWithoutURL.filter(study => isNotNull(getCitation(study))).map(study => getCitation(study))
    );

    const institutes = _.uniq(
        studiesWithoutURL.filter(study => isNotNull(study.INSTITUTE)).map(study => study.INSTITUTE)
    );

    const institutions = _.uniq(
        studiesWithoutURL.filter(study => isNotNull(study.INSTITUTION)).map(study => study.INSTITUTION)
    );

    const restDataSources = theme !== "treatment" ? (citations.length > 0 ? citations : institutes) : institutions;

    const dataSources = [
        ...dataSourcesWithUrl,
        ...restDataSources.map(label => ({
            text: label,
        })),
    ].map((ds, index) => ({ ...ds, key: keys[index] }));

    return dataSources;
}

function selectDataSourcesByStudies(dataSources: CitationDataSource[], studies: Study[]): string[] {
    return _.uniq(
        studies
            .reduce((acc, study) => {
                const dataSource =
                    dataSources.find(ds => ds.url === study.CITATION_URL) ||
                    dataSources.find(
                        ds =>
                            ds.text === study.CITATION ||
                            ds.text === study.CITATION_LONG ||
                            ds.text === study.INSTITUTE ||
                            ds.text === study.INSTITUTION
                    );

                return dataSource ? [...acc, dataSource.key] : acc;
            }, [])
            .sort()
    );
}

function createCurations(dataSources: CitationDataSource[], studies: Study[]): Curation[] {
    const getCuration = (study: Study) => study.INSTITUTE_CURATION || study.CURATION;

    const curationTexts = _.uniq(
        studies
            .filter(study => isNotNull(getCuration(study)))
            .map(study => {
                return getCuration(study);
            })
    );

    const curations = curationTexts.map(text => {
        const studiesByCuration = studies.filter(study => getCuration(study) === text);

        return {
            text,
            dataSources: selectDataSourcesByStudies(dataSources, studiesByCuration),
        };
    });

    return curations;
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
