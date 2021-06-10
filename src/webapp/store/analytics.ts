import { PreventionMapType, DiagnosisMapType, TreatmentMapType, InvasiveMapType } from "./types";
import { GAPageView } from "./actions/base-actions";
import { sendAnalytics } from "../utils/analytics";

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
    },
};

type AppPage = keyof typeof analyticsPaths;

const analyticsPages = new Set(Object.keys(analyticsPaths));

function isGoogleAnalyticsPage(page: string): page is AppPage {
    return analyticsPages.has(page);
}

interface Options<Page extends string = string> {
    page: Page;
    section?: number;
}

export function getAnalyticsPageViewFromString(options: Options): GAPageView | undefined {
    const { page, section = 0 } = options;
    if (!isGoogleAnalyticsPage(page)) return;
    return getAnalyticsPageView({ page, section });
}

export function getAnalyticsPageView<P extends AppPage>(options: Options<P>): GAPageView | undefined {
    const sectionName = getSection(options);
    return sectionName ? { path: [options.page, sectionName].join("/") } : undefined;
}

export function sendAnalyticsMapMenuChange<Page extends AppPage>(page: Page, sectionIndex: number): void {
    const section = getSection({ page, section: sectionIndex });
    sendAnalytics({ type: "event", category: "map_menu", action: page, label: section });
}

function getSection<Page extends AppPage>(options: Options<Page>): string | undefined {
    const { page, section = 0 } = options;
    const mapping = analyticsPaths[page] as Record<number, string>;
    return mapping ? mapping[section] : undefined;
}
