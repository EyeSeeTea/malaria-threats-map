import { Button } from "@material-ui/core";
import ZoomIcon from "@material-ui/core/SvgIcon/SvgIcon";
import * as React from "react";
import { useTranslation } from "react-i18next";

export function ZoomButton({ onClick }: { onClick: any }) {
  const { t } = useTranslation("common");
  return (
    <Button variant="contained" color="default" size="small" onClick={onClick}>
      <ZoomIcon />
      {t("chart.zoom")}
    </Button>
  );
}
