import React from "react";
import styled from "styled-components";
import { Typography } from "@mui/material";
import { Props } from "./AboutPage";
import OverviewMaps from "../../assets/img/about-page/about-overview-maps.svg";
import OverviewResearchEfforts from "../../assets/img/about-page/about-overview-research-efforts.png";
import OverviewCountries from "../../assets/img/about-page/about-overview-countries.png";

interface MapFunctionalityProps {
    width: number;
}
interface StyledImgProps {
    maxWidth: number;
    maxHeight: number;
}
const FlexRowSpaceBetweenDiv = styled.div`
    display: flex;
    justify-content: space-between;
`;
const StyledImg = styled.img<StyledImgProps>`
    width: 100%;
    height: auto;
    max-width: ${props => `${props.maxWidth}px`};
    max-height: ${props => `${props.maxHeight}px`};
`;
const VideoImage = styled(StyledImg)<StyledImgProps>`
    box-shadow: 0px 5px 10px #00000029;
    border-radius: 20px;
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

const MapFunctionalityInnerDiv = styled.div<Props>`
    display: flex;
    flex-direction: column;
    width: ${props => `${props.windowWidth * 0.83}px`};
    margin: auto;
`;

const MapFunctionalityDiv = styled(FlexRowSpaceBetweenDiv)`
    background-color: #f7f7f7;
    margin: auto;
    padding: 64px;
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
const MapFunctionality = ({ width }: MapFunctionalityProps) => {
    return (
        <MapFunctionalityDiv>
            <MapFunctionalityInnerDiv windowWidth={width}>
                <VideoTitle variant="h4" fontWeight="bold" color="inherit" marginBottom="58px" textAlign="center">
                    Watch: Find out about the functionality of the maps within the MTM
                </VideoTitle>
                <VideoGalleryDiv>
                    <VideoDiv>
                        <MapOverviewDiv>
                            <StyledImg
                                src={OverviewMaps}
                                alt="Illustration of the 4 malaria map types"
                                maxWidth={262}
                                maxHeight={250}
                            />
                        </MapOverviewDiv>
                        <VideoDescription variant="h6">
                            <strong>Watch:</strong> An overview of the maps
                        </VideoDescription>
                    </VideoDiv>
                    <VideoDiv>
                        <VideoImage
                            src={OverviewResearchEfforts}
                            alt="A researcher looking at the MTM map"
                            maxWidth={356}
                            maxHeight={270}
                        />
                        <VideoDescription variant="h6">
                            <strong>Watch:</strong> How is the MTM supporting research efforts?
                        </VideoDescription>
                    </VideoDiv>
                    <VideoDiv>
                        <VideoImage
                            src={OverviewCountries}
                            alt="A doctor and a patient performing malaria treatment"
                            maxWidth={356}
                            maxHeight={270}
                        />
                        <VideoDescription variant="h6">
                            <strong>Watch:</strong> How is the MTM supporting countries?
                        </VideoDescription>
                    </VideoDiv>
                </VideoGalleryDiv>
            </MapFunctionalityInnerDiv>
        </MapFunctionalityDiv>
    );
};

export default MapFunctionality;
