import React from "react";
import styled from "styled-components";
import { Card, CardActions, CardContent, CardMedia, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

interface MediaCardProps {
    title: string;
    subtitle: string;
    buttonText: string;
    image: string;
    altText: string;
    buttonLink?: string;
}
const StyledCardButton = styled(Button)`
    &.MuiButton-root {
        color: white;
        font-size: 1rem;
        background-color: #343434;
        width: 250px;
        font-weight: bold;
        text-align: center;
    }
`;

const StyledCard = styled(Card)`
    max-width: 356px;
    border-radius: 15px;
    box-shadow: 0px 4px 10px #00000033;
    @media(max-width: 1024px) {
        margin-top: 20px;
    }
`;

const StyledCardActions = styled(CardActions)`
    padding-bottom: 30px;
`;

const StyledCardContent = styled(CardContent)`
    padding: 20px 50px;
`;

const StyledLink = styled(Link)`
    margin: auto;
`;

const MediaCard = ({ title, subtitle, buttonText, image, altText, buttonLink }: MediaCardProps) => {
    return (
        <StyledCard>
            <CardMedia
                component="img"
                height="230"
                image={image}
                alt={altText}
                style={{ width: "94%", margin: "auto", padding: 10, borderRadius: "25px 25px 0 0" }}
            />
            <StyledCardContent>
                <Typography gutterBottom variant="h5" component="div" textAlign="center" fontWeight="bold">
                    {title}
                </Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ color: "black" }}>
                    {subtitle}
                </Typography>
            </StyledCardContent>
            <StyledCardActions>
                <StyledLink to={buttonLink || "#"} replace>
                    <StyledCardButton size="large" variant="contained">
                        {buttonText}
                    </StyledCardButton>
                </StyledLink>
            </StyledCardActions>
        </StyledCard>
    );
};

export default MediaCard;
