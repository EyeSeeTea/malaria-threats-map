export interface TreatmentFiltersState {
    plasmodiumSpecies: string;
    drugs: string[];
    molecularMarker: string;
    years: [number, number];
    excludeLowerPatients: boolean;
}

export const initialTreatmentFilters: TreatmentFiltersState = {
    plasmodiumSpecies: "",
    drugs: [],
    molecularMarker: "",
    years: [2010, new Date().getFullYear()],
    excludeLowerPatients: false,
};
