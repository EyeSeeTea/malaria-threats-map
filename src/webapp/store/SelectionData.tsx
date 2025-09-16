import { Study } from "../../domain/entities/Study";
import { Option } from "../components/BasicSelect";
import { MolecularMarkersLabel } from "../components/layers/treatment/MolecularMarkersOngoingStudies/utils";
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
        | TherapeuticEfficacyStudiesData
        | MolecularMarkersOngoingStudiesData;
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

export type PreventionChartDataContent = {
    [x: string]: { [x: string]: { title?: preventionChartDataTitle; seriesData: PreventionChartDataItem[] } };
};

export type PreventionChartData = {
    kind: "prevention";
    data: PreventionChartDataContent;
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

export type TreatmentMolecularMarkersChartData = {
    kind: "treatment-molecular-markers";
    data: {
        years: string[];
        series: TreatmentChartDataSerie[];
        markers: { [group: string]: { name: string; color?: string }[] };
    };
};

export enum THERAPEUTIC_EFFICACY_STUDY_DETAILS_KEYS {
    AGE_GROUP = "ageGroup",
    SPECIES = "species",
    DRUG = "drug",
    GENOTYPING = "genotyping",
}

type TherapeuticEfficacyStudyDetails = {
    [K in THERAPEUTIC_EFFICACY_STUDY_DETAILS_KEYS]: {
        label: string;
        value: string;
    };
};

export enum MOLECULAR_MARKERS_ONGOING_STUDY_DETAILS_KEYS {
    PROMPT_NAME = "studyInitiatedFollowing",
    GEOGR_SCOPE_NAME = "samplingStrategy",
    PROT_TYPE_NAME = "studyDesign",
}

type MolecularMarkersOngoingStudyDetails = {
    [K in MOLECULAR_MARKERS_ONGOING_STUDY_DETAILS_KEYS]: {
        label: string;
        value: string;
    };
};

export enum ONGOING_AND_PLANNED_TREATMENT_STUDY_OVERVIEW_INFO_KEYS {
    STATUS = "status",
    PROPOSED_TIMEFRAME = "proposedTimeframe",
    LEAD_INSTITUTION = "leadInstitution",
    FUNDING_SOURCE = "fundingSource",
}

export type OngoingAndPlannedTreatmentStudiesOverviewInfo = {
    [K in ONGOING_AND_PLANNED_TREATMENT_STUDY_OVERVIEW_INFO_KEYS]: {
        label: string;
        value: string;
    };
};

export type OngoingAndPlannedTreatmentStudiesDetailsConfig = {
    title: string;
    studyDetails: TherapeuticEfficacyStudyDetails | MolecularMarkersOngoingStudyDetails;
    molecularMarkersIncluded?: MolecularMarkersLabel[];
};

export type TherapeuticEfficacyStudiesDataWithSameSurvId = {
    overviewInfo: OngoingAndPlannedTreatmentStudiesOverviewInfo;
    studiesDetailsConfig: OngoingAndPlannedTreatmentStudiesDetailsConfig[];
};

export type TherapeuticEfficacyStudiesData = {
    kind: "therapeutic-efficacy-studies";
    data: TherapeuticEfficacyStudiesDataWithSameSurvId[];
};

export type MolecularMarkersOngoingStudiesDataWithSameSurvId = {
    overviewInfo: OngoingAndPlannedTreatmentStudiesOverviewInfo;
    studiesDetailsConfig: OngoingAndPlannedTreatmentStudiesDetailsConfig[];
};

export type MolecularMarkersOngoingStudiesData = {
    kind: "molecular-markers-ongoing-studies";
    data: MolecularMarkersOngoingStudiesDataWithSameSurvId[];
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
    group: string;
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
