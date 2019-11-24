import { Translation } from "../types/Translation";
import { DiagnosisStudy } from "../types/Diagnosis";
import { InvasiveStudy } from "../types/Invasive";
import { PreventionStudy } from "../types/Prevention";
import { TreatmentStudy } from "../types/Treatment";

export interface State {
  malaria: MalariaState;
  prevention: PreventionState;
  diagnosis: DiagnosisState;
  treatment: TreatmentState;
  invasive: InvasiveState;
  translations: TranslationsState;
  countryLayer: CountryLayerState;
}

export interface RegionState {
  country?: string;
  region?: string;
  subRegion?: string;
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
  initialDialogOpen: boolean;
  filtersOpen: boolean;
  filtersMode: string;
}

export interface TranslationsState {
  translations: Translation[];
  loading: boolean;
  fields: any;
}

export interface DiagnosisState {
  studies: DiagnosisStudy[];
  filters: DiagnosisFilters;
}

export interface DiagnosisFilters {
  mapType: DiagnosisMapType;
  surveyTypes: string[];
  patientType: string | null;
  deletionType: string | null;
}

export enum DiagnosisMapType {
  GENE_DELETIONS
}

export enum PreventionMapType {
  RESISTANCE_STATUS,
  INTENSITY_STATUS,
  RESISTANCE_MECHANISM,
  LEVEL_OF_INVOLVEMENT,
  PBO_DEPLOYMENT
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
  filteredStudies: PreventionStudy[];
  filters: PreventionFilters;
}

export enum TreatmentMapType {
  TREATMENT_FAILURE,
  DELAYED_PARASITE_CLEARANCE,
  MOLECULAR_MARKERS
}

export interface TreatmentFilters {
  mapType: TreatmentMapType;
  plasmodiumSpecies: string;
  drug: string;
  molecularMarker: number;
}

export interface TreatmentState {
  studies: TreatmentStudy[];
  filters: TreatmentFilters;
}

export enum InvasiveMapType {
  VECTOR_OCCURANCE
}

export interface InvasiveFilters {
  mapType: InvasiveMapType;
  vectorSpecies: string[];
}

export interface InvasiveState {
  studies: InvasiveStudy[];
  filters: InvasiveFilters;
}

export interface CountryLayerState {
  layer: any | null;
  loading: boolean;
  countries: any[];
}
