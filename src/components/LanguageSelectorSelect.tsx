import React from "react";
import { changeLanguage } from "../config/i18next";
import IntegrationReactSelect from "./BasicSelect";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { sendAnalytics } from "../utils/analytics";

const LANGUAGES = [
  {
    value: "en",
    label: "English",
    code: "en"
  },
  {
    value: "es",
    label: "Español",
    code: "es"
  },
  {
    value: "fr",
    label: "Français",
    code: "fr"
  }
];

export default function LanguageSelectorSelect(props: { section?: string }) {
  function handleChange(selection: any) {
    const language = selection.value;
    changeLanguage(language);
    const { section } = props;
    if (section)
      sendAnalytics({ type: "event", category: section, action: "language", label: language });
  }
  useTranslation("common");
  const language = i18next.language || window.localStorage.i18nextLng;

  return (
    <IntegrationReactSelect
      id={"language"}
      suggestions={LANGUAGES}
      onChange={handleChange}
      value={LANGUAGES.find(lg => lg.value === language)}
    />
  );
}
