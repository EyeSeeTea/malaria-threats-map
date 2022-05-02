import React from "react";
import styled from "styled-components";
import { Typography, Paper, Button } from "@mui/material";

interface ThemePaperProps {
    icon: string;
    altText: string;
    title: string;
    subtitle: string;
    color: string;
    colorOpaque: string;
    }

const StyledPaper = styled(Paper)`
    background-color: ${props => props.color };
    display: flex; 
    flex-direction: column; 
    padding: ${props => props.color === "#5CCDCE" ? "40px 25px": "40px"};
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

 const ThemePaper = ({
    icon,
    altText,
    title,
    subtitle,
    color,
    colorOpaque }: ThemePaperProps) => {
return (
    <div>
        <StyledPaper elevation={0} square color={color}>
            <Flex>
                <img src={icon} alt={altText}/>
                <div style={{paddingLeft: 40}}>
                    <ThemeTitle gutterBottom variant="h4" textAlign="left">{title}</ThemeTitle>
                    <Typography gutterBottom variant="body1" component="div" textAlign="left">{subtitle}</Typography>
                </div>
            </Flex>
        </StyledPaper>
        <StyledPaper elevation={0} square color={colorOpaque}>
            <FlexSpaceBetween>
                <FlexColumn>
                    <Typography gutterBottom variant="body1" component="div" textAlign="left">
                        <strong>Number of studies:</strong> 23820
                    </Typography>
                    <Typography gutterBottom variant="body1" component="div" textAlign="left">
                    <strong>Database last updated:</strong> 28/09/2021
                    </Typography>
                </FlexColumn>
                <StyledCardButton size="large" variant="contained">Read Story</StyledCardButton>
            </FlexSpaceBetween>
        </StyledPaper> 
    </div>
);
};
export default ThemePaper;