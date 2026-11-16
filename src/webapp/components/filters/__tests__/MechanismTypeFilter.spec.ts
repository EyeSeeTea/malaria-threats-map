import { createPreventionStudy } from "../../../../domain/entities/__fixtures__/studyFixtures";
import {
    ACE1R,
    ESTERASES,
    GSTS,
    KDR_L1014S,
    MONO_OXYGENASES,
    NOT_AVAILABLE,
    WHO_TEST_KIT,
} from "../../../../domain/entities/__fixtures__/studyValues";
import {
    addXmartLabels,
    createTranslation,
    MONO_OXYGENASES_ENGLISH,
    removeEnglishResources,
} from "../../../types/__fixtures__/translationFixtures";
import { getMechanismToSelectOnMap, getMechanismTypeOptions } from "../MechanismTypeFilter";

// The order of the catalogue is pinned in ResistanceMechanism.spec; this spec pins where each side of the
// filter reads its mechanisms from, and what the map does with a selected mechanism it does not offer.

const GSTS_LABEL = "GSTs (xMART)";

const studiesOf = (types: ReadonlyArray<string>) => types.map(TYPE => createPreventionStudy({ TYPE }));
const translationsOf = (values: ReadonlyArray<string>) => values.map(VALUE_ => createTranslation({ VALUE_ }));

describe("MechanismTypeFilter", () => {
    describe("getMechanismTypeOptions", () => {
        beforeAll(() => {
            addXmartLabels({ [`TYPE.${MONO_OXYGENASES}`]: MONO_OXYGENASES_ENGLISH, [`TYPE.${GSTS}`]: GSTS_LABEL });
        });

        afterAll(() => {
            removeEnglishResources();
        });

        it("on the map, offers the catalogue mechanisms of the studies, with the xMART label or the value", () => {
            const studies = studiesOf([ACE1R, WHO_TEST_KIT, GSTS, NOT_AVAILABLE, ACE1R, MONO_OXYGENASES]);

            expect(getMechanismTypeOptions("map", studies, translationsOf([ESTERASES]))).toEqual([
                { value: MONO_OXYGENASES, label: MONO_OXYGENASES_ENGLISH },
                { value: GSTS, label: GSTS_LABEL },
                { value: ACE1R, label: ACE1R },
            ]);
        });

        // Data Download is out of scope: it keeps offering the catalogue mechanisms of the TYPE translations.
        it("on Data Download, offers the catalogue mechanisms of the translations, not of the studies", () => {
            const translations = translationsOf([KDR_L1014S, WHO_TEST_KIT, MONO_OXYGENASES]);

            expect(getMechanismTypeOptions("download", studiesOf([GSTS]), translations)).toEqual([
                { value: MONO_OXYGENASES, label: MONO_OXYGENASES_ENGLISH },
                { value: KDR_L1014S, label: KDR_L1014S },
            ]);
        });
    });

    // The map and Data Download share the selected mechanism, and a link can set it too, so the map can
    // receive a mechanism its studies do not carry.
    describe("getMechanismToSelectOnMap", () => {
        it("keeps a selected mechanism the map offers", () => {
            expect(getMechanismToSelectOnMap(GSTS, [MONO_OXYGENASES, GSTS])).toBeUndefined();
        });

        it("selects the default instead of a mechanism the map does not offer", () => {
            expect(getMechanismToSelectOnMap(KDR_L1014S, [MONO_OXYGENASES, GSTS])).toBe(MONO_OXYGENASES);
        });

        it("selects the first offered mechanism when the map does not offer the default either", () => {
            expect(getMechanismToSelectOnMap(KDR_L1014S, [ESTERASES, GSTS])).toBe(ESTERASES);
        });

        it("changes nothing while the studies load and nothing is offered", () => {
            expect(getMechanismToSelectOnMap(KDR_L1014S, [])).toBeUndefined();
        });

        it("changes nothing without a selected mechanism", () => {
            expect(getMechanismToSelectOnMap(undefined, [MONO_OXYGENASES, GSTS])).toBeUndefined();
        });
    });
});
