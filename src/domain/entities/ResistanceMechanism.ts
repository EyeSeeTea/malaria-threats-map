import _c from "./generic/Collection";
import { MechanismAssayType, mechanismAssayTypes } from "./AssayType";

type ResistanceMechanism = Readonly<{
    code: string;
    detectedBy: ReadonlyArray<MechanismAssayType>;
}>;

/**
 * The resistance mechanisms the maps offer, in the order they are offered, with the assay
 * types that detect each one. Which assay detects a mechanism is not in the data, so it is
 * declared here, once.
 */
const resistanceMechanisms: ReadonlyArray<ResistanceMechanism> = [
    { code: "MONO_OXYGENASES", detectedBy: mechanismAssayTypes },
    { code: "ESTERASES", detectedBy: mechanismAssayTypes },
    { code: "GSTS", detectedBy: mechanismAssayTypes },
    { code: "KDR_L1014S", detectedBy: ["MOLECULAR_ASSAY"] },
    { code: "KDR_L1014F", detectedBy: ["MOLECULAR_ASSAY"] },
    { code: "KDR_(MUTATION_UNSPECIFIED)", detectedBy: ["MOLECULAR_ASSAY"] },
    { code: "ACE1R", detectedBy: ["MOLECULAR_ASSAY", "BIOCHEMICAL_ASSAY"] },
];

/** The mechanisms among the codes, each once, in catalogue order. Codes outside the catalogue are dropped. */
export function getKnownMechanisms(codes: ReadonlyArray<string>): ReadonlyArray<string> {
    return _c([...resistanceMechanisms])
        .map(mechanism => mechanism.code)
        .select(code => codes.includes(code))
        .toArray();
}

/** The assay types that detect a mechanism, or undefined for a code outside the catalogue. */
export function getAssayTypesDetecting(code: string | undefined): ReadonlyArray<MechanismAssayType> | undefined {
    return _c([...resistanceMechanisms]).find(mechanism => mechanism.code === code)?.detectedBy;
}
