import i18next from "i18next";
import _ from "lodash";
import * as R from "ramda";
import { DiagnosisStudy } from "../../../../domain/entities/DiagnosisStudy";
import { getSiteTitle } from "../../../components/site-title/utils";
import { formatList } from "../../../utils/string-utils";
import { CitationDataSource, DiagnosisChartData, SelectionData } from "../../SelectionData";
import { SiteSelection } from "../../types";
import { createCitationDataSources, createCurations, selectDataSourcesByStudies } from "../common/utils";

export function createDiagnosisSelectionData(
    theme: string,
    selection: SiteSelection | null,
    filteredStudies: DiagnosisStudy[]
): SelectionData | null {
    if (!selection) return null;

    //TODO:Remove
    // const test = filteredStudies.filter(study => study.SITE_ID === selection.SITE_ID);
    // const siteFilteredStudies = [
    //     ...test,
    //     { ...test[0], YEAR_START: test[0].YEAR_START + 1, YEAR_END: test[0].YEAR_END + 1 },
    // ];
    const siteFilteredStudies = filteredStudies.filter(study => study.SITE_ID === selection.SITE_ID);

    const surveyTypes = _.uniq(siteFilteredStudies.map(study => study.SURVEY_TYPE)).map(type => {
        const dhs = i18next.t("common.diagnosis.chart.gene_deletions.DHS");
        return i18next.t(type).toLowerCase().replace(new RegExp(dhs, "i"), dhs);
    });

    const surveyType = i18next.t("common.diagnosis.chart.gene_deletions.subtitle_2", {
        surveyTypes: formatList(surveyTypes),
    });

    const years = getMinMaxYears(siteFilteredStudies);

    const subtitle = `${i18next.t("common.diagnosis.chart.gene_deletions.subtitle_1")}
                       ${years.length === 1 ? surveyType : ""} (${years.join("-")})`;

    const dataSources = createCitationDataSources(theme, siteFilteredStudies);

    return {
        title: siteFilteredStudies.length > 0 ? getSiteTitle(theme, siteFilteredStudies[0]) : "",
        subtitle,
        studyObject: siteFilteredStudies[0],
        data: getData(siteFilteredStudies, dataSources),
        dataSources: dataSources,
        curations: createCurations(dataSources, siteFilteredStudies),
        othersDetected: [],
    };
}

function getData(studies: DiagnosisStudy[], dataSources: CitationDataSource[]): DiagnosisChartData {
    const years = getMinMaxYears(studies);

    const formatPercentage = (value: string) => `${(parseFloat(value) * 100).toFixed(1)}%`;

    const createHeader = (studies: DiagnosisStudy[]) => {
        const surveyTypes = _.uniq(studies.map(study => study.SURVEY_TYPE)).map(type => {
            const dhs = i18next.t("common.diagnosis.chart.gene_deletions.DHS");
            return i18next.t(type).toLowerCase().replace(new RegExp(dhs, "i"), dhs);
        });

        const surveyType = i18next.t("common.diagnosis.chart.gene_deletions.subtitle_2", {
            surveyTypes: formatList(surveyTypes),
        });

        return `${i18next.t("common.diagnosis.chart.gene_deletions.subtitle_1")}
                           ${surveyType} (${studies[0].YEAR_START})`;
    };

    const groupByYear = _(studies)
        .groupBy(({ YEAR_START }) => YEAR_START)
        .mapValues(studies => {
            const studyObject = studies[0];

            return {
                header: years.length === 1 ? undefined : createHeader(studies),
                dataSources: `(${selectDataSourcesByStudies(dataSources, studies)})`,
                year: +studies[0].YEAR_START,
                items: [
                    {
                        type: "HRP2",
                        samples: studyObject.HRP2_TESTED || "N/A",
                        percentageConfirmed: !Number.isNaN(parseFloat(studyObject.HRP2_PROPORTION_DELETION))
                            ? formatPercentage(studyObject.HRP2_PROPORTION_DELETION)
                            : "N/A",
                    },
                    {
                        type: "HRP3",
                        samples: studyObject.HRP3_TESTED || "N/A",
                        percentageConfirmed: !Number.isNaN(parseFloat(studyObject.HRP3_PROPORTION_DELETION))
                            ? formatPercentage(studyObject.HRP3_PROPORTION_DELETION)
                            : "N/A",
                    },
                    {
                        type: "HRP2 & 3",
                        samples: studyObject.HRP2_HRP3_TESTED || "N/A",
                        percentageConfirmed: !Number.isNaN(parseFloat(studyObject.HRP2_HRP3_PROPORTION_DELETION))
                            ? formatPercentage(studyObject.HRP2_HRP3_PROPORTION_DELETION)
                            : "N/A",
                    },
                ],
            };
        })
        .values()
        .value();

    return {
        kind: "diagnosis",
        data: _(groupByYear).orderBy(["year"], ["desc"]).value(),
    };
}

function getMinMaxYears(studies: DiagnosisStudy[]): number[] {
    const sortedStudies = R.sortBy(study => parseInt(study.YEAR_START), studies);
    const minYear = sortedStudies[0].YEAR_START;
    const maxYear = sortedStudies[sortedStudies.length - 1].YEAR_END;

    return _.uniq([+minYear, +maxYear]);
}
