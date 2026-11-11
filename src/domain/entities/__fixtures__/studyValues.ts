import { Study } from "../Study";

// xMART values shared by the specs, so each one is written once.

export const NOT_AVAILABLE = "NA";
export const NOT_REPORTED = "NR";

export const PYRETHROIDS = "PYRETHROIDS";
export const ORGANOPHOSPHATES = "ORGANOPHOSPHATES";

export const DELTAMETHRIN = "DELTAMETHRIN";
export const PERMETHRIN = "PERMETHRIN";

export const WHO_TEST_KIT = "WHO_TEST_KIT_ADULTS";
export const CDC_BOTTLE = "CDC_BOTTLE_ADULTS";

export const GAMBIAE = "An. gambiae s.l.";
export const FUNESTUS = "An. funestus s.l.";
export const ARABIENSIS = "An. arabiensis";

export const STEPHENSI = "An. stephensi";
export const STEPHENSI_TYPE_FORM = "An. stephensi type form";
export const STEPHENSI_MYSORENSIS = "An. stephensi mysorensis";
export const STEPHENSI_INTERMEDIATE_FORM = "An. stephensi intermediate form";
export const STEPHENSI_NOT_FOUND = "An. stephensi (not found)";

export const INVASIVE_STATUS_INVASIVE = "Invasive";
export const INVASIVE_STATUS_NATIVE = "Native";
export const INVASIVE_STATUS_NOT_FOUND = "Not found";

export const MONO_OXYGENASES = "MONO_OXYGENASES";
export const ESTERASES = "ESTERASES";
export const GSTS = "GSTS";
export const KDR_L1014S = "KDR_L1014S";
export const KDR_L1014F = "KDR_L1014F";
export const KDR_UNSPECIFIED = "KDR_(MUTATION_UNSPECIFIED)";
export const ACE1R = "ACE1R";
export const UNKNOWN_MECHANISM = "UNKNOWN_MECHANISM";

export const DISCRIMINATING = "DISCRIMINATING_CONCENTRATION_BIOASSAY";
export const INTENSITY = "INTENSITY_CONCENTRATION_BIOASSAY";
export const SYNERGIST = "SYNERGIST-INSECTICIDE_BIOASSAY";
export const MOLECULAR = "MOLECULAR_ASSAY";
export const BIOCHEMICAL = "BIOCHEMICAL_ASSAY";

export const MINISTRY_OF_HEALTH = "MoH";
export const RESEARCH_INSTITUTION = "Research";

export const DJIBOUTI = "Djibouti";

export const OTHER_COUNTRY: Readonly<Pick<Study, "ISO2" | "COUNTRY_NAME">> = { ISO2: "IN", COUNTRY_NAME: "India" };
