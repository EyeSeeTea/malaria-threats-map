import React from "react";
import styled from "styled-components";
import { Button, Card, CardActions, CardContent, CardMedia, Container, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import Dashboards from "../../assets/img/home-page/dashboards.png";
import DataDownload from "../../assets/img/home-page/data_download.png";
import Maps from "../../assets/img/maps.png";
import { Link } from "react-router-dom";

const Section = styled.section`
    margin-top: -250px;
    @media (max-width: 768px) {
        margin-top: -150px;
    }
`;

const RoundedCard = styled(Card)`
    border-radius: 12px;
    aspect-ratio: 1/1.1;
    display: flex;
    flex-direction: column;
`;

const StyledCardContent = styled(CardContent)`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

interface StyledCardMediaProps {
    image: string;
}

const StyledCardMedia = styled(CardMedia).attrs<StyledCardMediaProps>(props => ({
    component: "img",
    height: "100%",
    image: props.image,
}))`
    width: 96%;
    padding: 9px;
    border-radius: 15px 15px 0 0;
`;

const StyledLink = styled(Link)`
    margin: auto;
    text-decoration: none;
`;

const StyledCardButton = styled(Button)`
    &.MuiButton-root {
        color: white;
        background-color: #343434;
        width: 207px;
        font-weight: bold;
        text-align: center;
        padding: 5px 15px;
        margin-bottom: 16px;
    }
`;

const LinkCardsSection: React.FC = () => {
    const { t } = useTranslation();

    const cards = React.useMemo(
        () => [
            {
                path: "/maps",
                image: Maps,
                title: t("common.homepage.media_cards.maps.title"),
                text: t("common.homepage.media_cards.maps.subtitle"),
                buttonText: t("common.homepage.media_cards.maps.button_text"),
            },
            {
                path: "/dashboards",
                image: Dashboards,
                title: t("common.homepage.media_cards.dashboards.title"),
                text: t("common.homepage.media_cards.dashboards.subtitle"),
                buttonText: t("common.homepage.media_cards.dashboards.button_text"),
            },
            {
                path: "/download",
                image: DataDownload,
                title: t("common.homepage.media_cards.data_download.title"),
                text: t("common.homepage.media_cards.data_download.subtitle"),
                buttonText: t("common.homepage.media_cards.data_download.button_text"),
            },
        ],
        [t]
    );

    return (
        <Section>
            <Container maxWidth="xl">
                <Grid container spacing={7} sx={{ marginBottom: 6 }} justifyContent="center">
                    {cards.map((card, index) => {
                        return (
                            <Grid key={index} item md={4} xs={12}>
                                <RoundedCard sx={{ minHeight: 300 }}>
                                    <Link to={card.path}>
                                        <StyledCardMedia image={card.image} />
                                    </Link>
                                    <StyledCardContent>
                                        <Typography
                                            gutterBottom
                                            variant="h5"
                                            component="div"
                                            textAlign="center"
                                            fontWeight="bold"
                                        >
                                            {card.title}
                                        </Typography>
                                        <Typography variant="body1" color="black" textAlign="center">
                                            {card.text}
                                        </Typography>
                                    </StyledCardContent>
                                    <CardActions>
                                        <StyledLink to={card.path}>
                                            <StyledCardButton size="large" variant="contained">
                                                {card.buttonText}
                                            </StyledCardButton>
                                        </StyledLink>
                                    </CardActions>
                                </RoundedCard>
                            </Grid>
                        );
                    })}
                </Grid>
            </Container>
        </Section>
    );
};

export default LinkCardsSection;
