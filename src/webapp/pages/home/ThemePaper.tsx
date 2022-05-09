import React from "react";
import styled from "styled-components";
import { Typography, Paper, Button } from "@mui/material";
import { useTranslation, TFunction } from "react-i18next";

interface ThemePaperProps {
    icon: string;
    altText: string;
    title: string;
    subtitle: string;
    color: string;
    colorOpaque: string;
    t: TFunction<"translation", undefined>;
}

const StyledPaper = styled(Paper)`
    background-color: ${props => props.color};
    display: flex;
    padding: ${props =>
        props.color === "#5CCDCE" ? `${window.innerHeight * 0.04}px 25px` : `${window.innerHeight * 0.04}px`};
`;

const BottomPaper = styled(StyledPaper)`
    flex-direction: column;
    height: 80px;
`;

const ThemeTitle = styled(Typography)`
    font-weight: bold;
    color: white;
`;

const Flex = styled.div`
    display: flex;
`;

const ThemeInfoDiv = styled.div`
    padding-left: 40px;
`;
const FlexSpaceBetween = styled(Flex)`
    justify-content: space-between;
`;

const FlexColumn = styled(Flex)`
    flex-direction: column;
`;

const StyledCardButton = styled(Button)`
    &.MuiButton-root {
        color: white;
        font-size: 1rem;
        background-color: #343434;
        width: 250px;
        font-weight: bold;
        text-align: center;
        margin: auto 0;
    }
`;
const StyledImage = styled.img`
    width: 100%;
    max-width: 150px;
    max-height: 150px;
`;

const ThemePaper = ({ icon, altText, title, subtitle, color, colorOpaque }: ThemePaperProps) => {
    const { t } = useTranslation();

    return (
        <div>
            <StyledPaper elevation={0} square color={color}>
                <StyledImage src={icon} alt={altText} />
                <ThemeInfoDiv>
                    <ThemeTitle gutterBottom variant="h5" textAlign="left">
                        {title}
                    </ThemeTitle>
                    <Typography gutterBottom variant="body1" component="div" textAlign="left">
                        {subtitle}
                    </Typography>
                </ThemeInfoDiv>
            </StyledPaper>
            <BottomPaper elevation={0} square color={colorOpaque}>
                <FlexSpaceBetween>
                    <FlexColumn>
                        <Typography gutterBottom variant="body1" component="div" textAlign="left">
                            <strong>{t("common.legend.number_of_studies")}:</strong> 23820
                        </Typography>
                        <Typography gutterBottom variant="body1" component="div" textAlign="left">
                            <strong>{t("common.homepage.media_cards.db_last_updated")}:</strong> 28/09/2021
                        </Typography>
                    </FlexColumn>
                    <StyledCardButton size="large" variant="contained">
                        {t("common.homepage.media_cards.read_story")}
                    </StyledCardButton>
                </FlexSpaceBetween>
            </BottomPaper>
        </div>
    );
};
export default ThemePaper;
