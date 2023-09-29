import { TableData } from "./table/TableData";

export type ChartType = "graph" | "table";

export type InsecticideResistanceAndResistanceGraphData = {
    kind: "GraphData";
    series: unknown[];
};

export type InsecticideResistanceAndResistanceTableData = {
    kind: "TableData";
    rows: TableData[];
    plasmodiumSpecies: string;
};

export type InsecticideResistanceAndResistanceData =
    | InsecticideResistanceAndResistanceGraphData
    | InsecticideResistanceAndResistanceTableData;
