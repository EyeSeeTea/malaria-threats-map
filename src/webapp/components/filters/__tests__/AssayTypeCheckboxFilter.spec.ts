import { createPreventionFilters } from "../../../store/__fixtures__/filtersFixtures";
import { createTranslation } from "../../../types/__fixtures__/translationFixtures";
import { getAssayTypeFilterOptions } from "../AssayTypeCheckboxFilter";
import {
    ACE1R,
    BIOCHEMICAL_ASSAY,
    ESTERASES,
    GSTS,
    KDR_L1014F,
    KDR_L1014S,
    KDR_UNSPECIFIED,
    MOLECULAR_ASSAY,
    MONO_OXYGENASES,
    SYNERGIST_ASSAY,
    UNKNOWN_MECHANISM,
} from "../../../../domain/entities/__fixtures__/studyValues";

// In the opposite order of ASSAY_TYPES, to show that the output follows ASSAY_TYPES.
const assayTypeTranslations = [SYNERGIST_ASSAY, BIOCHEMICAL_ASSAY, MOLECULAR_ASSAY].map(value =>
    createTranslation({ FIELD: "ASSAY_TYPE", VALUE_: value })
);

function offeredAssayTypes(type: string[] | null, translations = assayTypeTranslations): ReadonlyArray<string> {
    return getAssayTypeFilterOptions(createPreventionFilters({ type }), translations).map(
        translation => translation.VALUE_
    );
}

describe("getAssayTypeFilterOptions", () => {
    it("returns the translations themselves, not new options", () => {
        expect(getAssayTypeFilterOptions(createPreventionFilters({ type: [ACE1R] }), assayTypeTranslations)).toEqual([
            assayTypeTranslations[2],
            assayTypeTranslations[1],
        ]);
    });

    describe("for each mechanism", () => {
        it.each([MONO_OXYGENASES, ESTERASES, GSTS])("%s offers the three assay types", mechanism => {
            expect(offeredAssayTypes([mechanism])).toEqual([MOLECULAR_ASSAY, BIOCHEMICAL_ASSAY, SYNERGIST_ASSAY]);
        });

        it.each([KDR_L1014S, KDR_L1014F, KDR_UNSPECIFIED])("%s offers only the molecular assay", mechanism => {
            expect(offeredAssayTypes([mechanism])).toEqual([MOLECULAR_ASSAY]);
        });

        it("ACE1R offers the molecular and biochemical assays", () => {
            expect(offeredAssayTypes([ACE1R])).toEqual([MOLECULAR_ASSAY, BIOCHEMICAL_ASSAY]);
        });
    });

    it("offers nothing when no mechanism is selected", () => {
        expect(offeredAssayTypes(null)).toEqual([]);
        expect(offeredAssayTypes([])).toEqual([]);
    });

    it("offers nothing when more than one mechanism is selected", () => {
        expect(offeredAssayTypes([MONO_OXYGENASES, ACE1R])).toEqual([]);
    });

    it("offers nothing for an unknown mechanism", () => {
        expect(offeredAssayTypes([UNKNOWN_MECHANISM])).toEqual([]);
    });

    it("drops an assay type missing from the translations", () => {
        const withoutBiochemical = assayTypeTranslations.filter(
            translation => translation.VALUE_ !== BIOCHEMICAL_ASSAY
        );

        expect(offeredAssayTypes([MONO_OXYGENASES], withoutBiochemical)).toEqual([MOLECULAR_ASSAY, SYNERGIST_ASSAY]);
    });
});
