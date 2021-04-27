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
import download_en from "../../translations/en/download.json";
import download_es from "../../translations/es/download.json";
import download_fr from "../../translations/fr/download.json";
import invasiveStory_en from "../../translations/en/invasiveStory.json";
import invasiveStory_es from "../../translations/es/invasiveStory.json";
import invasiveStory_fr from "../../translations/fr/invasiveStory.json";
import diagnosisStory_en from "../../translations/en/diagnosisStory.json";
import diagnosisStory_es from "../../translations/es/diagnosisStory.json";
import diagnosisStory_fr from "../../translations/fr/diagnosisStory.json";
import PBOStory_en from "../../translations/en/PBOStory.json";
import PBOStory_es from "../../translations/es/PBOStory.json";
import PBOStory_fr from "../../translations/fr/PBOStory.json";
import preventionStory_en from "../../translations/en/preventionStory.json";
import preventionStory_es from "../../translations/es/preventionStory.json";
import preventionStory_fr from "../../translations/fr/preventionStory.json";
import treatmentStory_en from "../../translations/en/treatmentStory.json";
import treatmentStory_es from "../../translations/es/treatmentStory.json";
import treatmentStory_fr from "../../translations/fr/treatmentStory.json";

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
      mekong: mekong_en,
      download: download_en,
      invasive: invasiveStory_en,
      diagnosis: diagnosisStory_en,
      pbo: PBOStory_en,
      prevention: preventionStory_en,
      treatment: treatmentStory_en
    },
    es: {
      common: common_es,
      disclaimer: disclaimer_es,
      tour: tour_es,
      mekong: mekong_es,
      download: download_es,
      invasive: invasiveStory_es,
      diagnosis: diagnosisStory_es,
      pbo: PBOStory_es,
      prevention: preventionStory_es,
      treatment: treatmentStory_es
    },
    fr: {
      common: common_fr,
      disclaimer: disclaimer_fr,
      tour: tour_fr,
      mekong: mekong_fr,
      download: download_fr,
      invasive: invasiveStory_fr,
      diagnosis: diagnosisStory_fr,
      pbo: PBOStory_fr,
      prevention: preventionStory_fr,
      treatment: treatmentStory_fr
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
