import { Study } from "../../domain/entities/Study";
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
    data?: PreventionChartData | PreventionMechanismChartData | TreatmentChartData;
    dataSources?: CitationDataSource[];
    curations?: CurationSources[];
    othersDetected?: string[];
    othersTitle?: string;
    aditionalInformation?: AditionalInformation[];
};

export type preventionChartDataTitle = {
    statusColor: string;
    titlePrefix: string;
    titleContent: string;
    titleSufix: string;
};

export type PreventionChartData = {
    kind: "prevention";
    data: { [x: string]: { [x: string]: { title?: preventionChartDataTitle; seriesData: PreventionChartDataItem[] } } };
};

export type PreventionMechanismChartData = {
    kind: "prevention-mechanism";
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
    kind: "treatment";
    data: { years: string[]; series: TreatmentChartDataGroup[] };
};

export type PreventionChartDataItem = {
    name: string;
    y: number;
    number: string;
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
