import { DiagnosisStudy } from "../../../../domain/entities/DiagnosisStudy";
import { CitationDataSource, CurationSources } from "../../SelectionData";

export type DiagnosisSelectionData = {
    kind: "diagnosis";
    title: string;
    subtitle: string;
    studyObject: DiagnosisStudy;
    data: DiagnosisChartDataContent[];
    dataSources: CitationDataSource[];
    curations: CurationSources[];
};

export type DiagnosisChartDataItem = {
    type: string;
    samples: string;
    percentageConfirmed: string;
};

export type DiagnosisChartDataContent = {
    header?: string;
    dataSources: string;
    year: number;
    items: DiagnosisChartDataItem[];
};
