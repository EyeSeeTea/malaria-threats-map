import i18next from "i18next";
import { DiagnosisStudy } from "../../../domain/entities/DiagnosisStudy";
import { Study } from "../../../domain/entities/Study";
import { TreatmentStudy } from "../../../domain/entities/TreatmentStudy";
import { isNotNull } from "../../utils/number-utils";

export function getSiteTitle(theme: string, study: Study) {
    const tooltipSiteName =
        theme === "diagnosis" && isNotNull((study as DiagnosisStudy).TOOLTIP_SITENAME)
            ? (study as DiagnosisStudy).TOOLTIP_SITENAME
            : undefined;

    const villageName = isNotNull(study.VILLAGE_NAME) ? study.VILLAGE_NAME : undefined;

    const siteName = isNotNull(study.SITE_NAME) ? study.SITE_NAME : undefined;

    const titleItems = study
        ? [
              tooltipSiteName || villageName || siteName,
              theme === "treatment" ? (study as TreatmentStudy).PROVINCE : "",
              i18next.t(study.ISO2 === "NA" ? "common.COUNTRY_NA" : study.ISO2),
          ]
        : [];
    return titleItems.filter(Boolean).join(", ");
}
