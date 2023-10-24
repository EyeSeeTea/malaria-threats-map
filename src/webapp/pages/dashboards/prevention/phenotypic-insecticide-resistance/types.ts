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
    dataByCountry: SpreadOfResistanceOverTimeByCountry | SpreadOfResistanceOverTimeByCountryAndSpecies;
};

export type SpreadOfResistanceOverTimeByCountry = Record<string, SpreadOfResistanceOverTimeLineSeries[]>;

export type SpreadOfResistanceOverTimeByCountryAndSpecies = Record<string, SpreadOfResistanceOverTimeBySpecie>;
export type SpreadOfResistanceOverTimeBySpecie = Record<string, SpreadOfResistanceOverTimeLineSeries[]>;

export type SpreadOfResistanceOverTimeLineSeries = {
    type: "line";
    name: string;
    data: SpreadOfResistanceOverTimeLineData[];
    color: string;
    marker: {
        symbol: "circle";
        radius: number;
        lineWidth: number;
        lineColor: string;
        fillColor: string;
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
