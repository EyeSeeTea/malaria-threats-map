import _ from "lodash";
import { Study } from "../../../../domain/entities/Study";
import { isNotNull, isNull } from "../../../utils/number-utils";
import { CitationDataSource, CurationSources } from "../../SelectionData";

export function createCitationDataSources(theme: string, studies: Study[]): CitationDataSource[] {
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
