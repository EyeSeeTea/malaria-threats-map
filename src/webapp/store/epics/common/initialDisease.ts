import { getDiseases, getInitialDisease } from "../../../../domain/entities/Disease";
import { Study } from "../../../../domain/entities/Study";

/**
 * The disease a theme selects once its studies load, so the disease filter is never empty: the
 * default one, or the first one, while none is set, and also when the set one, from a link, is not
 * among the studies. Undefined when nothing has to change, also while no study carries a disease.
 */
export function getDiseaseToSelect(
    current: string | undefined,
    studies: ReadonlyArray<Pick<Study, "DISEASE">>
): string | undefined {
    const diseases = getDiseases(studies);
    const keepsCurrent = current !== undefined && (diseases.length === 0 || diseases.includes(current));

    return keepsCurrent ? undefined : getInitialDisease(studies);
}
