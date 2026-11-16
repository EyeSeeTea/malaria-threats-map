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

export const DETECTED = "DETECTED";
export const NOT_DETECTED = "NOT_DETECTED";

export const FULL_INVOLVEMENT = "FULL_INVOLVEMENT";
export const PARTIAL_INVOLVEMENT = "PARTIAL_INVOLVEMENT";
export const NO_INVOLVEMENT = "NO_INVOLVEMENT";

export const DISCRIMINATING_ASSAY = "DISCRIMINATING_CONCENTRATION_BIOASSAY";
export const INTENSITY_ASSAY = "INTENSITY_CONCENTRATION_BIOASSAY";
export const SYNERGIST_ASSAY = "SYNERGIST-INSECTICIDE_BIOASSAY";
export const MOLECULAR_ASSAY = "MOLECULAR_ASSAY";
export const BIOCHEMICAL_ASSAY = "BIOCHEMICAL_ASSAY";

export const MINISTRY_OF_HEALTH = "MoH";
export const RESEARCH_INSTITUTION = "Research";

export const CONFIRMED_RESISTANCE = "CONFIRMED_RESISTANCE";
export const POSSIBLE_RESISTANCE = "POSSIBLE_RESISTANCE";
export const SUSCEPTIBLE = "SUSCEPTIBLE";
export const UNDETERMINED = "UNDETERMINED";

export const HIGH_INTENSITY = "HIGH_INTENSITY";
export const MODERATE_INTENSITY = "MODERATE_INTENSITY";
export const MODERATE_TO_HIGH_INTENSITY = "MODERATE_TO_HIGH_INTENSITY";
export const LOW_INTENSITY = "LOW_INTENSITY";
export const NOT_ASSESSED = "COULD_NOT_BE_RELIABLY_ASSESSED";

export const UNKNOWN_STATUS = "UNKNOWN";

export const LARVAL_SAMPLING = "LARVAL_SAMPLING";
export const MORPHOLOGY = "MORPHOLOGY";

/** Fewer mosquitoes than the minimum the filters set in the specs. */
export const FEW_MOSQUITOES_NUMBER = "20";

export const AFRICA = "AFRICA";
export const WEST_AFRICA = "WEST_AFRICA";

type Country = Readonly<Pick<Study, "ISO2" | "COUNTRY_NAME">>;

/** The country of the default prevention study. */
export const BURKINA_FASO: Country = { ISO2: "BF", COUNTRY_NAME: "Burkina Faso" };
/** The country of the default invasive study. */
export const DJIBOUTI: Country = { ISO2: "DJ", COUNTRY_NAME: "Djibouti" };
export const OTHER_COUNTRY: Country = { ISO2: "IN", COUNTRY_NAME: "India" };
