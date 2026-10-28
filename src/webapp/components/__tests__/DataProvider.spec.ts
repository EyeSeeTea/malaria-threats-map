import { createTranslation } from "../../types/__fixtures__/translationFixtures";
import { buildTranslationResources } from "../DataProvider";
import { GAMBIAE, MONO_OXYGENASES } from "../../../domain/entities/__fixtures__/studyValues";

const TYPE_FIELD = "TYPE";
const PROXY_TYPE_FIELD = "PROXY_TYPE";
const SPECIES_FIELD = "SPECIES";

const TYPE_KEY = `${TYPE_FIELD}.${MONO_OXYGENASES}`;
const PROXY_TYPE_KEY = `${PROXY_TYPE_FIELD}.${MONO_OXYGENASES}`;

const ENGLISH_LABEL = "Mono-oxygenases";
const SPANISH_LABEL = "Monooxigenasas";
const FRENCH_LABEL = "Mono-oxygénases";
const PROXY_ENGLISH_LABEL = "Mono-oxygenases (proxy)";
const SPECIES_LABEL = "label";

const monoOxygenasesType = createTranslation({
    FIELD: TYPE_FIELD,
    VALUE_: MONO_OXYGENASES,
    EN: ENGLISH_LABEL,
    ES: SPANISH_LABEL,
    FR: FRENCH_LABEL,
});

describe("buildTranslationResources", () => {
    it("registers each translation under its value and under FIELD.VALUE, in each language", () => {
        expect(buildTranslationResources([monoOxygenasesType])).toEqual({
            englishResources: { [MONO_OXYGENASES]: ENGLISH_LABEL, [TYPE_KEY]: ENGLISH_LABEL },
            spanishResources: { [MONO_OXYGENASES]: SPANISH_LABEL, [TYPE_KEY]: SPANISH_LABEL },
            frenchResources: { [MONO_OXYGENASES]: FRENCH_LABEL, [TYPE_KEY]: FRENCH_LABEL },
        });
    });

    describe("escaping the dots of the value key", () => {
        const englishFor = (value: string) =>
            buildTranslationResources([createTranslation({ FIELD: SPECIES_FIELD, VALUE_: value, EN: SPECIES_LABEL })])
                .englishResources;

        it("leaves a value without dots as it is", () => {
            const value = "AN_STEPHENSI";

            expect(englishFor(value)).toEqual({
                [value]: SPECIES_LABEL,
                [`${SPECIES_FIELD}.${value}`]: SPECIES_LABEL,
            });
        });

        it("escapes the dot of a value with one dot, and not the FIELD.VALUE key", () => {
            const value = "An. funestus";

            expect(englishFor(value)).toEqual({
                "An%2E funestus": SPECIES_LABEL,
                [`${SPECIES_FIELD}.${value}`]: SPECIES_LABEL,
            });
        });

        it("escapes only the first dot of a value with two dots (finding)", () => {
            expect(englishFor(GAMBIAE)).toEqual({
                "An%2E gambiae s.l.": SPECIES_LABEL,
                [`${SPECIES_FIELD}.${GAMBIAE}`]: SPECIES_LABEL,
            });
        });
    });

    it("keeps the last translation for a value shared by two fields, and both FIELD.VALUE keys (finding)", () => {
        const monoOxygenasesProxy = createTranslation({
            FIELD: PROXY_TYPE_FIELD,
            VALUE_: MONO_OXYGENASES,
            EN: PROXY_ENGLISH_LABEL,
        });

        expect(buildTranslationResources([monoOxygenasesType, monoOxygenasesProxy]).englishResources).toEqual({
            [MONO_OXYGENASES]: PROXY_ENGLISH_LABEL,
            [TYPE_KEY]: ENGLISH_LABEL,
            [PROXY_TYPE_KEY]: PROXY_ENGLISH_LABEL,
        });
        expect(buildTranslationResources([monoOxygenasesProxy, monoOxygenasesType]).englishResources).toEqual({
            [MONO_OXYGENASES]: ENGLISH_LABEL,
            [TYPE_KEY]: ENGLISH_LABEL,
            [PROXY_TYPE_KEY]: PROXY_ENGLISH_LABEL,
        });
    });

    it("returns empty bundles for no translations", () => {
        expect(buildTranslationResources([])).toEqual({
            englishResources: {},
            spanishResources: {},
            frenchResources: {},
        });
    });
});
