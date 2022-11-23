import React from "react";
import WhoSpanish from "../assets/img/WHO-SP-C-H.png";
import WhoFrench from "../assets/img/WHO-FR-C-H.png";
import WhoEnglish from "../assets/img/who-logo-blue.png";
import styled from "styled-components";

const StyledImage = styled.img`
    width: 100px;
    height: auto;
`;

const StyledEnglishImage = styled(StyledImage)<{ width?: string }>`
    max-width: 200px;
    width: ${props => (props.width ? props.width : "100%")};
`;

const StyledSpanFrenImage = styled(StyledImage)<{ width?: string }>`
    max-width: 180px;
    width: ${props => (props.width ? props.width : "100%")};
`;

const WhoLogoBlue = ({ width }: { width?: string }) => {
    const lng = localStorage.getItem("language");

    switch (lng) {
        case "es":
            return <StyledSpanFrenImage src={WhoSpanish} alt="WHO spanish logo" width={width} />;
        case "fr":
            return <StyledSpanFrenImage src={WhoFrench} alt="WHO french logo" width={width} />;
        default:
            return <StyledEnglishImage src={WhoEnglish} alt="WHO english logo" width={width} />;
    }
};

export default WhoLogoBlue;
