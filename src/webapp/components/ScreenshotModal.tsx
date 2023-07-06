import React, { useCallback, useRef } from "react";
import _ from "lodash";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Modal, Button, Box } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

import { downloadHtmlElement } from "../utils/downloadHtmlElement";

interface ScreenshotModalProps {
    open?: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    backgroundColor?: string;
    exclusionClasses?: string[]
}

function ScreenshotModal({ open = false, onClose, title, backgroundColor, exclusionClasses, children }: ScreenshotModalProps) {
    const { t } = useTranslation();
    const ref = useRef<HTMLDivElement>(null)

    const handleDownload = useCallback(() => {
        downloadHtmlElement(ref.current, title.replace('.', '_'), { backgroundColor, exclusionClasses });
    }, [backgroundColor, exclusionClasses, title]);

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
           <StyledBox backgroundColor={backgroundColor}>
                <Header>
                    <Title>{_.capitalize(title)}</Title>
                    <StyledScreenshotButton variant="contained" onClick={handleDownload}>
                        <DownloadIcon />
                        {t("common.screenshot.download_screenshot")}
                    </StyledScreenshotButton>
                </Header>
                <Content>
                    <ScreenshotContainer className="screenshot-container" ref={ref}>
                        {children}
                    </ScreenshotContainer>
                </Content>
            </StyledBox>
        </Modal>
    );
}

export default ScreenshotModal;

const StyledBox = styled(Box)<{ backgroundColor: string }>`
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    top: 54%;
    width: 90vw;
    height: 90vh;
    background-color: ${props => props?.backgroundColor ?? "#FFFFFF" };
    border-radius: 10px;
`;

const Title = styled.h2`
    font-size: 20px;
    font-weight: bold;
    color: #343434;
    margin: 0;
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
    * {
        pointer-events: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
`;

const Header = styled.div`
    box-shadow: 0px 2px 0px #00000029;
    min-height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;
    position: relative;
    z-index: 1;
    background-color: white;
    margin: 3px 3px 0 3px;
`;
