import { CitationDataSource, CurationSources } from "../../SelectionData";

export type InvasiveSelectionData = {
    kind: "invasive";
    title: string;
    data: InvasiveChartDataContent[];
    dataSources: CitationDataSource[];
    curations: CurationSources[];
};

export type InvasiveChartDataContent = {
    code: string;
    species: string;
    samplingPeriod: string;
    samplingMethod: string;
    speciedIdentificationMethod: string;
    vectorStage: string;
};
