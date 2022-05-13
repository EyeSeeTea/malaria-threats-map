import React from "react";
import WhoSpanish from "../assets/img/WHO-SP-C-H.png";
import WhoFrench from "../assets/img/WHO-FR-C-H.png";
import WhoEnglish from "../assets/img/who-logo-blue.png";
import styled from "styled-components";

const StyledImage = styled.img`
    width: 100%;
    max-height: 50px;
`;

const StyledEnglishImage = styled(StyledImage)`
    max-width: 150px;
`;

const StyledSpanFrenImage = styled(StyledImage)`
    max-width: 180px;
`;

const WhoLogoBlue = () => {
    const lng = localStorage.getItem("language");

    switch (lng) {
        case "es":
            return <StyledSpanFrenImage src={WhoSpanish} alt="WHO spanish logo" />;
        case "fr":
            return <StyledSpanFrenImage src={WhoFrench} alt="WHO french logo" />;
        default:
            return <StyledEnglishImage src={WhoEnglish} alt="WHO english logo" />;
    }
};

export default WhoLogoBlue;
