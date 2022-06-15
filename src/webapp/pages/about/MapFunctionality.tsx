import React from "react";
import styled from "styled-components";
import { Typography } from "@mui/material";
import { WindowProps } from "./AboutPage";

interface MapFunctionalityProps {
    width: number;
}

const FlexRowSpaceBetweenDiv = styled.div`
    display: flex;
    justify-content: space-between;
`;

const Video = styled.iframe`
    box-shadow: 0px 5px 10px #00000029;
    border-radius: 20px;
    width: 356px;
    height: 270px;
`;

const MapOverviewDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 270px;
    max-width: 356px;
    max-height: 270px;
    border-radius: 20px;
    background-color: #f2f5f7;
    box-shadow: 0px 5px 10px #00000029;
`;

const MapFunctionalityInnerDiv = styled.div<WindowProps>`
    display: flex;
    flex-direction: column;
    width: ${props => `${props.windowWidth * 0.83}px`};
    margin: auto;
`;

const MapFunctionalityDiv = styled(FlexRowSpaceBetweenDiv)`
    background-color: #f7f7f7;
    margin: auto;
    padding: 64px;
    @media (max-width: 425px) {
        padding: 64px 0;
    }
`;
const VideoGalleryDiv = styled(FlexRowSpaceBetweenDiv)`
    flex-wrap: wrap;
    @media (max-width: 1300px) {
        justify-content: space-around;
    }
`;
const VideoDiv = styled.div`
    display: flex;
    flex-direction: column;
    max-width: 356px;
    width: 100%;
    @media (max-width: 1300px) {
        margin-top: 55px;
    }
`;
const VideoTitle = styled(Typography)`
    @media (max-width: 1024px) {
        margin-bottom: 0;
    }
`;

const VideoDescription = styled(Typography)`
    margin-top: 33px;
    color: inherit;
    @media (max-width: 768px) {
        text-align: center;
    }
`;
interface VideoAttrs {
    src: string;
    alt: string;
    title: string;
}
type Video = Record<string, VideoAttrs>;

const videos: Video = {
    overview: {
        src: "https://www.youtube.com/embed/dU_xrzpbupU",
        alt: "Malaria Threats Map: tracking biological challenges to malaria control and elimination",
        title: "An overview of the maps",
    },
    research: {
        src: "https://www.youtube.com/embed/VP-pc9oN0dM",
        alt: "Malaria Threats Map: supporting research efforts",
        title: "How is the MTM supporting research efforts?",
    },
    countries: {
        src: "https://www.youtube.com/embed/mkggjD0DKwY",
        alt: "Malaria Threats Map: helping countries address critical threats for malaria control and elimination",
        title: "How is the MTM supporting countries?",
    },
};
const MapFunctionality = ({ width }: MapFunctionalityProps) => {
    return (
        <MapFunctionalityDiv>
            <MapFunctionalityInnerDiv windowWidth={width}>
                <VideoTitle variant="h4" fontWeight="bold" color="inherit" marginBottom="58px" textAlign="center">
                    Watch: Find out about the functionality of the maps within the MTM
                </VideoTitle>
                <VideoGalleryDiv>
                    {Object.entries(videos).map(([key], index) => {
                        return (
                            <VideoDiv key={index}>
                                <MapOverviewDiv>
                                    <Video
                                        src={videos[key].src}
                                        title={videos[key].alt}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></Video>
                                </MapOverviewDiv>
                                <VideoDescription variant="h6">
                                    <strong>Watch:</strong> {videos[key].title}
                                </VideoDescription>
                            </VideoDiv>
                        );
                    })}
                </VideoGalleryDiv>
            </MapFunctionalityInnerDiv>
        </MapFunctionalityDiv>
    );
};

export default MapFunctionality;
