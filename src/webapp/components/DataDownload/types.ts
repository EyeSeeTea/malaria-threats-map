import { DiagnosisStudy } from "../../../domain/entities/DiagnosisStudy";
import { InvasiveStudy } from "../../../domain/entities/InvasiveStudy";
import { PreventionStudy } from "../../../domain/entities/PreventionStudy";
import { TreatmentStudy } from "../../../domain/entities/TreatmentStudy";
import { DiagnosisFilters, InvasiveFilters, PreventionFilters, TreatmentFilters } from "../../store/types";

export type UserInfo = {
    firstName: string;
    lastName: string;
    organizationType: string;
    organizationName: string;
    uses: string;
    country: string;
    email: string;
    contactConsent: boolean;
    piConsent: boolean;
};

export type TermsInfo = {
    agreement: boolean;
};

export interface DatabaseSelectionBase {
    id: number;
    dataset: string;
    filtersValue: string;
    location: string;
}

export interface PreventionDatabaseSelection extends DatabaseSelectionBase {
    kind: "prevention";
    filters: PreventionFilters;
    filteredStudies: PreventionStudy[];
}

export interface DiagnosisDatabaseSelection extends DatabaseSelectionBase {
    kind: "diagnosis";
    filters: DiagnosisFilters;
    filteredStudies: DiagnosisStudy[];
}

export interface TreatmentDatabaseSelection extends DatabaseSelectionBase {
    kind: "treatment";
    filters: TreatmentFilters;
    filteredStudies: TreatmentStudy[];
}

export interface InvasiveDatabaseSelection extends DatabaseSelectionBase {
    kind: "invasive";
    filters: InvasiveFilters;
    filteredStudies: InvasiveStudy[];
}

export type DatabaseSelection =
    | PreventionDatabaseSelection
    | DiagnosisDatabaseSelection
    | TreatmentDatabaseSelection
    | InvasiveDatabaseSelection;

export type Download = {
    firstName: string;
    lastName: string;
    organizationType: string;
    organizationName: string;
    uses: string;
    position: string;
    country: string;
    email: string;
    date: string;
    researchInfo: string;
    policiesInfo: string;
    contactConsent: boolean;
    organisationProjectConsent: boolean;
    toolsInfo: string;
    implementationCountries: string;
    theme: string;
    dataset: string;
};
