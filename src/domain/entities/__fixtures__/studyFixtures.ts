import { InvasiveStudy } from "../InvasiveStudy";
import { PreventionStudy } from "../PreventionStudy";
import { Study } from "../Study";
import {
    DELTAMETHRIN,
    DISCRIMINATING,
    GAMBIAE,
    NOT_AVAILABLE,
    PYRETHROIDS,
    RESEARCH_INSTITUTION,
    STEPHENSI,
    STEPHENSI_TYPE_FORM,
    WHO_TEST_KIT,
} from "./studyValues";

const DJIBOUTI = "Djibouti";
const BOBO_DIOULASSO = "Bobo-Dioulasso";

const defaultStudy: Readonly<Study> = {
    OBJECTID: 1,
    VILLAGE_NAME: BOBO_DIOULASSO,
    SITE_ID: "SITE_BF_001",
    SITE_NAME: BOBO_DIOULASSO,
    ISO2: "BF",
    CITATION_LONG: "Example citation, long form",
    INSTITUTE_CURATION: "Example curation institute",
    CURATION: "Example curation",
    CITATION_URL: "https://example.org/citation",
    CITATION: "Example citation",
    Latitude: 11.18,
    Longitude: -4.3,
    INSTITUTION: "Example institution",
    INSTITUTION_CITY: "Ouagadougou",
    INSTITUTION_TYPE: RESEARCH_INSTITUTION,
    ASSAY_TYPE: DISCRIMINATING,
    COUNTRY_NAME: "Burkina Faso",
    INSECTICIDE_CLASS: PYRETHROIDS,
    INSECTICIDE_TYPE: DELTAMETHRIN,
    INSTITUTE: "Example institute",
    MECHANISM_FREQUENCY: NOT_AVAILABLE,
    MECHANISM_PROXY: NOT_AVAILABLE,
    MECHANISM_STATUS: NOT_AVAILABLE,
    MONTH_END: "9",
    MONTH_START: "7",
    MORTALITY_ADJUSTED: "0.85",
    NUMBER: "100",
    PROXY_TYPE: NOT_AVAILABLE,
    REGION_FULL: "AFRICA",
    RESISTANCE_FREQUENCY: NOT_AVAILABLE,
    RESISTANCE_INTENSITY: NOT_AVAILABLE,
    RESISTANCE_STATUS: "POSSIBLE_RESISTANCE",
    RESISTANCE_STATUS_NUMERIC: "2",
    SPECIES: GAMBIAE,
    STAGE_ORIGIN: "F0_ADULTS",
    SUBREGION: "WEST_AFRICA",
    SYNERGIST_CONC: NOT_AVAILABLE,
    SYNERGIST_TYPE: NOT_AVAILABLE,
    TIME: "60",
    TYPE: WHO_TEST_KIT,
    TYPE_SYNERGIST: NOT_AVAILABLE,
    VERSION: 1,
    YEAR_END: 2020,
    YEAR_START: 2020,
    DOWNLOAD: 1,
};

const defaultPreventionStudy: Readonly<PreventionStudy> = {
    ...defaultStudy,
    STUDY_PAIRING_CODE: NOT_AVAILABLE,
    ADMIN1: "Hauts-Bassins",
    ADMIN1_GUID: "admin1-guid",
    ADMIN2: "Houet",
    ADMIN2_GUID: "admin2-guid",
    Code: "PREV_001",
    INSECTICIDE_CONC: "0.05%",
    INSECTICIDE_INTENSITY: 1,
};

const defaultInvasiveStudy: Readonly<InvasiveStudy> = {
    ...defaultStudy,
    ASSAY_TYPE: NOT_AVAILABLE,
    INSECTICIDE_CLASS: NOT_AVAILABLE,
    INSECTICIDE_TYPE: NOT_AVAILABLE,
    MORTALITY_ADJUSTED: NOT_AVAILABLE,
    RESISTANCE_STATUS: NOT_AVAILABLE,
    RESISTANCE_STATUS_NUMERIC: NOT_AVAILABLE,
    SPECIES: STEPHENSI,
    TYPE: NOT_AVAILABLE,
    VILLAGE_NAME: DJIBOUTI,
    SITE_ID: "SITE_DJ_001",
    SITE_NAME: DJIBOUTI,
    ISO2: "DJ",
    COUNTRY_NAME: DJIBOUTI,
    SUBREGION: "EAST_AFRICA",
    Latitude: 11.59,
    Longitude: 43.15,
    SAMPLING_METHOD: "LARVAL_SAMPLING",
    TOT_STUDIES: 1,
    ID_METHOD: "MORPHOLOGY",
    VECTOR_SPECIES: STEPHENSI_TYPE_FORM,
    VECTOR_SPECIES_COMPLEX: STEPHENSI,
    Code: "INV_001",
    STAGE: "LARVAE",
    BREEDING_HABITAT: "WATER_TANK",
    INVASIVE_STATUS: "Invasive",
    MTM_DOWNLOAD: 1,
    VILLAGE_ORIG: DJIBOUTI,
    VILLAGE_FLAG: 0,
    ADMIN1: DJIBOUTI,
};

export function createPreventionStudy(overrides: Partial<PreventionStudy> = {}): PreventionStudy {
    return { ...defaultPreventionStudy, ...overrides };
}

export function createInvasiveStudy(overrides: Partial<InvasiveStudy> = {}): InvasiveStudy {
    return { ...defaultInvasiveStudy, ...overrides };
}
