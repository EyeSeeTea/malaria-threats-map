import { GAMBIAE, MONO_OXYGENASES } from "../../../domain/entities/__fixtures__/studyValues";
import { createTranslation } from "../__fixtures__/translationFixtures";
import { getTranslationsKey } from "../Translation";

const TYPE_FIELD = "TYPE";
const PROXY_TYPE_FIELD = "PROXY_TYPE";
const SPECIES_FIELD = "SPECIES";

// Written out, not built from the constants above, so the key format itself is asserted.
const TYPE_KEY = "TYPE.MONO_OXYGENASES";

describe("getTranslationsKey", () => {
    it("joins FIELD and VALUE_ with a dot", () => {
        expect(getTranslationsKey(createTranslation({ FIELD: TYPE_FIELD, VALUE_: MONO_OXYGENASES }))).toBe(TYPE_KEY);
    });

    it("does not escape the dots of the value", () => {
        expect(getTranslationsKey(createTranslation({ FIELD: SPECIES_FIELD, VALUE_: "An. funestus" }))).toBe(
            "SPECIES.An. funestus"
        );
        expect(getTranslationsKey(createTranslation({ FIELD: SPECIES_FIELD, VALUE_: GAMBIAE }))).toBe(
            "SPECIES.An. gambiae s.l."
        );
    });

    it("gives different keys to the same value in two fields", () => {
        const keys = [TYPE_FIELD, PROXY_TYPE_FIELD].map(field =>
            getTranslationsKey(createTranslation({ FIELD: field, VALUE_: MONO_OXYGENASES }))
        );

        expect(keys).toEqual([TYPE_KEY, "PROXY_TYPE.MONO_OXYGENASES"]);
    });
});
