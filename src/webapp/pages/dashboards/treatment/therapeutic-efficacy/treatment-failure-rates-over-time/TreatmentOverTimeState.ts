import { TreatmentStudy } from "../../../../../../domain/entities/TreatmentStudy";
import { Option } from "../../../common/types";
import { TreatmentFiltersState } from "../../filters/TreatmentFiltersState";

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
    studies: TreatmentStudy[];
};

export type TreatmentOverTimeData = TreatmentOverTimeGraphData | TreatmentOverTimeTableData;

export type ChartType = "graph" | "table";

export type ChartSerie = {
    type: "bubble";
    name: string;
    color: string;
    data: BubleChartItem[];
};

export type BubleChartItem = {
    x: number; //year
    y: number; //treatment failure
    z: number; //number patients
};
