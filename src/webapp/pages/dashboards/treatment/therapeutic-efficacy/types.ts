export const treatmentByDrugColors = ["#E39B9E", "#A00101"];

export interface TreatmentFailureSeries {
    maxYAxis: number;
    itemsByDrug: Record<string, TreatmentFailureSeriesItem[]>;
}

export interface TreatmentFailureSeriesItem {
    type: "bar";
    color: string;
    data: number[];
    maxPointWidth: number;
}
