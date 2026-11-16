import i18next from "i18next";
import {
    MONO_OXYGENASES,
    NOT_REPORTED,
    STEPHENSI_MYSORENSIS,
    STEPHENSI_TYPE_FORM,
} from "../../../domain/entities/__fixtures__/studyValues";
import { Translation, TranslationResponse } from "../Translation";

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

export const STEPHENSI_TYPE_FORM_APP_LABEL = "Type form (app)";
export const STEPHENSI_MYSORENSIS_APP_LABEL = "Mysorensis (app)";
export const NOT_REPORTED_APP_LABEL = "Form unspecified (app)";

/** Adds the app's English labels of three vector species, nested as translations.json has them. */
export function addVectorSpeciesAppLabels(): void {
    const vectorSpeciesOptions = {
        [STEPHENSI_TYPE_FORM]: STEPHENSI_TYPE_FORM_APP_LABEL,
        [STEPHENSI_MYSORENSIS]: STEPHENSI_MYSORENSIS_APP_LABEL,
        [NOT_REPORTED]: NOT_REPORTED_APP_LABEL,
    };

    i18next.addResourceBundle(
        "en",
        "translation",
        { common: { filters: { vector_species_options: vectorSpeciesOptions } } },
        true,
        true
    );
}

/** Removes every English resource a test added, so i18next returns keys again. */
export function removeEnglishResources(): void {
    i18next.removeResourceBundle("en", "translation");
}
