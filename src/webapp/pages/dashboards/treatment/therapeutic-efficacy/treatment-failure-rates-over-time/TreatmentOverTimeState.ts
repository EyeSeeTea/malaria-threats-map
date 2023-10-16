import { TreatmentStudy } from "../../../../../../domain/entities/TreatmentStudy";
import { Option } from "../../../common/types";
import { TreatmentFiltersState } from "../../filters/TreatmentFiltersState";
import { ChartSerie } from "./graph/ChartSerie";
import { TableData } from "./table/TableData";

export type TreatmentOverTimeType = "treatmentFailure" | "positiveDay3";

export interface TreatmentOverTimeState {
    chartTypes: Option<ChartType>[];
    chartType: ChartType;
    studiesCount: number;
    filteredStudiesForDrugs: TreatmentStudy[];
    data: TreatmentOverTimeData;
    filters: TreatmentFiltersState;
    onChartTypeChange: (type: ChartType) => void;
}

export type TreatmentOverTimeGraphData = {
    kind: "GraphData";
    series: ChartSerie[];
};

export type TreatmentOverTimeTableData = {
    kind: "TableData";
    rows: TableData[];
    plasmodiumSpecies: string;
};

export type TreatmentOverTimeData = TreatmentOverTimeGraphData | TreatmentOverTimeTableData;

export type ChartType = "graph" | "table";
