import i18next from "i18next";
import { Study } from "../../../domain/entities/Study";
import { TreatmentStudy } from "../../../domain/entities/TreatmentStudy";

export function getSiteTitle(theme: string, study: Study) {
    const titleItems = study
        ? [
              study.VILLAGE_NAME || study.SITE_NAME,
              theme === "treatment" ? (study as TreatmentStudy).PROVINCE : "",
              i18next.t(study.ISO2 === "NA" ? "common.COUNTRY_NA" : study.ISO2),
          ]
        : [];
    return titleItems.filter(Boolean).join(", ");
}
