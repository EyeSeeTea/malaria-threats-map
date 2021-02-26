import { PreventionMapType, DiagnosisMapType, TreatmentMapType, InvasiveMapType } from "./types";
import { GAPageView } from "./actions/base-actions";

const analyticsPaths = {
    prevention: {
      [PreventionMapType.RESISTANCE_STATUS]: "insecticideResistanceStatus",
      [PreventionMapType.INTENSITY_STATUS]: "insecticideResistanceIntensity",
      [PreventionMapType.RESISTANCE_MECHANISM]: "resistance",
      [PreventionMapType.LEVEL_OF_INVOLVEMENT]: "metabolic",
      [PreventionMapType.PBO_DEPLOYMENT]: "pyrethroid",
    },
    diagnosis: {
      [DiagnosisMapType.GENE_DELETIONS]: "gene",
    },
    treatment: {
      [TreatmentMapType.TREATMENT_FAILURE]: "failure",
      [TreatmentMapType.DELAYED_PARASITE_CLEARANCE]: "delayedParasite",
      [TreatmentMapType.MOLECULAR_MARKERS]: "molecularMarkers",
    },
    invasive: {
      [InvasiveMapType.VECTOR_OCCURANCE]: "vectorOcurrence",
    }
  }

type AnalyticsMainPage = keyof typeof analyticsPaths;

const analyticsPages = new Set(Object.keys(analyticsPaths))

function isGoogleAnalyticsPage(page: string): page is AnalyticsMainPage  {
    return analyticsPages.has(page);
}


export function getAnalyticsPageViewFromString(options: {page: string, section?: number}): GAPageView | undefined {
    const { page, section = 0 } = options;
    if (!isGoogleAnalyticsPage(page)) return;
    return getAnalyticsPageView({ page, section });
}

export function getAnalyticsPageView<Page extends AnalyticsMainPage>(options: {page: Page, section?: number}): GAPageView | undefined {
  const { page, section = 0 } = options;
  const mapping = analyticsPaths[page] as Record<number, string>;
  const sectionName = mapping ? mapping[section] : undefined;
  return sectionName ? { path: [page, sectionName].join("/") } : undefined;
}
