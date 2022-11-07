import { Study } from "./Study";

export interface TreatmentStudy extends Study {
    CITATION_LONG: string;
    CITATION_URL: string;
    DRUG_NAME: string;
    N: string;
    CONFIRMED_RESIST_PV: number;
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
    PROP_RELATED: number;
    Code: number;
    HEALTHFACILITY_NAME: string;
}

export interface MolecularMarkerStudy extends TreatmentStudy {
    VALUE: number;
}
