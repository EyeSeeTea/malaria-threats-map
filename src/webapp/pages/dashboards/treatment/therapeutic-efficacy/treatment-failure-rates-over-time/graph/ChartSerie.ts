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
