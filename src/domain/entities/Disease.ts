import _c from "./generic/Collection";
import { Study } from "./Study";

/**
 * The disease the maps start with. Provisional, like the DISEASE field name, until the client
 * confirms the name and the values of the field.
 */
export const defaultDisease = "MALARIA";

type DiseaseSource = Pick<Study, "DISEASE">;

/** The distinct diseases of the studies, in the order they first appear. */
export function getDiseases(studies: ReadonlyArray<DiseaseSource>): ReadonlyArray<string> {
    return _c([...studies])
        .map(study => study.DISEASE)
        .compact()
        .reject(disease => disease === "")
        .uniq()
        .toArray();
}

/** The default disease if the studies carry it, otherwise the first one they carry, or undefined for none. */
export function getInitialDisease(studies: ReadonlyArray<DiseaseSource>): string | undefined {
    const diseases = getDiseases(studies);
    return diseases.includes(defaultDisease) ? defaultDisease : diseases[0];
}

/**
 * Whether the Vector occurrence filters invite users to report invasive Anopheles species: for
 * malaria, and while no disease is set.
 */
export function invitesAnophelesReports(disease: string | undefined): boolean {
    return disease === undefined || disease === defaultDisease;
}

/**
 * The value a single-choice filter keeps when the disease changes: its current value if the new
 * disease offers it, otherwise the first value the new disease offers.
 */
export function keepIfOffered(current: string | undefined, offered: ReadonlyArray<string>): string | undefined {
    return current !== undefined && offered.includes(current) ? current : offered[0];
}
