import _c from "./generic/Collection";
import { InvasiveStudy } from "./InvasiveStudy";

type VectorSpeciesSource = Pick<InvasiveStudy, "VECTOR_SPECIES">;

/** The codes the app gave the 5 An. stephensi species before they came from the data, with their data value. */
export const legacyVectorSpeciesValues: ReadonlyMap<string, string> = new Map([
    ["AN_STEPHENSI_TYPE_FORM", "An. stephensi type form"],
    ["AN_STEPHENSI_MYSORENSIS", "An. stephensi mysorensis"],
    ["AN_STEPHENSI_INTERMEDIATE_FORM", "An. stephensi intermediate form"],
    ["AN_STEPHENSI_FORM_UNSPECIFIED", "NR"],
    ["AN_STEPHENSI_NOT_FOUND", "An. stephensi (not found)"],
]);

/** The 5 species the app offered before they came from the data. */
export const legacyVectorSpecies: ReadonlyArray<string> = Array.from(legacyVectorSpeciesValues.values());

/** The distinct vector species of the studies, in the order they first appear. */
export function getVectorSpecies(studies: ReadonlyArray<VectorSpeciesSource>): ReadonlyArray<string> {
    return _c([...studies])
        .map(study => study.VECTOR_SPECIES)
        .compact()
        .reject(species => species === "")
        .uniq()
        .toArray();
}
