import { Translation, TranslationResponse } from "../Translation";

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

/** The xMART translations response carrying the translations. */
export function createTranslationResponse(translations: ReadonlyArray<Translation>): TranslationResponse {
    return {
        displayFieldName: "",
        features: translations.map(attributes => ({ attributes })),
        fieldAliases: [],
        fields: [],
    };
}

/** The PROXY_TYPE translations of the values, in their order. */
export function createProxyTypeTranslations(values: ReadonlyArray<string>): Translation[] {
    return values.map(VALUE_ => createTranslation({ FIELD: "PROXY_TYPE", VALUE_ }));
}
