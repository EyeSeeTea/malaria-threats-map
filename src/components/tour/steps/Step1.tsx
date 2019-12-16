import { Typography } from "@material-ui/core";
import React from "react";
import { Footer, StepProps } from "../MalariaTour";
import { useTranslation } from "react-i18next";

export default function Step1(options: StepProps) {
  const { t } = useTranslation("tour");
  return (
    <>
      <>
        <Typography variant="subtitle1">
          <strong>{t("tour.steps.1.title")}</strong>
        </Typography>
        <Typography variant="body2">{t("tour.steps.1.p1")}</Typography>
        <Typography variant="body2">{t("tour.steps.1.p2")}</Typography>
      </>
      <Footer {...options} current={1} total={9} />
    </>
  );
}
