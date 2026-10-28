import { Translation } from "../Translation";

const defaultTranslation: Readonly<Translation> = {
    OBJECTID: 1,
    Code: "TR_001",
    DATASET: "PREVENTION",
    FIELD: "TYPE",
    VALUE_: "MONO_OXYGENASES",
    EN: "Mono-oxygenases",
    FR: "Mono-oxygénases",
    ES: "Monooxigenasas",
    ACTIVE: null,
    NOTES: "",
};

export function createTranslation(overrides: Partial<Translation> = {}): Translation {
    return { ...defaultTranslation, ...overrides };
}
