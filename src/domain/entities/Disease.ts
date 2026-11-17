import _c from "./generic/Collection";
import { Study } from "./Study";

/**
 * The disease the maps start with, and the only one the Data Download and Dashboards sections show.
 * Provisional, like the DISEASE field name, until the client confirms the name and the values of the field.
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
export function belongsToDisease(study: DiseaseSource, disease: string | undefined): boolean {
    return disease !== undefined && study.DISEASE === disease;
}
