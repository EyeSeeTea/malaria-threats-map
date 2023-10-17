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

export type SpreadOfResistanceOverTimeByCountry = Record<string, SpreadOfResistanceOverTimeSeries[]>;

export type SpreadOfResistanceOverTimeByCountryAndSpecies = Record<string, SpreadOfResistanceOverTimeBySpecie>;
export type SpreadOfResistanceOverTimeBySpecie = Record<string, SpreadOfResistanceOverTimeSeries[]>;

export type SpreadOfResistanceOverTimeSeries =
    | SpreadOfResistanceOverTimeLineSeries
    | SpreadOfResistanceOverTimeScatterSeries;

export type SpreadOfResistanceOverTimeLineSeries = {
    type: "line";
    name: string;
    data: number[];
    color: string;
    marker: {
        enabled: boolean;
    };
};

export type SpreadOfResistanceOverTimeScatterSeries = {
    type: "scatter";
    name: string;
    data: SpreadOfResistanceOverTimeScatterData[];
    marker: {
        symbol: "circle";
    };
};

export type SpreadOfResistanceOverTimeScatterData = {
    y: number;
    marker: {
        lineWidth: number;
        lineColor: string;
        fillColor: string;
        radius: number;
    };
};
