import React from "react";
import styled from "styled-components";
import { Typography } from "@mui/material";
import { ContentDiv, Props, StyledImg } from "./AboutPage";
import DataGraphic from "../../assets/img/about-page/data-graphic.svg";

interface DataOriginProps {
    width: number;
}

const DataOriginDiv = styled.div`
    display: flex;
    margin: 64px auto;
    align-items: center;
    @media (max-width: 768px) {
        flex-direction: column;
    }
`;
const DataOriginContentDiv = styled.div<Props>`
    margin-right: 30px;
    display: flex;
    flex-direction: column;
    width: ${props => `${props.windowWidth * 0.83 * 0.5}px`};
    @media (max-width: 768px) {
        width: 100%;
        text-align: center;
    }
`;
const DataOriginGraphDiv = styled.div<Props>`
    width: ${props => `${props.windowWidth * 0.83 * 0.5}px`};
    @media (max-width: 768px) {
        width: 100%;
    }
`;

const DataOrigin = ({ width }: DataOriginProps) => {
    return (
        <ContentDiv windowWidth={width}>
            <DataOriginDiv>
                <DataOriginContentDiv windowWidth={width}>
                    <Typography variant="h4" fontWeight="bold" color="inherit" marginBottom="25px">
                        Where does the data come from?
                    </Typography>
                    <Typography variant="body2" color={"inherit"}>
                        Data is collected by National Malaria Programmes, their implementation partners, research
                        institutes and non-governmental organizations. They are either provided directly to WHO Global
                        Malaria Programme (GMP) or extracted from publications. All data are quality controlled,
                        incorporated into WHO global databases and then published to the Malaria Threats Map.
                    </Typography>
                </DataOriginContentDiv>
                <DataOriginGraphDiv windowWidth={width}>
                    <StyledImg src={DataGraphic} maxHeight={373} maxWidth={644} alt="graph" />
                </DataOriginGraphDiv>
            </DataOriginDiv>
        </ContentDiv>
    );
};

export default DataOrigin;
