/**
 * The insecticide classes in the order the maps and the dashboards show them. The order is not in
 * the data, so it is declared here, once.
 */
const insecticideClassOrder: ReadonlyArray<string> = [
    "CARBAMATES",
    "NEONICOTINOIDS",
    "ORGANOCHLORINES",
    "ORGANOPHOSPHATES",
    "PYRETHROIDS",
    "PYRROLES",
];

const notAvailable = "NA";

/** The classes in the declared order, in a new list. A class outside the order goes before the declared ones. */
export function sortInsecticideClasses(insecticideClasses: ReadonlyArray<string>): string[] {
    return [...insecticideClasses].sort((a, b) =>
        insecticideClassOrder.indexOf(a) - insecticideClassOrder.indexOf(b) > 0 ? 1 : -1
    );
}

/**
 * The classes an insecticide class filter offers: NA left out, in the declared order. Repeated
 * classes stay repeated, as before: the callers pass distinct ones.
 */
export function getSelectableInsecticideClasses(insecticideClasses: ReadonlyArray<string>): string[] {
    return sortInsecticideClasses(insecticideClasses.filter(insecticideClass => insecticideClass !== notAvailable));
}
