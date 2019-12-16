import { Typography } from "@material-ui/core";
import React from "react";
import { Footer, StepProps } from "../MalariaTour";
import { useTranslation } from "react-i18next";

export default function Step6(options: StepProps) {
  const { t } = useTranslation("tour");
  return (
    <>
      <>
        <Typography variant="body2">{t("tour.steps.6.p1")}</Typography>
      </>
      <Footer {...options} current={6} total={9} />
    </>
  );
}
