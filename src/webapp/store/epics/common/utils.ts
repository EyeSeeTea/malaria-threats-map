import _ from "lodash";
import { Study } from "../../../../domain/entities/Study";
import { isNotNull, isNull } from "../../../utils/number-utils";
import { CitationDataSource, CurationSources } from "../../SelectionData";

const valueOrUndefined = (value: string) => (isNull(value) ? undefined : value.trim());

const extractDataSourcesWithUrl = (study: Study) => {
    return {
        url: study.CITATION_URL,
        text: `${
            valueOrUndefined(study.CITATION_LONG) ||
            valueOrUndefined(study.CITATION) ||
            valueOrUndefined(study.INSTITUTION) ||
            valueOrUndefined(study.CITATION_URL)
        } ${study.INSTITUTION_CITY ? `, ${study.INSTITUTION_CITY}` : ""}`,
    };
};

const extractDataSourcesTextWithoutUrl = (theme: string, study: Study) => {
    const getCitation = (study: Study) => (theme === "invasive" ? study.CITATION : study.CITATION_LONG);

    if (theme !== "treatment") {
        const citation = getCitation(study);

        return isNotNull(citation) ? citation : study.INSTITUTE;
    } else {
        return study.INSTITUTION;
    }
};

export function createCitationDataSources(theme: string, studies: Study[]): CitationDataSource[] {
    const keys = "abcdefghijklmnopqrstuvwxyz".split("");

    const rawDataSources = _.uniqBy(
        studies
            .map(study => {
                if (isNotNull(study.CITATION_URL)) {
                    return extractDataSourcesWithUrl(study);
                } else {
                    return { url: null, text: extractDataSourcesTextWithoutUrl(theme, study) };
                }
            })
            .filter(dataSource => isNotNull(dataSource.text)),
        item => `${item.text}-${item.url}`
    );

    const dataSources = rawDataSources.map((ds, index) => ({ ...ds, key: keys[index] }));

    return dataSources;
}

export function selectDataSourcesByStudies(dataSources: CitationDataSource[], studies: Study[]): string[] {
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

export function createCurations(dataSources: CitationDataSource[], studies: Study[]): CurationSources[] {
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
