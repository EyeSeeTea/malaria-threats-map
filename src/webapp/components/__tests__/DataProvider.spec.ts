import { createTranslation } from "../../types/__fixtures__/translationFixtures";
import { buildTranslationResources } from "../DataProvider";

const MONO_OXYGENASES = "MONO_OXYGENASES";

const monoOxygenasesType = createTranslation({
    FIELD: "TYPE",
    VALUE_: MONO_OXYGENASES,
    EN: "Mono-oxygenases",
    ES: "Monooxigenasas",
    FR: "Mono-oxygénases",
});

describe("buildTranslationResources", () => {
    it("registers each translation under its value and under FIELD.VALUE, in each language", () => {
        expect(buildTranslationResources([monoOxygenasesType])).toEqual({
            englishResources: { MONO_OXYGENASES: "Mono-oxygenases", "TYPE.MONO_OXYGENASES": "Mono-oxygenases" },
            spanishResources: { MONO_OXYGENASES: "Monooxigenasas", "TYPE.MONO_OXYGENASES": "Monooxigenasas" },
            frenchResources: { MONO_OXYGENASES: "Mono-oxygénases", "TYPE.MONO_OXYGENASES": "Mono-oxygénases" },
        });
    });

    describe("escaping the dots of the value key", () => {
        const englishFor = (value: string) =>
            buildTranslationResources([createTranslation({ FIELD: "SPECIES", VALUE_: value, EN: "label" })])
                .englishResources;

        it("leaves a value without dots as it is", () => {
            expect(englishFor("AN_STEPHENSI")).toEqual({ AN_STEPHENSI: "label", "SPECIES.AN_STEPHENSI": "label" });
        });

        it("escapes the dot of a value with one dot, and not the FIELD.VALUE key", () => {
            expect(englishFor("An. funestus")).toEqual({ "An%2E funestus": "label", "SPECIES.An. funestus": "label" });
        });

        it("escapes only the first dot of a value with two dots (finding)", () => {
            expect(englishFor("An. gambiae s.l.")).toEqual({
                "An%2E gambiae s.l.": "label",
                "SPECIES.An. gambiae s.l.": "label",
            });
        });
    });

    it("keeps the last translation for a value shared by two fields, and both FIELD.VALUE keys (finding)", () => {
        const monoOxygenasesProxy = createTranslation({
            FIELD: "PROXY_TYPE",
            VALUE_: MONO_OXYGENASES,
            EN: "Mono-oxygenases (proxy)",
        });

        expect(buildTranslationResources([monoOxygenasesType, monoOxygenasesProxy]).englishResources).toEqual({
            MONO_OXYGENASES: "Mono-oxygenases (proxy)",
            "TYPE.MONO_OXYGENASES": "Mono-oxygenases",
            "PROXY_TYPE.MONO_OXYGENASES": "Mono-oxygenases (proxy)",
        });
        expect(buildTranslationResources([monoOxygenasesProxy, monoOxygenasesType]).englishResources).toEqual({
            MONO_OXYGENASES: "Mono-oxygenases",
            "TYPE.MONO_OXYGENASES": "Mono-oxygenases",
            "PROXY_TYPE.MONO_OXYGENASES": "Mono-oxygenases (proxy)",
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
