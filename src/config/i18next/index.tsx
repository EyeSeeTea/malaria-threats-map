import i18next from "i18next";
import common_en from "../../translations/en/common.json";
import common_es from "../../translations/es/common.json";
import common_fr from "../../translations/fr/common.json";
import disclaimer_en from "../../translations/en/disclaimer.json";
import disclaimer_es from "../../translations/es/disclaimer.json";
import disclaimer_fr from "../../translations/fr/disclaimer.json";
import tour_en from "../../translations/en/tour.json";
import tour_es from "../../translations/es/tour.json";
import tour_fr from "../../translations/fr/tour.json";
import mekong_en from "../../translations/en/mekong.json";
import mekong_es from "../../translations/es/mekong.json";
import mekong_fr from "../../translations/fr/mekong.json";
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
      tour: tour_en,
      mekong: mekong_en
    },
    es: {
      common: common_es,
      disclaimer: disclaimer_es,
      tour: tour_es,
      mekong: mekong_es
    },
    fr: {
      common: common_fr,
      disclaimer: disclaimer_fr,
      tour: tour_fr,
      mekong: mekong_fr
    }
  }
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
