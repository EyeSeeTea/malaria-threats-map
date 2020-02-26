import React from "react";
import {
  Card,
  createStyles,
  makeStyles,
  Theme,
  Typography
} from "@material-ui/core";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: "24px"
    }
  })
);

const Welcome = () => {
  const { t } = useTranslation("common");
  const classes = useStyles({});
  return (
    <Card className={classes.paper}>
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
    </Card>
  );
};

export default Welcome;
