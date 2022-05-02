import React from "react";
import styled from "styled-components";
import { Typography, Paper, Button } from "@mui/material";
import { useTranslation } from "react-i18next";

interface ThemePaperProps {
    icon: string;
    altText: string;
    title: string;
    subtitle: string;
    color: string;
    colorOpaque: string;
}

const StyledPaper = styled(Paper)`
    background-color: ${props => props.color};
    display: flex;
    flex-direction: column;
    padding: ${props => (props.color === "#5CCDCE" ? "40px 25px" : "40px")};
`;

const ThemeTitle = styled(Typography)`
    font-weight: bold;
    color: white;
`;

const Flex = styled.div`
    display: flex;
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

const ThemePaper = ({ icon, altText, title, subtitle, color, colorOpaque }: ThemePaperProps) => {
    const { t } = useTranslation();

    return (
        <div>
            <StyledPaper elevation={0} square color={color}>
                <Flex>
                    <img src={icon} alt={altText} />
                    <div style={{ paddingLeft: 40 }}>
                        <ThemeTitle gutterBottom variant="h4" textAlign="left">
                            {title}
                        </ThemeTitle>
                        <Typography gutterBottom variant="body1" component="div" textAlign="left">
                            {subtitle}
                        </Typography>
                    </div>
                </Flex>
            </StyledPaper>
            <StyledPaper elevation={0} square color={colorOpaque}>
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
            </StyledPaper>
        </div>
    );
};
export default ThemePaper;
