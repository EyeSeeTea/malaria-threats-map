import { Button } from "@material-ui/core";
import ZoomIcon from "@material-ui/icons/ZoomIn";
import * as React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

const Wrapper = styled.div`
  margin-top: 10px;
`;

export const ChartContainer = styled.div`
  max-width: 700px;
  width: 100%;
`;

export const Actions = styled.div`
  display: flex;
`;

export const FlexGrow = styled.div`
  flex-grow: 1;
`;

export function ZoomButton({ onClick }: { onClick: any }) {
  const { t } = useTranslation("common");
  return (
    <Wrapper>
      <Button
        variant="contained"
        color="default"
        size="small"
        onClick={onClick}
      >
        <ZoomIcon />
        {t("chart.zoom")}
      </Button>
    </Wrapper>
  );
}
