import i18next from "i18next";
import { InvasiveStudy } from "../../../../domain/entities/InvasiveStudy";
import { getSiteTitle } from "../../../components/site-title/utils";
import { createCitationDataSources, createCurations } from "../common/utils";
import * as R from "ramda";
import { isNotNull, isNR } from "../../../utils/number-utils";
import { SiteSelection } from "../../types";
import { isNull } from "lodash";
import { InvasiveChartDataContent, InvasiveSelectionData } from "./types";
import { InvasiveStatusOrder } from "../../../components/layers/invasive/utils";

export function createInvasiveSelectionData(
    theme: string,
    selection: SiteSelection | null,
    filteredStudies: InvasiveStudy[]
): InvasiveSelectionData | null {
    if (!selection) return null;

    const siteFilteredStudies = filteredStudies.filter(study => study.SITE_ID === selection.SITE_ID);

    if (siteFilteredStudies.length === 0) return null;

    const dataSources = createCitationDataSources(theme, siteFilteredStudies);

    const sortedStudiesByRecentYear = R.sortBy(study => -study.YEAR_START, siteFilteredStudies);
    const sortedStudiesByRecentYearAndInvasiveStatus = R.sortBy(
        study => -InvasiveStatusOrder[study.INVASIVE_STATUS] || 0,
        sortedStudiesByRecentYear
    );

    return {
        kind: "invasive",
        title:
            sortedStudiesByRecentYearAndInvasiveStatus.length > 0
                ? getSiteTitle(theme, sortedStudiesByRecentYearAndInvasiveStatus[0])
                : "",
        data: getData(sortedStudiesByRecentYearAndInvasiveStatus),
        dataSources: dataSources,
        curations: createCurations(dataSources, sortedStudiesByRecentYearAndInvasiveStatus),
    };
}

function getData(sortedStudies: InvasiveStudy[]): InvasiveChartDataContent[] {
    const cleanValue = (value: string) =>
        isNR(value) || isNull(value) ? i18next.t("common.invasive.chart.vector_occurrance.not_reported") : value;

    return sortedStudies.map(study => ({
        code: study.Code,
        species: getSpecies(study),
        samplingPeriod: cleanValue(getSamplingPeriod(study)),
        samplingMethod: cleanValue(study.SAMPLING_METHOD),
        speciedIdentificationMethod: cleanValue(study.ID_METHOD),
        vectorStage: cleanValue(study.STAGE),
        larvalHabitat:
            study.STAGE === "Immatures (larvae or pupae)" ||
            study.STAGE === "Immature" ||
            study.STAGE === "Immature and adults"
                ? study.BREEDING_HABITAT
                : undefined,
        villageOrigin: cleanValue(study.VILLAGE_FLAG ? study.VILLAGE_ORIG : null),
    }));
}

function getSpecies(study: InvasiveStudy): string {
    return isNotNull(study.VECTOR_SPECIES)
        ? study.VECTOR_SPECIES
        : isNotNull(study.VECTOR_SPECIES_COMPLEX)
        ? study.VECTOR_SPECIES_COMPLEX
        : "";
}

function getSamplingPeriod(study: InvasiveStudy): string {
    const translationMap: Record<string, string> = {
        January: i18next.t("utils.Jan."),
        February: i18next.t("utils.Feb."),
        March: i18next.t("utils.Mar."),
        April: i18next.t("utils.Apr."),
        May: i18next.t("utils.May"),
        June: i18next.t("utils.June"),
        July: i18next.t("utils.July"),
        August: i18next.t("utils.Aug."),
        September: i18next.t("utils.Sept."),
        October: i18next.t("utils.Oct."),
        November: i18next.t("utils.Nov."),
        December: i18next.t("utils.Dec."),
    };
    const monthStart = translationMap[study.MONTH_START];
    const monthEnd = translationMap[study.MONTH_END];
    const yearStart = study.YEAR_START;
    const yearEnd = study.YEAR_END;

    if (isNull(yearStart) && isNull(yearEnd)) {
        return null;
    }

    const start = monthStart ? `${monthStart} ${yearStart}` : `${yearStart}`;
    const end = monthEnd ? `${monthEnd} ${yearEnd}` : `${yearEnd}`;

    const unique = yearStart === yearEnd && monthStart === monthEnd;
    const partial = (() => {
        if (!isNull(yearStart) && !isNull(yearEnd)) {
            return `${start} to ${end}`;
        } else if (!isNull(yearStart) && isNull(yearEnd)) {
            return start;
        } else if (isNull(yearStart) && !isNull(yearEnd)) {
            return end;
        }
    })();

    return (unique ? start : partial) || "";
}
