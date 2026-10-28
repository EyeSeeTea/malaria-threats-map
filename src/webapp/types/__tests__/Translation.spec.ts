import { createTranslation } from "../__fixtures__/translationFixtures";
import { getTranslationsKey } from "../Translation";

describe("getTranslationsKey", () => {
    it("joins FIELD and VALUE_ with a dot", () => {
        expect(getTranslationsKey(createTranslation({ FIELD: "TYPE", VALUE_: "MONO_OXYGENASES" }))).toBe(
            "TYPE.MONO_OXYGENASES"
        );
    });

    it("does not escape the dots of the value", () => {
        expect(getTranslationsKey(createTranslation({ FIELD: "SPECIES", VALUE_: "An. funestus" }))).toBe(
            "SPECIES.An. funestus"
        );
        expect(getTranslationsKey(createTranslation({ FIELD: "SPECIES", VALUE_: "An. gambiae s.l." }))).toBe(
            "SPECIES.An. gambiae s.l."
        );
    });

    it("gives different keys to the same value in two fields", () => {
        const keys = ["TYPE", "PROXY_TYPE"].map(field =>
            getTranslationsKey(createTranslation({ FIELD: field, VALUE_: "MONO_OXYGENASES" }))
        );

        expect(keys).toEqual(["TYPE.MONO_OXYGENASES", "PROXY_TYPE.MONO_OXYGENASES"]);
    });
});
