import i18next from "i18next";
import { InvasiveStudy } from "../../../../domain/entities/InvasiveStudy";
import { getSiteTitle } from "../../../components/site-title/utils";
import { createCitationDataSources, createCurations } from "../common/utils";
import * as R from "ramda";
import { isNotNull, isNR } from "../../../utils/number-utils";
import { SiteSelection } from "../../types";
import { isNull } from "lodash";
import { InvasiveChartDataContent, InvasiveSelectionData } from "./types";

export function createInvasiveSelectionData(
    theme: string,
    selection: SiteSelection | null,
    filteredStudies: InvasiveStudy[]
): InvasiveSelectionData | null {
    if (!selection) return null;

    const siteFilteredStudies = filteredStudies.filter(study => study.SITE_ID === selection.SITE_ID);

    if (siteFilteredStudies.length === 0) return null;

    const dataSources = createCitationDataSources(theme, siteFilteredStudies);

    return {
        kind: "invasive",
        title: siteFilteredStudies.length > 0 ? getSiteTitle(theme, siteFilteredStudies[0]) : "",
        data: getData(siteFilteredStudies),
        dataSources: dataSources,
        curations: createCurations(dataSources, siteFilteredStudies),
    };
}

function getData(studies: InvasiveStudy[]): InvasiveChartDataContent {
    const sortedStudies = R.sortBy(study => -parseInt(study.YEAR_START), studies);

    const studyObject = sortedStudies[0];

    const cleanValue = (value: string) =>
        isNR(value) || isNull(value) ? i18next.t("common.invasive.chart.vector_occurrance.not_recorded") : value;

    return {
        species: getSpecies(studyObject),
        samplingPeriod: cleanValue(getSamplingPeriod(studyObject)),
        samplingMethod: cleanValue(studyObject.SAMPLING_METHOD),
        speciedIdentificationMethod: cleanValue(studyObject.ID_METHOD),
        vectorStage: cleanValue(studyObject.STAGE),
    };
}

function getSpecies(study: InvasiveStudy): string {
    return isNotNull(study.VECTOR_SPECIES)
        ? study.VECTOR_SPECIES
        : isNotNull(study.VECTOR_SPECIES_COMPLEX)
        ? study.VECTOR_SPECIES_COMPLEX
        : "";
}

function getSamplingPeriod(study: InvasiveStudy): string {
    const translations = [
        i18next.t("utils.Jan."),
        i18next.t("utils.Feb."),
        i18next.t("utils.Mar."),
        i18next.t("utils.Apr."),
        i18next.t("utils.May"),
        i18next.t("utils.June"),
        i18next.t("utils.July"),
        i18next.t("utils.Aug."),
        i18next.t("utils.Sept."),
        i18next.t("utils.Oct."),
        i18next.t("utils.Nov."),
        i18next.t("utils.Dec."),
    ];
    const getMonthFromNumber = (month: number) => translations[month - 1];

    const monthStart = getMonthFromNumber(parseInt(study.MONTH_START));
    const monthEnd = getMonthFromNumber(parseInt(study.MONTH_END));
    const yearStart = parseInt(study.YEAR_START);
    const yearEnd = parseInt(study.YEAR_END);

    const start = monthStart ? `${monthStart}, ${yearStart}` : `${yearStart}`;
    const end = monthEnd ? `${monthEnd}, ${yearEnd}` : `${yearEnd}`;

    const unique = yearStart === yearEnd && monthStart === monthEnd;
    const partial = (() => {
        if (!Number.isNaN(yearStart) && !Number.isNaN(yearEnd)) {
            return `${start} to ${end}`;
        } else if (!Number.isNaN(yearStart) && Number.isNaN(yearEnd)) {
            return start;
        } else if (Number.isNaN(yearStart) && !Number.isNaN(yearEnd)) {
            return end;
        }
    })();

    return (unique ? start : partial) || "";
}
