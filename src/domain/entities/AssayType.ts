/**
 * The assay types that detect resistance mechanisms. The data has other assay types too (the discriminating
 * and intensity concentration bioassays); these are the ones the mechanism catalogue needs.
 */
export const mechanismAssayTypes = ["MOLECULAR_ASSAY", "BIOCHEMICAL_ASSAY", "SYNERGIST-INSECTICIDE_BIOASSAY"] as const;

export type MechanismAssayType = typeof mechanismAssayTypes[number];

export const synergistAssayType: MechanismAssayType = "SYNERGIST-INSECTICIDE_BIOASSAY";
