export interface PreventionFiltersState {
    insecticideClasses: string[];
    insecticideTypes: string[];
    years: [number, number];
    onlyIncludeBioassaysWithMoreMosquitoes: number;
    onlyIncludeDataByHealth: boolean;
}
