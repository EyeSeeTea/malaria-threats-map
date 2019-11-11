import { Study } from "./Malaria";

export interface TreatmentResponse {
  displayFieldName: string;
  features: TreatmentFeature[];
  fieldAliases: FieldAlias[];
  fields: Field[];
}

export interface TreatmentFeature {
  attributes: TreatmentStudy;
}

export interface FieldAlias {
  [key: string]: string;
}

export interface TreatmentStudy extends Study {
  ASSAY_TYPE: string;
  CITATION_LONG: string;
  CITATION_URL: string;
  COUNTRY_NAME: string;
  Code: number;
  DRUG_NAME: string;
  N: string;
  CONFIRMED_RESIST_PV: string;
  POSITIVE_DAY_3: string;
  TREATMENT_FAILURE_KM: string;
  TREATMENT_FAILURE_PP: string;
  FOLLOW_UP: string;
  INSECTICIDE_CLASS: string;
  INSECTICIDE_CONC: string;
  INSECTICIDE_INTENSITY: string;
  INSECTICIDE_TYPE: string;
  INSTITUTE: string;
  INSTITUTION: string;
  INSTITUTION_CITY: string;
  INVESTIGATION_TYPE: string;
  ISO2: string;
  MALARIA_ENDEMIC: number;
  MECHANISM_FREQUENCY: string;
  MECHANISM_PROXY: string;
  MECHANISM_STATUS: string;
  METHOD_STANDARD: number;
  MONTH_END: string;
  MONTH_START: string;
  MORTALITY_ADJUSTED: string;
  NUMBER: string;
  PLASMODIUM_SPECIES: string;
  PROXY_TYPE: string;
  REGION_FULL: string;
  RESISTANCE_FREQUENCY: string;
  RESISTANCE_INTENSITY: string;
  RESISTANCE_STATUS: string;
  RESISTANCE_STATUS_NUMERIC: number;
  SITE_ID: string;
  SPECIES: string;
  STAGE_ORIGIN: string;
  SUBREGION: string;
  SYNERGIST_CONC: string;
  SYNERGIST_TYPE: string;
  TIME: string;
  TYPE: string;
  TYPE_SYNERGIST: string;
  VERSION: number;
  VILLAGE_NAME: string;
  YEAR_END: string;
  YEAR_START: string;
  DimensionID: number;
  K13_CODE: number;
  SITE_NAME: string;
  PROVINCE: string;
  groupStudies: TreatmentStudy[];
  PROPORTION: number;
  GENOTYPE: string;
}

export interface Field {
  name: string;
  type: string;
  alias: string;
  length: number;
}
