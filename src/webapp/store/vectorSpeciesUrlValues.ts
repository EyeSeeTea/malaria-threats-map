/** The keys that links made before the species came from the data carry, with their data value. */
const legacyVectorSpeciesValues: ReadonlyMap<string, string> = new Map([
    ["AN_STEPHENSI_TYPE_FORM", "An. stephensi type form"],
    ["AN_STEPHENSI_MYSORENSIS", "An. stephensi mysorensis"],
    ["AN_STEPHENSI_INTERMEDIATE_FORM", "An. stephensi intermediate form"],
    ["AN_STEPHENSI_FORM_UNSPECIFIED", "NR"],
    ["AN_STEPHENSI_NOT_FOUND", "An. stephensi (not found)"],
]);

/** The 5 species the filter offered before they came from the data. Data Download still offers them. */
export const legacyVectorSpecies: ReadonlyArray<string> = Array.from(legacyVectorSpeciesValues.values());

/** Turns the old species keys of a link into data values, and leaves any other value as it is. */
export function toVectorSpeciesValues(values: ReadonlyArray<string>): string[] {
    return values.map(value => legacyVectorSpeciesValues.get(value) ?? value);
}
