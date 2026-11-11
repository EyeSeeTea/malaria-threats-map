import _c from "./generic/Collection";
import { InvasiveStudy } from "./InvasiveStudy";

type VectorSpeciesSource = Pick<InvasiveStudy, "VECTOR_SPECIES">;

/** The distinct vector species of the studies, in the order they first appear. */
export function getVectorSpecies(studies: ReadonlyArray<VectorSpeciesSource>): ReadonlyArray<string> {
    return _c([...studies])
        .map(study => study.VECTOR_SPECIES)
        .compact()
        .reject(species => species === "")
        .uniq()
        .toArray();
}
