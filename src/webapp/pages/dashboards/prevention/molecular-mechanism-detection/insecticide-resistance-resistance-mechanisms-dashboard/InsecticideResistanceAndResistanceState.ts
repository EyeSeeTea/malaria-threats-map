import { GraphData } from "./graph/GraphData";
import { TableData } from "./table/TableData";

export type ChartType = "graph" | "table";

export type InsecticideResistanceAndResistanceGraphData = {
    kind: "GraphData";
    series: GraphData[];
};

export type InsecticideResistanceAndResistanceTableData = {
    kind: "TableData";
    rows: TableData[];
};

export type InsecticideResistanceAndResistanceData =
    | InsecticideResistanceAndResistanceGraphData
    | InsecticideResistanceAndResistanceTableData;
