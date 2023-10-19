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

export type SpreadOfResistanceOverTimeChartData = SpreadOfResistanceOverTimeChartDataByClass;

export type SpreadOfResistanceOverTimeChartDataByClass = {
    kind: "InsecticideByClass";
    data: SpreadOfResistanceOverTimeLineChart | SpreadOfResistanceOverTimeBarChart;
};

export type SpreadOfResistanceOverTimeLineChart = {
    years: number[];
    maxValue: number;
    dataByCountry:
        | SpreadOfResistanceOverTimeByCountryLineChart
        | SpreadOfResistanceOverTimeByCountryAndSpeciesLineChart;
};

export type SpreadOfResistanceOverTimeByCountryLineChart = Record<string, SpreadOfResistanceOverTimeSeriesLineChart[]>;

export type SpreadOfResistanceOverTimeByCountryAndSpeciesLineChart = Record<
    string,
    SpreadOfResistanceOverTimeBySpecieLineChart
>;
export type SpreadOfResistanceOverTimeBySpecieLineChart = Record<string, SpreadOfResistanceOverTimeSeriesLineChart[]>;

export type SpreadOfResistanceOverTimeSeriesLineChart =
    | SpreadOfResistanceOverTimeLineSeries
    | SpreadOfResistanceOverTimeScatterSeries;

export type SpreadOfResistanceOverTimeLineSeries = {
    type: "line";
    name: string;
    data: SpreadOfResistanceOverTimeLineData[];
    color: string;
    marker: {
        enabled: boolean;
    };
};

export type SpreadOfResistanceOverTimeTooltipDataLineChart = {
    insecticideClass: string;
    year: string;
    rangeYears: string;
    sumOfConfirmedResistanceSites: number;
    sumOfSites: number;
    numberOfSites: number;
    numberOfSitesConfirmedResistance: number;
};

export type SpreadOfResistanceOverTimeLineData = {
    y: number;
} & SpreadOfResistanceOverTimeTooltipDataLineChart;

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
} & SpreadOfResistanceOverTimeTooltipDataLineChart;

export type SpreadOfResistanceOverTimeBarChart = {
    years: number[];
    maxValue: number;
    dataByCountry: SpreadOfResistanceOverTimeByCountryBarChart | SpreadOfResistanceOverTimeByCountryAndSpeciesBarChart;
};

export type SpreadOfResistanceOverTimeByCountryBarChart = Record<string, SpreadOfResistanceOverTimeSeriesBarChart[]>;

export type SpreadOfResistanceOverTimeByCountryAndSpeciesBarChart = Record<
    string,
    SpreadOfResistanceOverTimeBySpecieBarChart
>;

export type SpreadOfResistanceOverTimeBySpecieBarChart = Record<string, SpreadOfResistanceOverTimeSeriesBarChart[]>;

export type SpreadOfResistanceOverTimeSeriesBarChart = {
    type: "column";
    name: string;
    data: number[];
    color: string;
};
