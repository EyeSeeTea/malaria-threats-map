import { Study } from "./Study";

export interface DiagnosisStudy extends Study {
    SITE_NAME: string;
    HRP2_TESTED: string;
    HRP2_PROPORTION_DELETION: string;
    HRP3_TESTED: string;
    HRP3_PROPORTION_DELETION: string;
    HRP2_HRP3_TESTED: string;
    HRP2_HRP3_PROPORTION_DELETION: string;
    PATIENT_TYPE: string;
    SURVEY_TYPE: string;
    Code: string;
    SAMPLE_ORIGIN: string;
    SAMPLE_ORIGIN_TEXT: string;
    PF_POS_SAMPLES: number;
    TYPE_SAMPL_ANALYZED: string;
    TOOLTIP_SITENAME: string;
    DELETION_STATUS: string;
    SURV_STATUS?: number;
    SYMP_STAT_NAME?: string;
    HRP_GENO_NAME?: string;
    PROMPT_NAME?: string;
    GEOGR_SCOPE_NAME?: string;
    FUNDING_SOURCE?: string;
    SURV_ID?: number;
}
