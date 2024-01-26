import i18next from "i18next";
import { dispatchCustomEvent } from "../../utils/dom-utils";

import en_translations from "../../translations/en/translations.json";
import es_translations from "../../translations/es/translations.json";
import fr_translations from "../../translations/fr/translations.json";
import { setToLocalStorage, getFromLocalStorage } from "../../utils/browserCache";
const ALLOWED_LANGUAGES = ["en", "fr", "es"];

const storageLng = getFromLocalStorage("language");

export const lng = ALLOWED_LANGUAGES.includes(storageLng) ? storageLng : "en";
setToLocalStorage("language", lng);

i18next.init({
    interpolation: { escapeValue: false },
    lng: lng, // language to use
    resources: {
        en: {
            translation: en_translations,
        },
        es: {
            translation: es_translations,
        },
        fr: {
            translation: fr_translations,
        },
    },
});

export const changeLanguage = (lng: string) => {
    setTimeout(() => dispatchCustomEvent("resize"));
    return i18next.changeLanguage(lng, err => {
        if (err) {
            return console.log("something went wrong loading", err);
        } else {
            setToLocalStorage("language", lng);
        }
    });
};
