import _c from "./generic/Collection";
import { PreventionStudy } from "./PreventionStudy";

export const assayTypes = ["MOLECULAR_ASSAY", "BIOCHEMICAL_ASSAY", "SYNERGIST-INSECTICIDE_BIOASSAY"] as const;

export type AssayType = typeof assayTypes[number];

const synergistAssayType: AssayType = "SYNERGIST-INSECTICIDE_BIOASSAY";

type ResistanceMechanism = Readonly<{
    code: string;
    detectedBy: ReadonlyArray<AssayType>;
}>;

/**
 * The resistance mechanisms the maps offer, in the order they are offered, with the assay
 * types that detect each one. Which assay detects a mechanism is not in the data, so it is
 * declared here, once.
 */
const resistanceMechanisms: ReadonlyArray<ResistanceMechanism> = [
    { code: "MONO_OXYGENASES", detectedBy: assayTypes },
    { code: "ESTERASES", detectedBy: assayTypes },
    { code: "GSTS", detectedBy: assayTypes },
    { code: "KDR_L1014S", detectedBy: ["MOLECULAR_ASSAY"] },
    { code: "KDR_L1014F", detectedBy: ["MOLECULAR_ASSAY"] },
    { code: "KDR_(MUTATION_UNSPECIFIED)", detectedBy: ["MOLECULAR_ASSAY"] },
    { code: "ACE1R", detectedBy: ["MOLECULAR_ASSAY", "BIOCHEMICAL_ASSAY"] },
];

type SynergistTypeSource = Pick<PreventionStudy, "TYPE" | "ASSAY_TYPE">;

/** The mechanisms among the codes, each once, in catalogue order. Codes outside the catalogue are dropped. */
export function getMechanismOptions(codes: ReadonlyArray<string>): ReadonlyArray<string> {
    return _c([...resistanceMechanisms])
        .map(mechanism => mechanism.code)
        .select(code => codes.includes(code))
        .toArray();
}

/** The assay types that detect a mechanism, or undefined for a code outside the catalogue. */
export function getAssayTypesDetecting(code: string | undefined): ReadonlyArray<AssayType> | undefined {
    return _c([...resistanceMechanisms]).find(mechanism => mechanism.code === code)?.detectedBy;
}

/** The distinct test types of the synergist-insecticide bioassays, in the order they first appear. */
export function getSynergistTypes(studies: ReadonlyArray<SynergistTypeSource>): ReadonlyArray<string> {
    return _c([...studies])
        .select(study => study.ASSAY_TYPE === synergistAssayType)
        .map(study => study.TYPE)
        .compact()
        .reject(type => type === "")
        .uniq()
        .toArray();
}
