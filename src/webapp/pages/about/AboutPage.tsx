import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Typography } from "@mui/material";

import HomepageMap from "../../assets/img/homepage-map.png";
import Footer from "../Footer";
import Header from "../Header";
import { useWindowDimensions } from "../../components/hooks/use-window-dimensions";
import DataOrigin from "./DataOrigin";
import MapFunctionality from "./MapFunctionality";
import Challenges from "./Challenges";
import UserExperience from "./UserExperience";

export interface Props {
    windowWidth: number;
}

export interface StyledImgProps {
    maxWidth: number;
    maxHeight: number;
}

export const StyledImg = styled.img<StyledImgProps>`
    width: 100%;
    height: auto;
    max-width: ${props => `${props.maxWidth}px`};
    max-height: ${props => `${props.maxHeight}px`};
`;

export const ContentDiv = styled.div<Props>`
    width: ${props => `${props.windowWidth * 0.83}px`};
    margin: auto;
`;

const StyledBanner = styled.div`
    display: block;
    position: relative;
    backgroundattachment: fixed;
    margin: 0;
    left: 0;
    width: 100%;
    background: linear-gradient(90deg, #bbd7e8 0%, #bbd7e800 100%), url(${HomepageMap});
    background-position: right;
    max-height: 600px;
    height: 373px;
    opacity: 1;
`;

const BannerContentDiv = styled.div<Props>`
    display: flex;
    align-items: center;
    width: ${props => `${props.windowWidth * 0.83}px`};
    margin: auto;
    margin-top: 81px;
`;

export const AboutPage = () => {
    const { t } = useTranslation();
    const { width } = useWindowDimensions();

    return (
        <React.Fragment>
            <StyledBanner>
                <Header t={t} />
                <BannerContentDiv windowWidth={width}>
                    <Typography variant="h3" color="inherit" textTransform="uppercase" fontSize={46}>
                        Learn More About <br /> <strong>The Malaria Threats Map</strong>
                    </Typography>
                </BannerContentDiv>
            </StyledBanner>
            <DataOrigin width={width} />
            <MapFunctionality width={width} />
            <Challenges width={width} />
            <UserExperience width={width} />
            <Footer t={t} />
        </React.Fragment>
    );
};
