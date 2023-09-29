import { PreventionStudy } from "../../../../../../domain/entities/PreventionStudy";
import { TableData } from "./table/TableData";

export type ChartType = "graph" | "table";

export type InsecticideResistanceAndResistanceGraphData = {
    kind: "GraphData";
    series: PreventionStudy[];
};

export type InsecticideResistanceAndResistanceTableData = {
    kind: "TableData";
    rows: TableData[];
};

export type InsecticideResistanceAndResistanceData =
    | InsecticideResistanceAndResistanceGraphData
    | InsecticideResistanceAndResistanceTableData;
