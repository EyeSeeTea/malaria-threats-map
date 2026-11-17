import _c from "./generic/Collection";
import { notAvailable, Study } from "./Study";

/** The class the maps select when they open, and when a map does not offer the selected one. */
export const defaultInsecticideClass = "PYRETHROIDS";

type InsecticideClassSource = Pick<Study, "INSECTICIDE_CLASS">;

/**
 * The classes in the order the maps and the dashboards show them, in a new list: NA first, where
 * the dashboards always showed it, then alphabetical.
 */
export function sortInsecticideClasses(insecticideClasses: ReadonlyArray<string>): string[] {
    return _c([...insecticideClasses])
        .orderBy([
            [insecticideClass => insecticideClass !== notAvailable, "asc"],
            [insecticideClass => insecticideClass, "asc"],
        ])
        .toArray();
}

/** The classes without NA, in order. Repeated classes stay repeated: the callers pass distinct ones. */
export function getAvailableInsecticideClasses(insecticideClasses: ReadonlyArray<string>): ReadonlyArray<string> {
    return sortInsecticideClasses(insecticideClasses.filter(insecticideClass => insecticideClass !== notAvailable));
}

/** The distinct classes the studies carry, without NA, in order. */
export function getInsecticideClasses(studies: ReadonlyArray<InsecticideClassSource>): ReadonlyArray<string> {
    return getAvailableInsecticideClasses(
        _c([...studies])
            .map(study => study.INSECTICIDE_CLASS)
            .uniq()
            .toArray()
    );
}
