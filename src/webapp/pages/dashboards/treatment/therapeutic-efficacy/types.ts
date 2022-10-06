export type TreatmentOverTimeType = "treatmentFailure" | "positiveDay3";

export const treatmentdashboardColors = ["#7EA0C3", "#FEAF59", "#F78185", "#94CFCA", "#7BC280"];

export type BubleChartGroup = {
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

export const treatmentByDrugColors = ["#E39B9E", "#A00101"];

export interface TreatmentFailureSeriesItem {
    type: "bar";
    color: string;
    data: number[];
    maxPointWidth: number;
}
