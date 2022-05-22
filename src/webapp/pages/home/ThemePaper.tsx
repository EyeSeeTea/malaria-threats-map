import React from "react";
import styled from "styled-components";
import { Typography, Paper, Button } from "@mui/material";
import { useTranslation, TFunction } from "react-i18next";
import { useWindowDimensions } from "../../components/hooks/use-window-dimensions";
import { themePaperColors } from "./HomePage";

interface ThemePaperProps {
    icon: string;
    altText: string;
    title: string;
    subtitle: string;
    color: string;
    colorOpaque: string;
    t: TFunction<"translation", undefined>;
}
interface StyledPaperProps {
    color: string;
    height: number;
}
const StyledPaper = styled(Paper)<StyledPaperProps>`
    background-color: ${props => props.color};
    display: flex;
    padding: ${props =>
        props.color === themePaperColors.treatmentColor ? `${props.height * 0.04}px 25px` : `${props.height * 0.04}px`};

    @media (max-width: 1024px) {
        padding: ${props =>
            props.color === themePaperColors.treatmentColor
                ? `${props.height * 0.04}px 25px 20px 20px`
                : `${props.height * 0.04}px`};
    }
`;

const BottomPaper = styled(StyledPaper)`
    flex-direction: column;
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
        background-color: #343434;
        width: 180px;
        font-weight: bold;
        text-align: center;
        margin: auto 0;
    }
`;

const StyledImage = styled.img`
    width: 100%;
    max-width: 150px;
    max-height: 150px;
    @media (max-width: 1024px) {
        height: 100px;
    }
`;

const ThemePaper = ({ icon, altText, title, subtitle, color, colorOpaque }: ThemePaperProps) => {
    const { t } = useTranslation();
    const { height } = useWindowDimensions();

    return (
        <div>
            <StyledPaper elevation={0} square color={color} height={height}>
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
            <BottomPaper elevation={0} square color={colorOpaque} height={height}>
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
