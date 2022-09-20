export interface PreventionFiltersState {
    insecticideClasses: string[];
    years: [number, number];
    onlyIncludeBioassaysWithMoreMosquitoes: number;
    OnlyIncludeDataByHealth: boolean;
}

export const initialPreventionFilters: PreventionFiltersState = {
    insecticideClasses: [],
    years: [2010, new Date().getFullYear()],
    onlyIncludeBioassaysWithMoreMosquitoes: 0,
    OnlyIncludeDataByHealth: false,
};
