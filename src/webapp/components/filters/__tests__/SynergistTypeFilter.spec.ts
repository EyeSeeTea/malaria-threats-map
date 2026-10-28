import { createTranslation } from "../../../types/__fixtures__/translationFixtures";
import { getSynergistTypeOptions } from "../SynergistTypeFilter";

const WHO_TEST_KIT = "WHO_TEST_KIT_ADULTS";
const CDC_BOTTLE = "CDC_BOTTLE_ADULTS";

const typeTranslations = (values: string[]) => values.map(value => createTranslation({ FIELD: "TYPE", VALUE_: value }));

describe("getSynergistTypeOptions", () => {
    it("offers only the WHO test kit and the CDC bottle, with the value as label", () => {
        const translations = typeTranslations(["MONO_OXYGENASES", WHO_TEST_KIT, "WHO_TEST_KIT_LARVAE", CDC_BOTTLE]);

        expect(getSynergistTypeOptions(translations)).toEqual([
            { label: WHO_TEST_KIT, value: WHO_TEST_KIT },
            { label: CDC_BOTTLE, value: CDC_BOTTLE },
        ]);
    });

    it("keeps the order of the translations", () => {
        expect(
            getSynergistTypeOptions(typeTranslations([CDC_BOTTLE, WHO_TEST_KIT])).map(option => option.value)
        ).toEqual([CDC_BOTTLE, WHO_TEST_KIT]);
    });

    it("offers nothing when neither type is in the translations", () => {
        expect(getSynergistTypeOptions(typeTranslations(["ESTERASES"]))).toEqual([]);
    });
});
