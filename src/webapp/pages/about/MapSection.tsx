import React from "react";
import styled from "styled-components";
import { Container, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

const Section = styled.section`
    background-color: #f7f7f7;
    padding: 10vmin 4vmin 4vmin 4vmin;
`;

const Video = styled.iframe`
    box-shadow: 0px 5px 10px #00000029;
    border-radius: 20px;
    aspect-ratio: 1.3;
`;

const VideoContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const MapSection = () => {
    const { t } = useTranslation();

    const videos = React.useMemo(
        () => [
            {
                src: t("common.aboutPage.mapSection.video1.url"),
                alt: t("common.aboutPage.mapSection.video1.alt"),
                title: t("common.aboutPage.mapSection.video1.title"),
            },
            {
                src: t("common.aboutPage.mapSection.video2.url"),
                alt: t("common.aboutPage.mapSection.video2.alt"),
                title: t("common.aboutPage.mapSection.video2.title"),
            },
            {
                src: t("common.aboutPage.mapSection.video3.url"),
                alt: t("common.aboutPage.mapSection.video3.alt"),
                title: t("common.aboutPage.mapSection.video3.title"),
            },
        ],
        [t]
    );

    return (
        <Section>
            <Container maxWidth="xl">
                <Typography variant="h4" fontWeight="bold" color="inherit" marginBottom="10vmin" align="center">
                    {t("common.aboutPage.mapSection.title")}
                </Typography>
                <Grid container spacing={6} sx={{ marginBottom: 6 }} justifyContent="center">
                    {videos.map((video, index) => {
                        return (
                            <Grid key={index} item md={4} xs={12}>
                                <VideoContainer>
                                    <Video
                                        src={video.src}
                                        title={video.alt}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                    <Typography variant="h6" sx={{ marginTop: 3 }}>
                                        <strong>{t("common.aboutPage.mapSection.videoLabel")}</strong> {video.title}
                                    </Typography>
                                </VideoContainer>
                            </Grid>
                        );
                    })}
                </Grid>
            </Container>
        </Section>
    );
};

export default MapSection;
