import { Study } from "./Study";

export interface InvasiveStudy extends Study {
    INSTITUTE_CURATION: string;
    SAMPLING_METHOD: string;
    ID_METHOD: string;
    VECTOR_SPECIES: string;
    VECTOR_SPECIES_COMPLEX: string;
    Code: string;
    STAGE: string;
    BREEDING_HABITAT: string;
    INVASIVE_STATUS: string;
    MTM_DOWNLOAD: number;
    ADMIN1: string;
}
