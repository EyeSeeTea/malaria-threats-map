export interface PreventionFiltersState {
    insecticideClasses: string[];
    insecticideTypes: string[];
    species: string[];
    type: string;
    years: [number, number];
    onlyIncludeBioassaysWithMoreMosquitoes: number;
    onlyIncludeDataByHealth: boolean;
    maxMinYears: [number, number];
    onYearsChange: (years: [number, number]) => void;
    onInsecticideClassesChange?: (value: string[]) => void;
    onSpeciesChange?: (value: string[]) => void;
    onTypeChange?: (value: string) => void;
    onInsecticideClassChange?: (values: string[]) => void;
    onInsecticideTypesChange?: (value: string[]) => void;
    onOnlyIncludeBioassaysWithMoreMosquitoesChange: (value: number) => void;
    onOnlyIncludeDataByHealthChange: (value: boolean) => void;
}
