import { createPreventionFilters } from "../../../store/__fixtures__/filtersFixtures";
import { addXmartLabels, removeEnglishResources } from "../../../types/__fixtures__/translationFixtures";
import { getAssayTypeFilterOptions } from "../AssayTypeCheckboxFilter";
import {
    ACE1R,
    BIOCHEMICAL_ASSAY,
    MOLECULAR_ASSAY,
    MONO_OXYGENASES,
    UNKNOWN_MECHANISM,
} from "../../../../domain/entities/__fixtures__/studyValues";

// Which assay types detect each mechanism is pinned in ResistanceMechanism.spec; this spec pins what the
// filter adds: the labels, and when it offers nothing.

const MOLECULAR_LABEL = "Molecular assay (xMART)";

function offeredAssayTypes(type: string[] | null): ReadonlyArray<string> {
    return getAssayTypeFilterOptions(createPreventionFilters({ type })).map(option => option.value);
}

describe("getAssayTypeFilterOptions", () => {
    beforeAll(() => {
        addXmartLabels({ [`ASSAY_TYPE.${MOLECULAR_ASSAY}`]: MOLECULAR_LABEL });
    });

    afterAll(() => {
        removeEnglishResources();
    });

    it("offers the assay types of the selected mechanism, with the xMART label or the value", () => {
        expect(getAssayTypeFilterOptions(createPreventionFilters({ type: [ACE1R] }))).toEqual([
            { value: MOLECULAR_ASSAY, label: MOLECULAR_LABEL },
            { value: BIOCHEMICAL_ASSAY, label: BIOCHEMICAL_ASSAY },
        ]);
    });

    it("offers nothing when no mechanism is selected", () => {
        expect(offeredAssayTypes(null)).toEqual([]);
        expect(offeredAssayTypes([])).toEqual([]);
    });

    // Reachable only from a link: the filter selects one mechanism at a time.
    it("offers nothing when more than one mechanism is selected", () => {
        expect(offeredAssayTypes([MONO_OXYGENASES, ACE1R])).toEqual([]);
    });

    // Reachable from a link with a mechanism code the catalogue does not have.
    it("offers nothing for an unknown mechanism", () => {
        expect(offeredAssayTypes([UNKNOWN_MECHANISM])).toEqual([]);
    });
});
