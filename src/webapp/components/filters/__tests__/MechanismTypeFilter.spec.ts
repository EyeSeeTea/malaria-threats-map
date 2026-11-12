import i18next from "i18next";
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
import { createTranslation } from "../../../types/__fixtures__/translationFixtures";
import { getMechanismTypeOptions } from "../MechanismTypeFilter";

// The order of the catalogue and the label rules are pinned in ResistanceMechanism.spec; this spec pins
// where each side of the filter reads its mechanisms from.

const MONO_OXYGENASES_LABEL = "Mono-oxygenases (xMART)";
const GSTS_LABEL = "GSTs (xMART)";

const xmartTranslations = { [`TYPE.${MONO_OXYGENASES}`]: MONO_OXYGENASES_LABEL, [`TYPE.${GSTS}`]: GSTS_LABEL };

const studiesOf = (types: ReadonlyArray<string>) => types.map(TYPE => createPreventionStudy({ TYPE }));
const translationsOf = (values: ReadonlyArray<string>) =>
    values.map(VALUE_ => createTranslation({ FIELD: "TYPE", VALUE_ }));

beforeAll(() => {
    i18next.addResourceBundle("en", "translation", xmartTranslations);
});

afterAll(() => {
    i18next.removeResourceBundle("en", "translation");
});

describe("getMechanismTypeOptions", () => {
    describe("on the map", () => {
        it("offers the catalogue mechanisms of the studies, with the xMART label or the value", () => {
            const studies = studiesOf([ACE1R, WHO_TEST_KIT, GSTS, NOT_AVAILABLE, ACE1R, MONO_OXYGENASES]);

            expect(getMechanismTypeOptions("map", studies, translationsOf([ESTERASES]))).toEqual([
                { value: MONO_OXYGENASES, label: MONO_OXYGENASES_LABEL },
                { value: GSTS, label: GSTS_LABEL },
                { value: ACE1R, label: ACE1R },
            ]);
        });

        it("offers nothing when the studies carry no catalogue mechanism", () => {
            expect(getMechanismTypeOptions("map", studiesOf([WHO_TEST_KIT]), translationsOf([GSTS]))).toEqual([]);
        });
    });

    // Data Download is out of scope: it keeps offering the catalogue mechanisms of the TYPE translations.
    describe("on Data Download", () => {
        it("offers the catalogue mechanisms of the translations, not of the studies", () => {
            const translations = translationsOf([KDR_L1014S, WHO_TEST_KIT, MONO_OXYGENASES]);

            expect(getMechanismTypeOptions("download", studiesOf([GSTS]), translations)).toEqual([
                { value: MONO_OXYGENASES, label: MONO_OXYGENASES_LABEL },
                { value: KDR_L1014S, label: KDR_L1014S },
            ]);
        });
    });
});
