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
    PF_POS_SAMPLES: string;
    TYPE_SAMPL_ANALYZED: string;
    TOOLTIP_SITENAME: string;
    DELETION_STATUS: string;
}
