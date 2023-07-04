import { Study } from "../../domain/entities/Study";
import { TreatmentStudy } from "../../domain/entities/TreatmentStudy";
import { Option } from "../components/BasicSelect";
import { DiagnosisSelectionData } from "./epics/diagnosis/types";
import { InvasiveSelectionData } from "./epics/invasive/types";

export type SelectionData = InvasiveSelectionData | DiagnosisSelectionData | CommonSelectionData;

export type CommonSelectionData = {
    kind: "common";
    title: string;
    subtitle: string;
    filterOptions?: Option[];
    filterSelection?: Option[];
    studyObject: Study;
    data?:
        | PreventionChartData
        | PreventionMechanismChartData
        | TreatmentChartData
        | TreatmentMolecularMarkersChartData
        | TherapeuticEfficacyStudiesData;
    dataSources?: CitationDataSource[];
    curations?: CurationSources[];
    othersDetected?: string[];
    othersTitle?: string;
    aditionalInformation?: AditionalInformation[];
};

export enum COMMON_SELECTION_DATA_TYPES {
    PREVENTION = "prevention",
    PREVENTION_MECHANISM = "prevention-mechanism",
    TREATMENT = "treatment",
    TREATMENT_MOLECULAR_MARKERS = "treatment-molecular-markers",
    THERAPEUTIC_EFFICACY_STUDIES = "therapeutic-efficacy-studies",
}

export type preventionChartDataTitle = {
    statusColor: string;
    titlePrefix: string;
    titleContent: string;
    titleSufix: string;
};

export type PreventionChartDataContent = {
    [x: string]: { [x: string]: { title?: preventionChartDataTitle; seriesData: PreventionChartDataItem[] } };
};

export type PreventionChartData = {
    kind: COMMON_SELECTION_DATA_TYPES.PREVENTION;
    data: PreventionChartDataContent;
};

export type PreventionMechanismChartData = {
    kind: COMMON_SELECTION_DATA_TYPES.PREVENTION_MECHANISM;
    data: {
        [x: string]: {
            [x: string]: {
                years: number[];
                assays: PreventionMechanismChartDataGroup[];
                allelics: PreventionMechanismChartDataGroup[];
            };
        };
    };
};

export type TreatmentChartData = {
    kind: COMMON_SELECTION_DATA_TYPES.TREATMENT;
    data: { years: string[]; series: TreatmentChartDataGroup[] };
};

export type TreatmentMolecularMarkersChartData = {
    kind: COMMON_SELECTION_DATA_TYPES.TREATMENT_MOLECULAR_MARKERS;
    data: {
        years: string[];
        series: TreatmentChartDataSerie[];
        markers: { [group: string]: { name: string; color?: string }[] };
    };
};

export type TherapeuticEfficacyStudiesData = {
    kind: COMMON_SELECTION_DATA_TYPES.THERAPEUTIC_EFFICACY_STUDIES;
    data: TreatmentStudy[];
};

export type TreatmentChartDataSerie = {
    maxPointWidth: number;
    name: string;
    color?: string;
    data: { y: number }[];
};

export type PreventionChartDataItem = {
    name: string;
    y: number;
    number: string;
    resistanceStatus: string;
    color: string;
};

export type PreventionMechanismChartDataItem = {
    name: string;
    y: number;
    yName: string;
    value?: string;
};

export type PreventionMechanismChartDataGroup = {
    maxPointWidth: number;
    name: string;
    color?: string;
    data: PreventionMechanismChartDataItem[];
};

export type TreatmentChartDataGroup = {
    name: string;
    color?: string;
    marker: { symbol: string };
    data: number[];
};

export type CitationDataSource = {
    key: string;
    url?: string;
    text: string;
};

export type CurationSources = {
    dataSources: string[];
    text: string;
};

export type AditionalInformation = {
    year: string;
    text: string;
    conducted: {
        label: string;
        text: string;
        link?: string;
    };
};
