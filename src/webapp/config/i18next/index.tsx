import i18next from "i18next";
import common_en from "../../translations/en/common.json";
import common_es from "../../translations/es/common.json";
import common_fr from "../../translations/fr/common.json";
import disclaimer_en from "../../translations/en/disclaimer.json";
import disclaimer_es from "../../translations/es/disclaimer.json";
import disclaimer_fr from "../../translations/fr/disclaimer.json";
import disclaimerTab_en from "../../translations/en/disclaimerTab.json";
import disclaimerTab_es from "../../translations/es/disclaimerTab.json";
import disclaimerTab_fr from "../../translations/fr/disclaimerTab.json";
import legend_en from "../../translations/en/legend.json";
import legend_es from "../../translations/es/legend.json";
import legend_fr from "../../translations/fr/legend.json";
import tour_en from "../../translations/en/tour.json";
import tour_es from "../../translations/es/tour.json";
import tour_fr from "../../translations/fr/tour.json";
import download_en from "../../translations/en/download.json";
import download_es from "../../translations/es/download.json";
import download_fr from "../../translations/fr/download.json";
import { dispatchCustomEvent } from "../../utils/dom-utils";

const ALLOWED_LANGUAGES = ["en", "fr", "es"];
const storageLng = localStorage.getItem("language");

export const lng = ALLOWED_LANGUAGES.includes(storageLng) ? storageLng : "en";
localStorage.setItem("language", lng);

i18next.init({
    interpolation: { escapeValue: false },
    lng: lng, // language to use
    resources: {
        en: {
            common: common_en,
            disclaimer: disclaimer_en,
            disclaimerTab: disclaimerTab_en,
            legend: legend_en,
            tour: tour_en,
            download: download_en,
        },
        es: {
            common: common_es,
            disclaimer: disclaimer_es,
            disclaimerTab: disclaimerTab_es,
            legend: legend_es,
            tour: tour_es,
            download: download_es,
        },
        fr: {
            common: common_fr,
            disclaimer: disclaimer_fr,
            disclaimerTab: disclaimerTab_fr,
            legend: legend_fr,
            tour: tour_fr,
            download: download_fr,
        },
    },
});

export const changeLanguage = (lng: string) => {
    setTimeout(() => dispatchCustomEvent("resize"));
    return i18next.changeLanguage(lng, err => {
        if (err) {
            return console.log("something went wrong loading", err);
        } else {
            localStorage.setItem("language", lng);
        }
    });
};
