export interface PreventionFiltersState {
    insecticideClasses: string[];
    insecticideTypes: string[];
    species: string[];
    type: string;
    years: [number, number];
    onlyIncludeBioassaysWithMoreMosquitoes: number;
    onlyIncludeDataByHealth: boolean;
    maxMinYears: [number, number];
}
