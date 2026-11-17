import { belongsToDisease } from "../../../../domain/entities/Disease";
import { Study } from "../../../../domain/entities/Study";

/**
 * The studies a map computes its year range from: those of the chosen disease, or all of them while
 * no disease is set, as before the disease filter.
 */
export function getStudiesForYearRange<S extends Pick<Study, "DISEASE">>(
    studies: ReadonlyArray<S>,
    disease: string | undefined
): S[] {
    return disease === undefined ? [...studies] : studies.filter(study => belongsToDisease(study, disease));
}
