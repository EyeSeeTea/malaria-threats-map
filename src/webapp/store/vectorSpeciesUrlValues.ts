import { legacyVectorSpeciesValues } from "../../domain/entities/VectorSpecies";

/** Turns the old species codes of a link into data values, and leaves any other value as it is. */
export function toVectorSpeciesValues(values: ReadonlyArray<string>): string[] {
    return values.map(value => legacyVectorSpeciesValues.get(value) ?? value);
}
