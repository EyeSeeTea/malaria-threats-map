import { Translation } from "../types/Translation";

import { NotificationsState } from "../types/Notifications";
import { DiagnosisStudy } from "../../domain/entities/DiagnosisStudy";
import { PreventionStudy } from "../../domain/entities/PreventionStudy";
import { TreatmentStudy } from "../../domain/entities/TreatmentStudy";
import { InvasiveStudy } from "../../domain/entities/InvasiveStudy";
import { CountryLayer, CountryProperties } from "../../domain/entities/CountryLayer";

export interface State {
    malaria: MalariaState;
    prevention: PreventionState;
    diagnosis: DiagnosisState;
    treatment: TreatmentState;
    invasive: InvasiveState;
    translations: TranslationsState;
    countryLayer: CountryLayerState;
    district: DistrictsState;
    notifications: NotificationsState;
}

export interface RegionState {
    country?: string;
    region?: string;
    subRegion?: string;
    site?: string;
    siteIso2?: string;
    siteCoordinates?: [number, number];
}

export interface MalariaState {
    theme: string;
    any: any;
    endemicity: boolean;
    countryMode: boolean;
    storyMode: boolean;
    storyModeStep: number;
    filters: number[];
    region: RegionState;
    lastUpdatedDates: {
        prevention: Date | null;
        diagnosis: Date | null;
        treatment: Date | null;
        invasive: Date | null;
    };
    initialDialogOpen: boolean;
    filtersOpen: boolean;
    filtersMode: string;
    selection: SiteSelection | null;
    mobileOptionsOpen: boolean;
    zoom: number;
    setZoom: number | null;
    bounds: Array<Array<number>>;
    setBounds: Array<Array<number>>;
    tour: TourState;
    dataDownloadOpen: boolean;
    reportOpen: boolean;
    mapTitle: string;
    subscriptionOpen: boolean;
    feedbackOpen: boolean;
    theaterMode: boolean;
    legendExpanded: boolean;
    isSubmittingSubscription: boolean;
}

export interface TranslationsState {
    translations: Translation[];
    loading: boolean;
    fields: any;
}

export interface DiagnosisState {
    studies: DiagnosisStudy[];
    error: string | null;
    loading: boolean;
    filteredStudies: DiagnosisStudy[];
    filters: DiagnosisFilters;
}

export interface DiagnosisFilters {
    mapType: DiagnosisMapType;
    surveyTypes: string[];
    patientType: string | null;
    deletionType: string | null;
}

export enum DiagnosisMapType {
    GENE_DELETIONS,
}

export enum PreventionMapType {
    RESISTANCE_STATUS,
    INTENSITY_STATUS,
    RESISTANCE_MECHANISM,
    LEVEL_OF_INVOLVEMENT,
    PBO_DEPLOYMENT,
}

export interface PreventionFilters {
    mapType: PreventionMapType;
    insecticideClass: string;
    insecticideTypes: string[];
    synergistTypes: string[];
    assayTypes: string[];
    type: string | null;
    species: string[];
}

export interface PreventionState {
    studies: PreventionStudy[];
    error: string | null;
    loading: boolean;
    filteredStudies: PreventionStudy[];
    filters: PreventionFilters;
}

export enum TreatmentMapType {
    TREATMENT_FAILURE,
    DELAYED_PARASITE_CLEARANCE,
    MOLECULAR_MARKERS,
}

export interface TreatmentFilters {
    mapType: TreatmentMapType;
    plasmodiumSpecies: string;
    drug: string;
    molecularMarker: number;
}

export interface TreatmentState {
    studies: TreatmentStudy[];
    error: string | null;
    loading: boolean;
    filteredStudies: TreatmentStudy[];
    filters: TreatmentFilters;
}

export enum InvasiveMapType {
    VECTOR_OCCURANCE,
}

export interface InvasiveFilters {
    mapType: InvasiveMapType;
    vectorSpecies: string[];
}

export interface InvasiveState {
    studies: InvasiveStudy[];
    error: string | null;
    loading: boolean;
    filteredStudies: InvasiveStudy[];
    filters: InvasiveFilters;
}

export interface CountryLayerState {
    layer: CountryLayer | null;
    loading: boolean;
    countries: CountryProperties[];
}

export interface SiteSelection {
    ISO_2_CODE: string;
    SITE_ID: string;
    coordinates: [number, number];
}

export interface TourState {
    open: boolean;
    step: number;
}

export interface DistrictsState {
    layer: any | null;
    loading: boolean;
    districts: any[];
}
