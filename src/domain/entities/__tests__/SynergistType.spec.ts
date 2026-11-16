import { createPreventionStudy } from "../__fixtures__/studyFixtures";
import {
    BIOCHEMICAL_ASSAY,
    CDC_BOTTLE,
    ESTERASES,
    MOLECULAR_ASSAY,
    MONO_OXYGENASES,
    SYNERGIST_ASSAY,
    WHO_TEST_KIT,
} from "../__fixtures__/studyValues";
import { getSynergistTypes } from "../SynergistType";

describe("getSynergistTypes", () => {
    const study = (ASSAY_TYPE: string, TYPE: string | null | undefined) => createPreventionStudy({ ASSAY_TYPE, TYPE });

    it("returns the test types of the synergist bioassays only", () => {
        const studies = [
            study(SYNERGIST_ASSAY, WHO_TEST_KIT),
            study(MOLECULAR_ASSAY, MONO_OXYGENASES),
            study(BIOCHEMICAL_ASSAY, ESTERASES),
            study(SYNERGIST_ASSAY, CDC_BOTTLE),
        ];

        expect(getSynergistTypes(studies)).toEqual([WHO_TEST_KIT, CDC_BOTTLE]);
    });

    it("returns each test type once, in the order it first appears", () => {
        const studies = [
            study(SYNERGIST_ASSAY, CDC_BOTTLE),
            study(SYNERGIST_ASSAY, WHO_TEST_KIT),
            study(SYNERGIST_ASSAY, CDC_BOTTLE),
        ];

        expect(getSynergistTypes(studies)).toEqual([CDC_BOTTLE, WHO_TEST_KIT]);
    });

    it("leaves out empty and missing test types", () => {
        const studies = [study(SYNERGIST_ASSAY, ""), study(SYNERGIST_ASSAY, null), study(SYNERGIST_ASSAY, undefined)];

        expect(getSynergistTypes([...studies, study(SYNERGIST_ASSAY, WHO_TEST_KIT)])).toEqual([WHO_TEST_KIT]);
    });
});
