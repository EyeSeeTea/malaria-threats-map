import { Typography } from "@material-ui/core";
import React from "react";
import { Footer, StepProps } from "../MalariaTour";
import { useTranslation } from "react-i18next";

export default function Step5(options: StepProps) {
  const { t } = useTranslation("tour");
  return (
    <>
      <>
        <Typography variant="body2">{t("steps.5.p1")}</Typography>
      </>
      <Footer {...options} current={5} total={10} />
    </>
  );
}
