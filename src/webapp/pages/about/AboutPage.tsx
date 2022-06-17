import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Typography } from "@mui/material";

import HomepageMap from "../../assets/img/homepage-map.png";
import Header from "../layout/Header";
import { useWindowDimensions } from "../../components/hooks/use-window-dimensions";
import DataOrigin from "./DataOrigin";
import MapFunctionality from "./MapFunctionality";
import Challenges from "./Challenges";
import UserExperience from "./UserExperience";
import Footer from "../layout/Footer";

export interface WindowProps {
    windowWidth: number;
}

export interface StyledImgProps {
    maxWidth: number;
    maxHeight: number;
}

export const ContentDiv = styled.div<WindowProps>`
    width: ${props => `${props.windowWidth * 0.83}px`};
    margin: auto;
`;

const StyledBanner = styled.div`
    display: block;
    position: relative;
    background-attachment: fixed;
    margin: 0;
    left: 0;
    width: 100%;
    background: linear-gradient(90deg, #bbd7e8 0%, #bbd7e800 100%), url(${HomepageMap});
    background-position: right;
    max-height: 900px;
    height: 373px;
    opacity: 1;
    @media (max-width: 765px) {
        height: 500px;
    }
    @media (max-width: 425px) {
        height: auto;
    }
`;

const BannerContentDiv = styled.div<WindowProps>`
    display: flex;
    align-items: center;
    width: ${props => `${props.windowWidth * 0.83}px`};
    margin: auto;
    margin-top: 81px;

    @media (max-width: 1024px) {
        height: 80%;
        justify-content: flex-start;
        margin-top: 0;
    }
    @media (max-width: 765px) {
        height: 50%;
        justify-content: center;
        margin: auto;
    }
`;

export const AboutPage = () => {
    const { t } = useTranslation();
    const { width } = useWindowDimensions();

    return (
        <React.Fragment>
            <StyledBanner>
                <Header />
                <BannerContentDiv windowWidth={width}>
                    <Typography variant="h3" color="inherit" textTransform="uppercase">
                        Learn More About <br /> <strong>The Malaria Threats Map</strong>
                    </Typography>
                </BannerContentDiv>
            </StyledBanner>
            <DataOrigin width={width} />
            <MapFunctionality width={width} />
            <Challenges width={width} />
            <UserExperience width={width} />
            <Footer />
        </React.Fragment>
    );
};
