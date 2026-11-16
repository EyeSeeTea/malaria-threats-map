import { createPreventionStudy } from "../../../../domain/entities/__fixtures__/studyFixtures";
import { getSynergistTypeFilterOptions } from "../SynergistTypeFilter";
import {
    BIOCHEMICAL_ASSAY,
    CDC_BOTTLE,
    ESTERASES,
    MOLECULAR_ASSAY,
    MONO_OXYGENASES,
    SYNERGIST_ASSAY,
    WHO_TEST_KIT,
} from "../../../../domain/entities/__fixtures__/studyValues";

const WHO_TEST_KIT_LARVAE = "WHO_TEST_KIT_LARVAE";

const study = (ASSAY_TYPE: string, TYPE: string) => createPreventionStudy({ ASSAY_TYPE, TYPE });

describe("getSynergistTypeFilterOptions", () => {
    it("offers the test types of the synergist bioassays, with the value as label", () => {
        const studies = [
            study(SYNERGIST_ASSAY, WHO_TEST_KIT),
            study(MOLECULAR_ASSAY, MONO_OXYGENASES),
            study(SYNERGIST_ASSAY, CDC_BOTTLE),
        ];

        expect(getSynergistTypeFilterOptions(studies)).toEqual([
            { label: WHO_TEST_KIT, value: WHO_TEST_KIT },
            { label: CDC_BOTTLE, value: CDC_BOTTLE },
        ]);
    });

    it("offers a test type of the data that the old whitelist left out", () => {
        expect(getSynergistTypeFilterOptions([study(SYNERGIST_ASSAY, WHO_TEST_KIT_LARVAE)])).toEqual([
            { label: WHO_TEST_KIT_LARVAE, value: WHO_TEST_KIT_LARVAE },
        ]);
    });

    it("offers nothing when the map has no synergist bioassays", () => {
        expect(getSynergistTypeFilterOptions([study(BIOCHEMICAL_ASSAY, ESTERASES)])).toEqual([]);
    });
});
