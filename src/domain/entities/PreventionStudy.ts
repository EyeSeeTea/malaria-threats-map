import { Study } from "./Study";

export interface PreventionStudy extends Study {
    CITATION_LONG: string;
    CITATION_URL: string;
    STUDY_PAIRING_CODE: string;
    ADMIN1: string;
    ADMIN1_GUID: string;
    ADMIN2: string;
    ADMIN2_GUID: string;
    Code: string;
}
