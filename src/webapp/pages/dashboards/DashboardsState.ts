import { TreatmentStudy } from "../../../domain/entities/TreatmentStudy";

export type DashboardsThemeOptions = "prevention" | "treatment";

export interface DashboardsState {
    theme: DashboardsThemeOptions;
    selectedCountries: string[];
    countryContext: string;
    therapeuticResults: string;
    molecularResults: string;
    studies: TreatmentStudy[];
    // dashboardsData: Record<string, DashboardsItem[]>;
}

// interface DashboardsItem {
//     filter: DashboardsTreatmentFilters;
//     series: { name: string; data: number[] };
// }

// export interface DashboardsTreatmentFilters {
//     plasmodiumSpecies: string;
//     drug: string;
//     years: [number, number];
//     excludeLowerPatients: boolean;
// }
