import { Study } from "./Study";

export interface TreatmentStudy extends Study {
    CITATION_LONG: string;
    CITATION_URL: string;
    DRUG_NAME: string;
    N: string;
    CONFIRMED_RESIST_PV: string;
    POSITIVE_DAY_3: number;
    TREATMENT_FAILURE_KM: number;
    TREATMENT_FAILURE_PP: number;
    FOLLOW_UP: string;
    INSTITUTION: string;
    INSTITUTION_CITY: string;
    PLASMODIUM_SPECIES: string;
    DimensionID: number;
    K13_CODE: number;
    SITE_NAME: string;
    PROVINCE: string;
    groupStudies: TreatmentStudy[];
    PROPORTION: number;
    GENOTYPE: string;
    MUT_CAT: string;
    MUT_ORDER: string;
    PROP_RELATED: number;
    Code: number;
    HEALTHFACILITY_NAME: string;
    SURV_STATUS?: number;
    FUNDING_SOURCE?: string;
    MM_LIST?: string;
    SURV_ID?: number;
    STUDY_SEQ?: number;
    AGE_GP?: string;
    PROMPT_NAME?: any;
    GEOGR_SCOPE_NAME?: string;
    PROT_TYPE_NAME?: any;
    MM_PFK13?: number;
    MM_PFCRT?: number;
    MM_PFMDR1?: number;
    MM_PFPM23?: number;
    MM_PFMDR1_CN?: number;
    MM_PFMDR1_MU?: number;
    MM_PFDHFR?: number;
    MM_PFDHPS?: number;
    MM_PFHRP23?: number;
}

export interface MolecularMarkerStudy extends TreatmentStudy {
    VALUE: number;
}
