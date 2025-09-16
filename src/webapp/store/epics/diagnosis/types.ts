import { DiagnosisStudy } from "../../../../domain/entities/DiagnosisStudy";
import { CitationDataSource, CurationSources } from "../../SelectionData";

export type DiagnosisSelectionData = {
    kind: "diagnosis";
    title: string;
    subtitle: string;
    studyObject: DiagnosisStudy;
    data: GeneDeletionsData | Hrp23StudiesData;
    dataSources: CitationDataSource[];
    curations: CurationSources[];
};

export type GeneDeletionsChartDataItem = {
    type: string;
    samples: string;
    percentageConfirmed: string;
};

export type GeneDeletionsChartDataContent = {
    header?: string;
    dataSources: string;
    year: number;
    studyObject: DiagnosisStudy;
    items: GeneDeletionsChartDataItem[];
};

export type GeneDeletionsData = {
    kind: "gene-deletions";
    data: GeneDeletionsChartDataContent[];
};

export enum HRP23_STUDIES {
    STATUS = "status",
    PROPOSED_TIMEFRAME = "proposedTimeframe",
    STUDY_POPULATION = "studyPopulation",
    STUDY_DESIGN = "studyDesign",
    GENOTYPING = "genotyping",
    STUDY_INITIATED_FOLLOWING = "studyInitiatedFollowing",
    STUDY_SITES = "studySites",
    LEAD_INSTITUTION = "leadInstitution",
    FUNDING_SOURCE = "fundingSource",
}

export type Hrp23StudyDetails = {
    [K in HRP23_STUDIES]: {
        label: string;
        value: string;
    };
};

export type Hrp23StudiesData = {
    kind: "hrp23-studies";
    data: Hrp23StudyDetails[];
};
