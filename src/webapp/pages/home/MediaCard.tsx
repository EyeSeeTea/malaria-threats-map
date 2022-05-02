import React from "react";
import styled from "styled-components";
import { Card, CardActions, CardContent, CardMedia, Button, Typography } from "@mui/material";

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
    margin: auto;
}
`;

const StyledCard = styled(Card)`
    max-width: 430px;
    border-radius: 15px;
    box-Shadow: 0px 4px 10px #00000033;
`

const StyledCardMedia = styled(CardMedia)`
    width: 94%;
    margin: auto; 
    padding: 10px;
    border-radius: 25px 25px 0 0;    
`

const StyledCardActions = styled(CardActions)`
    padding-bottom: 35px;
`;

const StyledCardContent = styled(CardContent)`
    padding: 20px 50px;
`
const MediaCard = ({title, subtitle, buttonText, image, altText }: MediaCardProps) => {
    return (
      <StyledCard>
        <CardMedia
          component="img"
          height="230"
          image={image}
          alt={altText}
          style={{width: "94%", margin: "auto", padding: 10, borderRadius: "25px 25px 0 0"}}
        />
        <StyledCardContent>
          <Typography gutterBottom variant="h5" component="div" textAlign="center" fontWeight= "bold">
            {title}
          </Typography>
          <Typography variant="h6" color="text.secondary" textAlign="center" sx={{color: "black", fontSize: 18}}>{subtitle}</Typography>
        </StyledCardContent>
        <StyledCardActions>
            <StyledCardButton size="large" variant="contained">{buttonText}</StyledCardButton>
        </StyledCardActions>
      </StyledCard>
    );
  };

  export default MediaCard;