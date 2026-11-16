import { MONO_OXYGENASES } from "../../../domain/entities/__fixtures__/studyValues";
import { Translation } from "../Translation";

export const TYPE_FIELD = "TYPE";

export const MONO_OXYGENASES_ENGLISH = "Mono-oxygenases";
export const MONO_OXYGENASES_SPANISH = "Monooxigenasas";
export const MONO_OXYGENASES_FRENCH = "Mono-oxygénases";

const defaultTranslation: Readonly<Translation> = {
    OBJECTID: 1,
    Code: "TR_001",
    DATASET: "PREVENTION",
    FIELD: TYPE_FIELD,
    VALUE_: MONO_OXYGENASES,
    EN: MONO_OXYGENASES_ENGLISH,
    FR: MONO_OXYGENASES_FRENCH,
    ES: MONO_OXYGENASES_SPANISH,
    ACTIVE: null,
    NOTES: "",
};

export function createTranslation(overrides: Partial<Translation> = {}): Translation {
    return { ...defaultTranslation, ...overrides };
}
