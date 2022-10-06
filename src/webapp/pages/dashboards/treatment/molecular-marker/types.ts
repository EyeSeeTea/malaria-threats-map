export type MolecularChart = {
    years: number[];
    seriesByCountry: Record<string, MolecularChartSerie[]>;
};

export type MolecularChartSerie = {
    type: "column";
    name: string;
    color: string;
    data: number[];
    pointWidth: number;
};

export const molecularMarkerColors = ["#82B9E0", "#5D96C5", "#3F74A8", "#205487"];
