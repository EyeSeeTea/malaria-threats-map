import { Button } from "@mui/material";
import ZoomIcon from "@mui/icons-material/ZoomIn";
import * as React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

const Wrapper = styled.div`
    margin-top: 10px;
`;

export const ChartContainer = styled.div`
    max-width: 700px;
    width: 100%;
    padding: ${(props: { popup?: boolean }) => (props?.popup ? "0" : "20px")};
`;

export const Actions = styled.div`
    display: flex;
`;

export const Flex = styled.div`
    display: flex;
`;

export const FlexGrow = styled.div`
    flex-grow: 1;
`;

export function ZoomButton({ onClick, text }: { onClick: any; text?: string }) {
    const { t } = useTranslation();
    return (
        <Wrapper>
            <Button variant="contained" size="small" onClick={onClick}>
                <ZoomIcon />
                {text ?? t("common.chart.zoom")}
            </Button>
        </Wrapper>
    );
}
