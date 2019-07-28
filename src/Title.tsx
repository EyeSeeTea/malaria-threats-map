import * as React from "react";
import { useTranslation } from "react-i18next";
import { changeLanguage } from "./config/i18next";

const Title = () => {
  const { t }: any = useTranslation("common");
  return (
    <React.Fragment>
      <button onClick={() => changeLanguage("en")}>Translate</button>
      <h1>{t("welcome.title", { framework: "react-i18next" })}</h1>
    </React.Fragment>
  );
};
export default Title;
