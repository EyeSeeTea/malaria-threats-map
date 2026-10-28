import { createPreventionFilters } from "../../../store/__fixtures__/filtersFixtures";
import { createTranslation } from "../../../types/__fixtures__/translationFixtures";
import { getAssayTypeOptions } from "../AssayTypeCheckboxFilter";

const MOLECULAR = "MOLECULAR_ASSAY";
const BIOCHEMICAL = "BIOCHEMICAL_ASSAY";
const SYNERGIST = "SYNERGIST-INSECTICIDE_BIOASSAY";

// In the opposite order of ASSAY_TYPES, to show that the output follows ASSAY_TYPES.
const assayTypeTranslations = [SYNERGIST, BIOCHEMICAL, MOLECULAR].map(value =>
    createTranslation({ FIELD: "ASSAY_TYPE", VALUE_: value })
);

function offeredAssayTypes(type: string[] | null, translations = assayTypeTranslations): ReadonlyArray<string> {
    return getAssayTypeOptions(createPreventionFilters({ type }), translations).map(translation => translation.VALUE_);
}

describe("getAssayTypeOptions", () => {
    it("returns the translations themselves, not new options", () => {
        expect(getAssayTypeOptions(createPreventionFilters({ type: ["ACE1R"] }), assayTypeTranslations)).toEqual([
            assayTypeTranslations[2],
            assayTypeTranslations[1],
        ]);
    });

    describe("for each mechanism", () => {
        it.each(["MONO_OXYGENASES", "ESTERASES", "GSTS"])("%s offers the three assay types", mechanism => {
            expect(offeredAssayTypes([mechanism])).toEqual([MOLECULAR, BIOCHEMICAL, SYNERGIST]);
        });

        it.each(["KDR_L1014S", "KDR_L1014F", "KDR_(MUTATION_UNSPECIFIED)"])(
            "%s offers only the molecular assay",
            mechanism => {
                expect(offeredAssayTypes([mechanism])).toEqual([MOLECULAR]);
            }
        );

        it("ACE1R offers the molecular and biochemical assays", () => {
            expect(offeredAssayTypes(["ACE1R"])).toEqual([MOLECULAR, BIOCHEMICAL]);
        });
    });

    it("offers nothing when no mechanism is selected", () => {
        expect(offeredAssayTypes(null)).toEqual([]);
        expect(offeredAssayTypes([])).toEqual([]);
    });

    it("offers nothing when more than one mechanism is selected", () => {
        expect(offeredAssayTypes(["MONO_OXYGENASES", "ACE1R"])).toEqual([]);
    });

    it("offers nothing for an unknown mechanism", () => {
        expect(offeredAssayTypes(["UNKNOWN_MECHANISM"])).toEqual([]);
    });

    it("drops an assay type missing from the translations", () => {
        const withoutBiochemical = assayTypeTranslations.filter(translation => translation.VALUE_ !== BIOCHEMICAL);

        expect(offeredAssayTypes(["MONO_OXYGENASES"], withoutBiochemical)).toEqual([MOLECULAR, SYNERGIST]);
    });
});
