import { createPreventionStudy } from "../__fixtures__/studyFixtures";
import {
    ACE1R,
    BIOCHEMICAL,
    CDC_BOTTLE,
    ESTERASES,
    GSTS,
    KDR_L1014F,
    KDR_L1014S,
    KDR_UNSPECIFIED,
    MOLECULAR,
    MONO_OXYGENASES,
    NOT_AVAILABLE,
    SYNERGIST,
    UNKNOWN_MECHANISM,
    WHO_TEST_KIT,
} from "../__fixtures__/studyValues";
import {
    getAssayTypesDetecting,
    getInvolvementMechanisms,
    getMechanismOptions,
    getSynergistTypes,
} from "../ResistanceMechanism";

const catalogueOrder = [MONO_OXYGENASES, ESTERASES, GSTS, KDR_L1014S, KDR_L1014F, KDR_UNSPECIFIED, ACE1R];

describe("ResistanceMechanism", () => {
    // The cases of the former cleanMechanismTypeOptions, unchanged: the map, its side panel and the
    // dashboard summary must offer the same mechanisms, in the same order.
    describe("getMechanismOptions", () => {
        it("pins the catalogue and its order", () => {
            expect(getMechanismOptions([...catalogueOrder].reverse())).toEqual(catalogueOrder);
        });

        it("returns the values in the order of the catalogue, not of the input", () => {
            expect(getMechanismOptions([ACE1R, GSTS, MONO_OXYGENASES, KDR_L1014F])).toEqual([
                MONO_OXYGENASES,
                GSTS,
                KDR_L1014F,
                ACE1R,
            ]);
        });

        it("drops the values outside the catalogue, NA included", () => {
            expect(getMechanismOptions([ESTERASES, WHO_TEST_KIT, NOT_AVAILABLE, KDR_L1014S])).toEqual([
                ESTERASES,
                KDR_L1014S,
            ]);
        });

        it("returns each value once when the input repeats it", () => {
            expect(getMechanismOptions([GSTS, GSTS, ESTERASES, GSTS])).toEqual([ESTERASES, GSTS]);
        });

        it("returns an empty list for an empty input", () => {
            expect(getMechanismOptions([])).toEqual([]);
        });
    });

    describe("getAssayTypesDetecting", () => {
        it.each([MONO_OXYGENASES, ESTERASES, GSTS])("%s is detected by the three assay types", mechanism => {
            expect(getAssayTypesDetecting(mechanism)).toEqual([MOLECULAR, BIOCHEMICAL, SYNERGIST]);
        });

        it.each([KDR_L1014S, KDR_L1014F, KDR_UNSPECIFIED])("%s is detected only by the molecular assay", mechanism => {
            expect(getAssayTypesDetecting(mechanism)).toEqual([MOLECULAR]);
        });

        it("ACE1R is detected by the molecular and biochemical assays", () => {
            expect(getAssayTypesDetecting(ACE1R)).toEqual([MOLECULAR, BIOCHEMICAL]);
        });

        it("returns undefined for a mechanism outside the catalogue", () => {
            expect(getAssayTypesDetecting(UNKNOWN_MECHANISM)).toBeUndefined();
        });

        it("returns undefined without a mechanism", () => {
            expect(getAssayTypesDetecting(undefined)).toBeUndefined();
        });
    });

    describe("getSynergistTypes", () => {
        const study = (ASSAY_TYPE: string, TYPE: string | null | undefined) =>
            createPreventionStudy({ ASSAY_TYPE, TYPE });

        it("returns the test types of the synergist bioassays only", () => {
            const studies = [
                study(SYNERGIST, WHO_TEST_KIT),
                study(MOLECULAR, MONO_OXYGENASES),
                study(BIOCHEMICAL, ESTERASES),
                study(SYNERGIST, CDC_BOTTLE),
            ];

            expect(getSynergistTypes(studies)).toEqual([WHO_TEST_KIT, CDC_BOTTLE]);
        });

        it("returns each test type once, in the order it first appears", () => {
            const studies = [
                study(SYNERGIST, CDC_BOTTLE),
                study(SYNERGIST, WHO_TEST_KIT),
                study(SYNERGIST, CDC_BOTTLE),
            ];

            expect(getSynergistTypes(studies)).toEqual([CDC_BOTTLE, WHO_TEST_KIT]);
        });

        it("leaves out empty and missing test types", () => {
            const studies = [study(SYNERGIST, ""), study(SYNERGIST, null), study(SYNERGIST, undefined)];

            expect(getSynergistTypes([...studies, study(SYNERGIST, WHO_TEST_KIT)])).toEqual([WHO_TEST_KIT]);
        });

        it("returns an empty list for no studies", () => {
            expect(getSynergistTypes([])).toEqual([]);
        });
    });

    describe("getInvolvementMechanisms", () => {
        const translatedCodes = [MONO_OXYGENASES, NOT_AVAILABLE, ESTERASES, GSTS];
        const studiesOf = (proxyTypes: ReadonlyArray<string>) =>
            proxyTypes.map(PROXY_TYPE => createPreventionStudy({ PROXY_TYPE }));

        it("offers only the translated codes the studies carry, each once, in the order of the translations", () => {
            expect(getInvolvementMechanisms(translatedCodes, studiesOf([GSTS, ESTERASES, GSTS]))).toEqual([
                ESTERASES,
                GSTS,
            ]);
        });

        it("does not offer NA, even when the studies carry it", () => {
            expect(getInvolvementMechanisms(translatedCodes, studiesOf([NOT_AVAILABLE, ESTERASES]))).toEqual([
                ESTERASES,
            ]);
        });

        it("offers nothing when there are no studies, as with no disease set", () => {
            expect(getInvolvementMechanisms(translatedCodes, [])).toEqual([]);
        });

        it("does not offer a code the studies carry without a translation", () => {
            expect(getInvolvementMechanisms([], studiesOf([ESTERASES]))).toEqual([]);
        });
    });
});
