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
  country: string;
}

export interface MalariaState {
  theme: string;
  any: any;
  endemicity: boolean;
  filters: number[];
  region: RegionState;
  initialDialogOpen: boolean;
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
}

export enum DiagnosisMapType {
  PFHRP2,
  PFHRP2_PFHRP3
}

export interface InvasiveState {
  studies: InvasiveStudy[];
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
  filters: PreventionFilters;
}

export interface TreatmentState {
  studies: TreatmentStudy[];
}

export interface CountryLayerState {
  layer: any | null;
  loading: boolean;
}
