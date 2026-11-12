import { createPreventionStudy } from "../../../../domain/entities/__fixtures__/studyFixtures";
import { getSynergistTypeOptions } from "../SynergistTypeFilter";
import {
    BIOCHEMICAL,
    CDC_BOTTLE,
    ESTERASES,
    MOLECULAR,
    MONO_OXYGENASES,
    SYNERGIST,
    WHO_TEST_KIT,
} from "../../../../domain/entities/__fixtures__/studyValues";

const WHO_TEST_KIT_LARVAE = "WHO_TEST_KIT_LARVAE";

const study = (ASSAY_TYPE: string, TYPE: string) => createPreventionStudy({ ASSAY_TYPE, TYPE });

describe("getSynergistTypeOptions", () => {
    it("offers the test types of the synergist bioassays, with the value as label", () => {
        const studies = [
            study(SYNERGIST, WHO_TEST_KIT),
            study(MOLECULAR, MONO_OXYGENASES),
            study(SYNERGIST, CDC_BOTTLE),
        ];

        expect(getSynergistTypeOptions(studies)).toEqual([
            { label: WHO_TEST_KIT, value: WHO_TEST_KIT },
            { label: CDC_BOTTLE, value: CDC_BOTTLE },
        ]);
    });

    it("offers a test type of the data that the old whitelist left out", () => {
        expect(getSynergistTypeOptions([study(SYNERGIST, WHO_TEST_KIT_LARVAE)])).toEqual([
            { label: WHO_TEST_KIT_LARVAE, value: WHO_TEST_KIT_LARVAE },
        ]);
    });

    it("offers nothing when the map has no synergist bioassays", () => {
        expect(getSynergistTypeOptions([study(BIOCHEMICAL, ESTERASES)])).toEqual([]);
    });
});
