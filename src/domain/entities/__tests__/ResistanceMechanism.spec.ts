import { createPreventionStudy } from "../__fixtures__/studyFixtures";
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
    NOT_AVAILABLE,
    SYNERGIST_ASSAY,
    UNKNOWN_MECHANISM,
    WHO_TEST_KIT,
} from "../__fixtures__/studyValues";
import { getAssayTypesDetecting, getInvolvementMechanisms, getKnownMechanisms } from "../ResistanceMechanism";

const catalogueOrder = [MONO_OXYGENASES, ESTERASES, GSTS, KDR_L1014S, KDR_L1014F, KDR_UNSPECIFIED, ACE1R];

describe("ResistanceMechanism", () => {
    // The cases of the former cleanMechanismTypeOptions: the map, its side panel and the dashboard
    // summary must offer the same mechanisms, in the same order.
    describe("getKnownMechanisms", () => {
        it("returns the mechanisms in the order of the catalogue, not of the input", () => {
            expect(getKnownMechanisms([...catalogueOrder].reverse())).toEqual(catalogueOrder);
        });

        it("drops the values outside the catalogue, NA included", () => {
            expect(getKnownMechanisms([ESTERASES, WHO_TEST_KIT, NOT_AVAILABLE, KDR_L1014S])).toEqual([
                ESTERASES,
                KDR_L1014S,
            ]);
        });

        it("returns each mechanism once when the input repeats it", () => {
            expect(getKnownMechanisms([GSTS, GSTS, ESTERASES, GSTS])).toEqual([ESTERASES, GSTS]);
        });
    });

    describe("getAssayTypesDetecting", () => {
        it.each([MONO_OXYGENASES, ESTERASES, GSTS])("%s is detected by the three assay types", mechanism => {
            expect(getAssayTypesDetecting(mechanism)).toEqual([MOLECULAR_ASSAY, BIOCHEMICAL_ASSAY, SYNERGIST_ASSAY]);
        });

        it.each([KDR_L1014S, KDR_L1014F, KDR_UNSPECIFIED])("%s is detected only by the molecular assay", mechanism => {
            expect(getAssayTypesDetecting(mechanism)).toEqual([MOLECULAR_ASSAY]);
        });

        it("ACE1R is detected by the molecular and biochemical assays", () => {
            expect(getAssayTypesDetecting(ACE1R)).toEqual([MOLECULAR_ASSAY, BIOCHEMICAL_ASSAY]);
        });

        // Reachable from a link with a mechanism code the catalogue does not have.
        it("returns undefined for a mechanism outside the catalogue", () => {
            expect(getAssayTypesDetecting(UNKNOWN_MECHANISM)).toBeUndefined();
        });

        it("returns undefined without a mechanism", () => {
            expect(getAssayTypesDetecting(undefined)).toBeUndefined();
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
