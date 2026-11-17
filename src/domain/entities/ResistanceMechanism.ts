import _c from "./generic/Collection";
import { MechanismAssayType, mechanismAssayTypes } from "./AssayType";
import { notAvailable, Study } from "./Study";

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

/** The mechanism the Resistance mechanisms and Level of involvement maps select when they open. */
export const defaultMechanism = "MONO_OXYGENASES";

type MechanismSource = Pick<Study, "TYPE">;

type ProxyTypeSource = Pick<Study, "PROXY_TYPE">;

/** The mechanisms among the codes, each once, in catalogue order. Codes outside the catalogue are dropped. */
export function getKnownMechanisms(codes: ReadonlyArray<string>): ReadonlyArray<string> {
    return _c([...resistanceMechanisms])
        .map(mechanism => mechanism.code)
        .select(code => codes.includes(code))
        .toArray();
}

/** The mechanisms the studies carry, each once, in catalogue order. Codes outside the catalogue are dropped. */
export function getMechanisms(studies: ReadonlyArray<MechanismSource>): ReadonlyArray<string> {
    return getKnownMechanisms(studies.map(study => study.TYPE));
}

/** The assay types that detect a mechanism, or undefined for a code outside the catalogue. */
export function getAssayTypesDetecting(code: string | undefined): ReadonlyArray<MechanismAssayType> | undefined {
    return _c([...resistanceMechanisms]).find(mechanism => mechanism.code === code)?.detectedBy;
}

/**
 * The mechanisms whose involvement the studies measure: the known PROXY_TYPE values the studies carry,
 * NA left out, in the order of the known values.
 */
export function getInvolvementMechanisms(
    knownProxyTypes: ReadonlyArray<string>,
    studies: ReadonlyArray<ProxyTypeSource>
): ReadonlyArray<string> {
    const carried = studies.map(study => study.PROXY_TYPE);

    return _c([...knownProxyTypes])
        .reject(code => code === notAvailable)
        .select(code => carried.includes(code))
        .toArray();
}
