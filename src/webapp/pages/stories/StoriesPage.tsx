import React from "react";
import { Grid, Stack, Typography } from "@mui/material";
import { Trans, useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import ImageBanner from "../common/ImageBanner";
import PreventionIcon from "../../assets/img/prevention-icon.svg";
import Map from "../../assets/img/stories-page/map.png";

import Layout from "../layout/Layout";
import StoryModeStepper from "../../components/StoryModeStepper";

type ThemeType = "prevention" | "invasive" | "treatment" | "diagnosis";

const TitleContainer = styled.div`
    display: flex;
    align-items: center;
    font-weight: lighter;
    font-size: 8vw;
    padding-left: 10px;
    max-width: 75%;
    @media (max-width: 768px) {
        max-width: 100%;
    }
`;

const PreventionImage = styled.img`
    width: 280px;
    @media (max-width: 1200px) {
        width: 210px;
    }
    @media (max-width: 768px) {
        width: 75%;
    }
`;

const MapImage = styled.img`
    width: 100%;
    height: auto;
`;

export const StoriesPage: React.FC = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();

    return (
        <Layout>
            <ImageBanner bgColor1="#5ABE86" bgColor2="#5abe8574">
                <Grid container spacing={3} height="100%">
                    <Grid item xs={4} display="flex" justifyContent={"right"} height={{ xs: "90%", md: "110%" }}>
                        <PreventionImage src={PreventionIcon} alt="prevention-icon" />
                    </Grid>
                    <Grid item xs={8} display="flex" justifyContent={"left"} paddingLeft="10px">
                        <TitleContainer>
                            <Stack gap={{ xs: 2, sm: 5 }}>
                                <Typography
                                    fontSize={{ xs: "20px", sm: "30px", md: "40px", lg: "50px", xl: "60px" }}
                                    component="h1"
                                    color="white"
                                    textTransform="uppercase"
                                >
                                    <Trans i18nKey={t(`common.storiesPage.${searchParams.get("theme")}.title`)} t={t}>
                                        {t(`common.storiesPage.${searchParams.get("theme")}.title`)}
                                    </Trans>
                                </Typography>
                                <Typography
                                    fontSize={{ xs: "14px", sm: "20px", md: "25px", lg: "30px" }}
                                    component="h4"
                                    color="white"
                                    fontWeight={"medium"}
                                >
                                    {t(`common.storiesPage.${searchParams.get("theme")}.description`)}
                                </Typography>
                            </Stack>
                        </TitleContainer>
                    </Grid>
                </Grid>
            </ImageBanner>
            <Grid
                container
                spacing={3}
                paddingX={"30px"}
                sx={{ width: "100%", marginLeft: "0px", paddingLeft: "0px", paddingRight: "0px" }}
            >
                <Grid item xs={12} md={6} lg={5} xl={4} sx={{ paddingLeft: "0px !important" }}>
                    <StoryModeStepper theme={searchParams.get("theme") as ThemeType} />
                </Grid>
                <Grid
                    item
                    xs={12}
                    md={6}
                    lg={7}
                    xl={8}
                    padding="16px"
                    marginTop={{ xs: "16px", md: "55px" }}
                    sx={{ maxWidth: "1200px !important" }}
                >
                    <MapImage src={Map} alt="map" />
                </Grid>
            </Grid>
        </Layout>
    );
};
