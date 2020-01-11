import i18next from "i18next";
import common_en from "../../translations/en/common.json";
import common_es from "../../translations/es/common.json";
import common_fr from "../../translations/fr/common.json";
import tour_en from "../../translations/en/tour.json";
import tour_es from "../../translations/es/tour.json";
import tour_fr from "../../translations/fr/tour.json";
import { dispatchCustomEvent } from "../../utils/dom-utils";

export const lng = localStorage.getItem("language") || "en";

i18next.init({
  interpolation: { escapeValue: false },
  lng: lng, // language to use
  resources: {
    en: {
      common: common_en,
      tour: tour_en
    },
    es: {
      common: common_es,
      tour: tour_es
    },
    fr: {
      common: common_fr,
      tour: tour_fr
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
