export const treatmentdashboardColors = ["#7EA0C3", "#FEAF59", "#F78185", "#94CFCA", "#7BC280"];

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
