import React from "react";
import { Container, Typography } from "@material-ui/core";
import { useTranslation } from "react-i18next";

const Welcome = () => {
  const { t } = useTranslation("common");
  return (
    <Container maxWidth={"sm"}>
      <Typography variant={"body1"} style={{ fontWeight: "bold" }}>
        {t("data_download.step0.p1")}
      </Typography>
      <br />
      <Typography variant={"body2"}>{t("data_download.step0.p2")}</Typography>
      <br />
      <Typography variant={"body2"}>{t("data_download.step0.p3")}</Typography>
      <br />
      <Typography variant={"body2"}>{t("data_download.step0.p4")}</Typography>
      <br />
      <Typography variant={"body2"}>{t("data_download.step0.p5")}</Typography>
    </Container>
  );
};

export default Welcome;
