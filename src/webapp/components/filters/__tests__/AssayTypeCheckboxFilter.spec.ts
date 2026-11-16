import i18next from "i18next";
import { createPreventionFilters } from "../../../store/__fixtures__/filtersFixtures";
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

const MOLECULAR_LABEL = "Molecular assay (xMART)";

const xmartTranslations = { [`ASSAY_TYPE.${MOLECULAR_ASSAY}`]: MOLECULAR_LABEL };

function offeredAssayTypes(type: string[] | null): ReadonlyArray<string> {
    return getAssayTypeFilterOptions(createPreventionFilters({ type })).map(option => option.value);
}

beforeAll(() => {
    i18next.addResourceBundle("en", "translation", xmartTranslations);
});

afterAll(() => {
    i18next.removeResourceBundle("en", "translation");
});

describe("getAssayTypeFilterOptions", () => {
    it("labels each assay type with its xMART label, or with the value when it has none", () => {
        expect(getAssayTypeFilterOptions(createPreventionFilters({ type: [ACE1R] }))).toEqual([
            { value: MOLECULAR_ASSAY, label: MOLECULAR_LABEL },
            { value: BIOCHEMICAL_ASSAY, label: BIOCHEMICAL_ASSAY },
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
});
