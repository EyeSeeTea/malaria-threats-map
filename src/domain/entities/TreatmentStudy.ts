import { Study } from "./Study";

export interface TreatmentStudy extends Study {
    CITATION_LONG: string;
    CITATION_URL: string;
    DRUG_NAME: string;
    N: string;
    CONFIRMED_RESIST_PV: string;
    POSITIVE_DAY_3: string;
    TREATMENT_FAILURE_KM: string;
    TREATMENT_FAILURE_PP: string;
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
    PROP_RELATED: number;
    Code: number;
}
