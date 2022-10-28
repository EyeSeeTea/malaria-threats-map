import { Translation } from "../types/Translation";

import { NotificationsState } from "../types/Notifications";
import { DiagnosisStudy } from "../../domain/entities/DiagnosisStudy";
import { PreventionStudy } from "../../domain/entities/PreventionStudy";
import { TreatmentStudy } from "../../domain/entities/TreatmentStudy";
import { InvasiveStudy } from "../../domain/entities/InvasiveStudy";
import { CountryLayer, CountryProperties } from "../../domain/entities/CountryLayer";
import { FeedbackState } from "../types/FeedbackState";
import { SelectionData } from "./SelectionData";

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
    feedback: FeedbackState;
}

export interface RegionState {
    country?: string;
    region?: string;
    subRegion?: string;
    site?: string;
    siteLabel?: string;
    siteIso2?: string;
    siteCoordinates?: [number, number];
}

export type ActionGroup = "THEME" | "MAP_TYPE" | "DATA" | "LOCATION" | "DATASET";

export type MapTheme = "prevention" | "diagnosis" | "treatment" | "invasive";

export type PreventionDataset =
    | "DISCRIMINATING_CONCENTRATION_BIOASSAY"
    | "INTENSITY_CONCENTRATION_BIOASSAY"
    | "SYNERGIST-INSECTICIDE_BIOASSAY"
    | "MOLECULAR_ASSAY"
    | "BIOCHEMICAL_ASSAY";

export type TreatmentDataset = "THERAPEUTIC_EFFICACY_STUDY" | "MOLECULAR_MARKER_STUDY";

export type InvasiveDataset = "INVASIVE_VECTOR_SPECIES";

export type DiagnosisDataset = "PFHRP23_GENE_DELETIONS";

export type LastUpdatedDates = {
    prevention: Date | null;
    diagnosis: Date | null;
    treatment: Date | null;
    invasive: Date | null;
};

export interface MalariaState {
    theme: string;
    any: any;
    endemicity: boolean;
    countryMode: boolean;
    storyMode: boolean;
    storyModeStep: number;
    filters: number[];
    maxMinYears: number[];
    region: RegionState;
    lastUpdatedDates: LastUpdatedDates;
    actionGroupSelected: ActionGroup | null;
    selection: SiteSelection | null;
    hoverSelection: SiteSelection | null;
    selectionData: SelectionData | null;
    mobileOptionsOpen: boolean;
    zoom: number;
    setZoom: number | null;
    bounds: Array<Array<number>>;
    setBounds: Array<Array<number>>;
    tour: TourState;
    reportOpen: boolean;
    mapTitle: string;
    uploadFileOpen: boolean;
    feedbackOpen: boolean;
    theaterMode: boolean;
    legendExpanded: boolean;
    isUploadingFile: boolean;
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
    selectionStudies: DiagnosisStudy[];
}

export interface DiagnosisFilters {
    mapType: DiagnosisMapType;
    dataset: DiagnosisDataset;
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
}

export interface PreventionFilters {
    mapType: PreventionMapType;
    dataset: PreventionDataset;
    insecticideClass: string;
    insecticideTypes: string[];
    synergistTypes: string[];
    assayTypes: string[];
    proxyType: string | null;
    type: string[] | null;
    species: string[];
}

export interface PreventionState {
    studies: PreventionStudy[];
    error: string | null;
    loading: boolean;
    filteredStudies: PreventionStudy[];
    filters: PreventionFilters;
    selectionStudies: PreventionStudy[];
}

export enum TreatmentMapType {
    TREATMENT_FAILURE,
    DELAYED_PARASITE_CLEARANCE,
    MOLECULAR_MARKERS,
}

export interface TreatmentFilters {
    mapType: TreatmentMapType;
    dataset: TreatmentDataset;
    plasmodiumSpecies: string;
    drug: string;
    molecularMarker: number;
    excludeLowerPatients: boolean;
    excludeLowerSamples: boolean;
}

export interface TreatmentState {
    studies: TreatmentStudy[];
    error: string | null;
    loading: boolean;
    filteredStudies: TreatmentStudy[];
    filters: TreatmentFilters;
    selectionStudies: TreatmentStudy[];
}

export enum InvasiveMapType {
    VECTOR_OCCURANCE,
}

export interface InvasiveFilters {
    mapType: InvasiveMapType;
    dataset: InvasiveDataset;
    vectorSpecies: string[];
}

export interface InvasiveState {
    studies: InvasiveStudy[];
    error: string | null;
    loading: boolean;
    filteredStudies: InvasiveStudy[];
    filters: InvasiveFilters;
    selectionStudies: InvasiveStudy[];
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

interface TourState {
    open: boolean;
    step: number;
}

export interface DistrictsState {
    layer: any | null;
    loading: boolean;
    districts: any[];
}
