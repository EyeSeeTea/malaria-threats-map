import { DiagnosisStudy } from "../../../../domain/entities/DiagnosisStudy";
import { getSiteTitle } from "../../../components/site-title/utils";
import { SelectionData, SiteSelection } from "../../types";
import { createCitationDataSources, createCurations } from "../common/utils";

export function createDiagnosisSelectionData(
    theme: string,
    selection: SiteSelection | null,
    filteredStudies: DiagnosisStudy[]
): SelectionData | null {
    if (!selection) return null;

    const siteFilteredStudies = filteredStudies.filter(study => study.SITE_ID === selection.SITE_ID);

    const dataSources = createCitationDataSources(theme, siteFilteredStudies);

    return {
        title: siteFilteredStudies.length > 0 ? getSiteTitle(theme, siteFilteredStudies[0]) : "",
        subtitle: "",
        studyObject: siteFilteredStudies[0],
        data: undefined,
        dataSources: dataSources,
        curations: createCurations(dataSources, siteFilteredStudies),
        othersDetected: [],
    };
}
