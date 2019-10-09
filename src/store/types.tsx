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
}

export interface TranslationsState {
  translations: Translation[];
  loading: boolean;
  fields: any;
}

export interface DiagnosisState {
  studies: DiagnosisStudy[];
}

export interface InvasiveState {
  studies: InvasiveStudy[];
}

export enum PreventionMapType {
  RESISTANCE_STATUS,
  INTENSITY_STATUS,
  RESISTANCE_MECHANISM,
  LEVEL_OF_INVOLVEMENT
}

export interface PreventionFilters {
  mapType: PreventionMapType;
  insecticideClass: string;
  insecticideTypes: string[];
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
