export type ResistanceToInsecticideChartDataByClass = {
    kind: "InsecticideByClass";
    data: ResistanceToInsecticideDataByClass;
};

export type ResistanceToInsecticideDataByClass = Record<
    string,
    { categories: string[]; series: ResistanceToInsecticideSerie[] }
>;

export type ResistanceToInsecticideChartDataByType = {
    kind: "InsecticideByType";
    data: ResistanceToInsecticideDataByType;
};

export type ResistanceToInsecticideDataByType = Record<
    string,
    Record<string, { categories: string[]; series: ResistanceToInsecticideSerie[] }>
>;

export type ResistanceToInsecticideChartData =
    | ResistanceToInsecticideChartDataByClass
    | ResistanceToInsecticideChartDataByType;

export interface ResistanceToInsecticideSerie {
    type: "bar";
    name: string;
    color: string;
    data: number[];
}

export type MosquitoOverTimeChart = {
    years: number[];
    dataByCountry: MosquitoOverTimeByCountry;
};
export type MosquitoOverTimeByCountry = Record<string, MosquitoOverTimeBySpecie>;
export type MosquitoOverTimeBySpecie = Record<string, MosquitoOverTimeData>;
export type MosquitoOverTimeData = {
    boxplotData: number[][];
    outliersData: number[][];
};

export type SpreadOfResistanceOverTimeChartType = "by-insecticide-class" | "by-insecticide";

export type SpreadOfResistanceOverTimeChartData =
    | SpreadOfResistanceOverTimeChartDataByClass
    | SpreadOfResistanceOverTimeChartDataByType;

export type SpreadOfResistanceOverTimeChartDataByClass = {
    kind: "InsecticideByClass";
    data: SpreadOfResistanceOverTimeChart;
};

export type SpreadOfResistanceOverTimeChartDataByType = {
    kind: "InsecticideByType";
    data: SpreadOfResistanceOverTimeChart;
};

export type SpreadOfResistanceOverTimeChart = {
    years: number[];
    maxSumOfConfirmedResistance: number;
    dataByCountry: SpreadOfResistanceOverTimeByCountry | SpreadOfResistanceOverTimeByCountryAndSpecies;
};

export type SpreadOfResistanceOverTimeByCountry = Record<string, SpreadOfResistanceOverTimeData[]>;

export type SpreadOfResistanceOverTimeByCountryAndSpecies = Record<string, SpreadOfResistanceOverTimeBySpecie>;
export type SpreadOfResistanceOverTimeBySpecie = Record<string, SpreadOfResistanceOverTimeData[]>;
export type SpreadOfResistanceOverTimeData = {
    name: string;
    data: number[];
    color: string;
};
