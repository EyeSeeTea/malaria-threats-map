import React, { useCallback, useRef } from "react";
import _ from "lodash";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Modal, Button, Box } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

import { downloadHtmlElement } from "../pages/dashboards/utils";

interface ScreenshotModalProps {
    open?: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

function ScreenshotModal({ open = false, onClose, title, children }: ScreenshotModalProps) {
    const { t } = useTranslation();
    const ref = useRef<HTMLDivElement>(null)

    const handleDownload = useCallback(() => {
        downloadHtmlElement(ref.current, title);
    }, [ref, title]);

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
           <StyledBox>
                <Header>
                    <Title>{_.capitalize(title)}</Title>
                    <StyledScreenshotButton variant="contained" onClick={handleDownload}>
                        <DownloadIcon />
                        {t("common.screenshot.download_screenshot")}
                    </StyledScreenshotButton>
                </Header>
                <Content>
                    <ScreenshotContainer className="screenshotRef" ref={ref}>
                        {children}
                    </ScreenshotContainer>
                </Content>
            </StyledBox>
        </Modal>
    );
}

export default ScreenshotModal;

const StyledBox = styled(Box)`
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    top: 54%;
    width: 90vw;
    height: 90vh;
    background-color: #F7F7F7;
    border-radius: 10px;
`;

const Title = styled.h2`
    font-size: 20px;
    font-weight: bold;
    color: #343434;
`;

const StyledScreenshotButton = styled(Button)`
    background-color: #2fb3af;
    color: white;
    display: flex;
    gap: 5px;
    flex-wrap: nowrap;
`;

const Content = styled.div`
    overflow: auto;
    width: calc(100% - 5px);
    height: calc(100% - 65px);
    margin-top: 2px;
    margin-left: 2px;
`;

const ScreenshotContainer = styled.div`
    width: fit-content;
`;

const Header = styled.div`
    box-shadow: 0px 2px 0px #00000029;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;
`;
