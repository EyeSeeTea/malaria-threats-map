import i18next from "i18next";
import _ from "lodash";
import * as R from "ramda";
import { DiagnosisStudy } from "../../../../domain/entities/DiagnosisStudy";
import { getSiteTitle } from "../../../components/site-title/utils";
import { formatList } from "../../../utils/string-utils";
import { CitationDataSource } from "../../SelectionData";
import { DiagnosisFilters, DiagnosisMapType, SiteSelection } from "../../types";
import { createCitationDataSources, createCurations, selectDataSourcesByStudies } from "../common/utils";
import { DiagnosisSelectionData, GeneDeletionsData, HRP23_STUDIES, Hrp23StudiesData } from "./types";
import {
    getHrp23StudiesStatusFromStatusId,
    sortHrp23Studies,
} from "../../../components/layers/diagnosis/Hrp23Studies/utils";

export function createDiagnosisSelectionData(
    theme: string,
    selection: SiteSelection | null,
    diagnosisFilters: DiagnosisFilters,
    filteredStudies: DiagnosisStudy[]
): DiagnosisSelectionData | null {
    if (!selection || filteredStudies.length === 0) return null;

    const siteFilteredStudies = filteredStudies.filter(study => study.SITE_ID === selection.SITE_ID);

    if (siteFilteredStudies.length === 0) return null;

    const sortedStudies = sortStudies(siteFilteredStudies, diagnosisFilters);

    const surveyTypes = _.uniq(sortedStudies.map(study => study.SURVEY_TYPE)).map(type => {
        const dhs = i18next.t("common.diagnosis.chart.gene_deletions.DHS");
        return i18next.t(type).toLowerCase().replace(new RegExp(dhs, "i"), dhs);
    });

    const surveyType = i18next.t("common.diagnosis.chart.gene_deletions.subtitle_2", {
        surveyTypes: formatList(surveyTypes),
    });

    const years = getMinMaxYears(sortedStudies);

    const sampleOrigin =
        sortedStudies[0].SAMPLE_ORIGIN_TEXT != null ? `\n\n${sortedStudies[0].SAMPLE_ORIGIN_TEXT}` : "";

    const subtitle = DiagnosisMapType.HRP23_STUDIES
        ? `${i18next.t("common.diagnosis.chart.hrp23_studies.subtitle")}`
        : `${i18next.t("common.diagnosis.chart.gene_deletions.subtitle_1")} ${
              years.length === 1 ? surveyType : ""
          } (${years.join("-")}) ${sampleOrigin}`;

    const dataSources = createCitationDataSources(theme, sortedStudies);

    return {
        kind: "diagnosis",
        title: sortedStudies.length > 0 ? getSiteTitle(theme, sortedStudies[0]) : "",
        subtitle,
        studyObject: sortedStudies[0],
        data: getDiagnosisDataByMapType(sortedStudies, dataSources, diagnosisFilters),
        dataSources: dataSources,
        curations: createCurations(dataSources, sortedStudies),
    };
}

function sortStudies(siteFilteredStudies: DiagnosisStudy[], diagnosisFilters: DiagnosisFilters) {
    switch (diagnosisFilters.mapType) {
        case DiagnosisMapType.GENE_DELETIONS:
            return _.orderBy(siteFilteredStudies, study => +study.YEAR_START, "asc");
        case DiagnosisMapType.HRP23_STUDIES:
            return sortHrp23Studies(siteFilteredStudies);
    }
}

function getDiagnosisDataByMapType(
    sortedStudies: DiagnosisStudy[],
    dataSources: CitationDataSource[],
    diagnosisFilters: DiagnosisFilters
) {
    switch (diagnosisFilters.mapType) {
        case DiagnosisMapType.GENE_DELETIONS:
            return createGeneDeletionsData(sortedStudies, dataSources);
        case DiagnosisMapType.HRP23_STUDIES:
            return createHrp23StudiesData(sortedStudies);
    }
}

function createGeneDeletionsData(studies: DiagnosisStudy[], dataSources: CitationDataSource[]): GeneDeletionsData {
    const formatPercentage = (value: string) => `${(parseFloat(value) * 100).toFixed(1)}%`;

    const createHeader = (studies: DiagnosisStudy[]) => {
        const surveyTypes = _.uniq(studies.map(study => study.SURVEY_TYPE)).map(type => {
            const dhs = i18next.t("common.diagnosis.chart.gene_deletions.DHS");
            return i18next.t(type).toLowerCase().replace(new RegExp(dhs, "i"), dhs);
        });

        const surveyType = i18next.t("common.diagnosis.chart.gene_deletions.subtitle_2", {
            surveyTypes: formatList(surveyTypes),
        });

        const [yearStart, yearEnd] = getMinMaxYears(studies);

        return `${i18next.t("common.diagnosis.chart.gene_deletions.subtitle_1")}
                           ${surveyType} (${yearStart} - ${yearEnd})`;
    };

    const groupByYear = _(studies)
        .groupBy(({ YEAR_START }) => YEAR_START)
        .mapValues(studies => {
            const studyObject = studies[0];

            return {
                header: createHeader(studies),
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
        kind: "gene-deletions",
        data: _(groupByYear).orderBy(["year"], ["asc"]).value(),
    };
}

function createHrp23StudiesData(studies: DiagnosisStudy[]): Hrp23StudiesData {
    const data = studies.map(study => ({
        [HRP23_STUDIES.STATUS]: {
            label: i18next.t(`common.diagnosis.chart.hrp23_studies.status`),
            value: getHrp23StudiesStatusFromStatusId(study.SURV_STATUS),
        },
        [HRP23_STUDIES.PROPOSED_TIMEFRAME]: {
            label: i18next.t(`common.diagnosis.chart.hrp23_studies.proposed_timeframe`),
            value: `${study.YEAR_START} - ${study.YEAR_END}`,
        },
        [HRP23_STUDIES.STUDY_POPULATION]: {
            label: i18next.t(`common.diagnosis.chart.hrp23_studies.study_population`),
            value: study.SYMP_STAT_NAME,
        },
        [HRP23_STUDIES.STUDY_DESIGN]: {
            label: i18next.t(`common.diagnosis.chart.hrp23_studies.study_design`),
            value: study.PROT_TYPE_NAME,
        },
        [HRP23_STUDIES.GENOTYPING]: {
            label: i18next.t(`common.diagnosis.chart.hrp23_studies.genotyping`),
            value: study.HRP_GENO_NAME,
        },
        [HRP23_STUDIES.STUDY_INITIATED_FOLLOWING]: {
            label: i18next.t(`common.diagnosis.chart.hrp23_studies.study_initiated_following`),
            value: study.PROMPT_NAME,
        },
        [HRP23_STUDIES.STUDY_SITES]: {
            label: i18next.t(`common.diagnosis.chart.hrp23_studies.study_sites`),
            value: study.GEOGR_SCOPE_NAME,
        },
        [HRP23_STUDIES.LEAD_INSTITUTION]: {
            label: i18next.t(`common.diagnosis.chart.hrp23_studies.lead_institution`),
            value: `${study.INSTITUTION}${study.INSTITUTION_CITY ? `, ${study.INSTITUTION_CITY}` : ""}`,
        },
        [HRP23_STUDIES.FUNDING_SOURCE]: {
            label: i18next.t(`common.diagnosis.chart.hrp23_studies.funding_source`),
            value: study.FUNDING_SOURCE,
        },
    }));

    return {
        kind: "hrp23-studies",
        data,
    };
}

function getMinMaxYears(studies: DiagnosisStudy[]): number[] {
    const sortedStudies = R.sortBy(study => study.YEAR_START, studies);
    const minYear = sortedStudies[0].YEAR_START;
    const maxYear = sortedStudies[sortedStudies.length - 1].YEAR_END;

    return _.uniq([+minYear, +maxYear]);
}
