import { TreatmentStudy } from "../../../../../../domain/entities/TreatmentStudy";
import { Option } from "../../../common/types";
import { TreatmentFiltersState } from "../../filters/TreatmentFiltersState";

export type TreatmentOverTimeType = "treatmentFailure" | "positiveDay3";

export interface TreatmentOverTimeState {
    chartTypes: Option<ChartType>[];
    chartType: ChartType;
    studiesCount: number;
    filteredStudiesForDrugs: TreatmentStudy[];
    data: ChartSerie[];
    filters: TreatmentFiltersState;
    onChartTypeChange: (type: ChartType) => void;
}

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
