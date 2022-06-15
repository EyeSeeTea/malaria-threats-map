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
        background-color: #343434;
        width: 207px;
        font-weight: bold;
        text-align: center;
        padding: 5px 15px;
    }
`;

const StyledCard = styled(Card)`
    max-width: 356px;
    border-radius: 15px;
    box-shadow: 0px 4px 10px #00000033;
    @media (max-width: 1300px) {
        margin: 12px auto;
    }
`;

const StyledCardActions = styled(CardActions)`
    padding-bottom: 30px;
`;

const StyledCardContent = styled(CardContent)`
    padding: 17px 50px 22px 50px;
`;

const StyledLink = styled(Link)`
    margin: auto;
    color: inherit;
    text-decoration: none;
`;
interface StyledCardMediaProps {
    image: string;
}
const StyledCardMedia = styled(CardMedia).attrs<StyledCardMediaProps>(props => ({
    component: "img",
    height: "176",
    image: props.image,
}))`
    width: 94%;
    margin: auto;
    padding: 9px;
    border-radius: 15px 15px 0 0;
`;

const MediaCard = ({ title, subtitle, buttonText, image, buttonLink }: MediaCardProps) => {
    return (
        <StyledCard>
            <StyledCardMedia image={image} />
            <StyledCardContent>
                <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    textAlign="center"
                    fontWeight="bold"
                    marginBottom={"17px"}
                >
                    {title}
                </Typography>
                <Typography variant="body2" color="black" textAlign="center">
                    {subtitle}
                </Typography>
            </StyledCardContent>
            <StyledCardActions>
                <StyledLink to={buttonLink || "#"}>
                    <StyledCardButton size="large" variant="contained">
                        {buttonText}
                    </StyledCardButton>
                </StyledLink>
            </StyledCardActions>
        </StyledCard>
    );
};

export default MediaCard;
