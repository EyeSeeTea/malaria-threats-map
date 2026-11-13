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
 * Whether the study belongs to the disease. Every study on the vector maps carries a disease: one
 * without it is a data error and belongs to none, and with no disease set no study belongs.
 */
export function belongsToDisease(disease: string | undefined, study: DiseaseSource): boolean {
    return disease !== undefined && study.DISEASE === disease;
}

/** Whether the change from one disease to the other is a switch, not the disease being set for the first time. */
export function isDiseaseSwitch(previous: string | undefined, next: string | undefined): boolean {
    return previous !== undefined && next !== undefined && previous !== next;
}

/**
 * Whether the Vector occurrence filters invite users to report invasive Anopheles species: for
 * malaria, and while no disease is set.
 */
export function invitesAnophelesReports(disease: string | undefined): boolean {
    return isDefaultOrUnset(disease);
}

/**
 * Whether a map change checks the class and the mechanism against the options of the disease.
 * Malaria, and no disease, keep the behaviour the maps had before the disease filter.
 */
export function checksOptionsOnMapChange(disease: string | undefined): boolean {
    return !isDefaultOrUnset(disease);
}

/**
 * The value a single-choice filter takes among the options of a disease: the current value if
 * offered, otherwise the preferred one if offered, otherwise the first option. With no options,
 * because the studies are not loaded yet, the current value, or else the preferred one.
 */
export function pickOption(offered: ReadonlyArray<string>, preferred: string, current?: string): string {
    if (offered.length === 0) return current ?? preferred;

    return [current, preferred].find(value => value !== undefined && offered.includes(value)) ?? offered[0];
}

function isDefaultOrUnset(disease: string | undefined): boolean {
    return disease === undefined || disease === defaultDisease;
}
