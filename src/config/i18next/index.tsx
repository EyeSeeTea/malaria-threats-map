import i18next from "i18next";
import common_en from "../../translations/en/common.json";
import common_es from "../../translations/es/common.json";

export const lng = localStorage.getItem("language") || "en";

i18next.init({
  interpolation: { escapeValue: false },
  lng: lng, // language to use
  resources: {
    en: {
      common: common_en
    },
    es: {
      common: common_es
    }
  }
});

export const changeLanguage = (lng: string) => {
  i18next.changeLanguage(lng, err => {
    if (err) {
      return console.log("something went wrong loading", err);
    } else {
      localStorage.setItem("language", lng);
    }
  });
};
