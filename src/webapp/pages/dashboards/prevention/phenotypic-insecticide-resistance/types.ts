export type ResistanceToInsecticideSeriesGroup = Record<string, ResistanceToInsecticideSerie[]>;

export interface ResistanceToInsecticideSerie {
    type: "bar";
    name: string;
    color: string;
    data: number[];
}
