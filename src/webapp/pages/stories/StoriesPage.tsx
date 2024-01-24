import React, { useEffect, useState } from "react";
import { Grid, Stack, Typography } from "@mui/material";
import { Trans, useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import ImageBanner from "../common/ImageBanner";
import PreventionIcon from "../../assets/img/prevention-icon.svg";
import TreatmentIcon from "../../assets/img/treatment-icon.svg";
import DiagnosisIcon from "../../assets/img/diagnosis-icon.svg";
import InvasiveIcon from "../../assets/img/invasive-icon.svg";

import diagnosis1 from "../../assets/img/stories-page/diagnosis1.png";
import invasive1 from "../../assets/img/stories-page/invasive1.png";
import prevention1 from "../../assets/img/stories-page/prevention1.png";
import treatment1 from "../../assets/img/stories-page/treatment1.png";
import treatment2 from "../../assets/img/stories-page/treatment2.png";
import treatment3 from "../../assets/img/stories-page/treatment3.png";

import Layout from "../layout/Layout";
import StoryModeStepper from "../../components/StoryModeStepper";
import { useSendAnalyticsPageView } from "../../hooks/useSendAnalyticsPageView";

type ThemeType = "prevention" | "invasive" | "treatment" | "diagnosis";

const TitleContainer = styled.div`
    display: flex;
    align-items: center;
    font-weight: lighter;
    font-size: 8vw;
    padding-left: 10px;
    max-width: 55%;
    @media (max-width: 768px) {
        max-width: 100%;
    }
`;

const StyledImage = styled.img`
    width: 200px;
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

const ThemeImage = ({ theme }: { theme: ThemeType }) => {
    let imageSrc: string;
    switch (theme) {
        case "diagnosis":
            imageSrc = DiagnosisIcon;
            break;
        case "invasive":
            imageSrc = InvasiveIcon;
            break;
        case "prevention":
            imageSrc = PreventionIcon;
            break;
        case "treatment":
            imageSrc = TreatmentIcon;
            break;
    }
    return <StyledImage src={imageSrc} alt="prevention-icon" />;
};

const MapComponent = ({ theme, storyModeStep }: { theme: string; storyModeStep: number }) => {
    let imageSrc: string;
    switch (theme) {
        case "diagnosis":
            switch (storyModeStep) {
                case 0:
                case 1:
                case 2:
                    imageSrc = diagnosis1;
                    break;
            }
            break;
        case "invasive":
            switch (storyModeStep) {
                case 0:
                case 1:
                case 2:
                    imageSrc = invasive1;
                    break;
            }
            break;
        case "prevention":
            switch (storyModeStep) {
                case 0:
                case 1:
                case 2:
                    imageSrc = prevention1;
                    break;
            }
            break;
        case "treatment":
            switch (storyModeStep) {
                case 0:
                    imageSrc = treatment1;
                    break;
                case 1:
                    imageSrc = treatment2;
                    break;
                case 2:
                    imageSrc = treatment3;
                    break;
            }
            break;
    }
    return <MapImage src={imageSrc} alt="map" />;
};

export const StoriesPage: React.FC = () => {
    const { t } = useTranslation();
    const [storyModeStep, setStoryModeStep] = useState<number>(0);
    const [searchParams] = useSearchParams();
    const theme = searchParams.get("theme") as ThemeType;

    useSendAnalyticsPageView(`stories/${theme}`);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [theme]);

    const imageBannerColors = (theme: ThemeType) => {
        const bgColors: string[] = [];

        switch (theme) {
            case "prevention":
                bgColors.push("#5ABE86", "#5abe8574");
                break;
            case "invasive":
                bgColors.push("#5CC579", "#5cc57a6c");
                break;
            case "treatment":
                bgColors.push("#5DCCCE", "#5dccce6a");
                break;
            case "diagnosis":
                bgColors.push("#1999CB", "#1999cb79");
                break;
        }
        return bgColors;
    };

    return (
        <Layout>
            <ImageBanner
                bgColor1={imageBannerColors(theme)[0]}
                bgColor2={imageBannerColors(theme)[1]}
                minHeight="380px"
            >
                <Grid container spacing={3} height="100%">
                    <Grid item xs={4} display="flex" justifyContent={"right"} paddingLeft="0px !important">
                        <ThemeImage theme={theme} />
                    </Grid>
                    <Grid item xs={8} display="flex" justifyContent={"left"} paddingLeft="10px">
                        <TitleContainer>
                            <Stack gap={{ xs: 1, sm: 2, lg: 3 }}>
                                <Typography component="h1" variant="h4" color="white" textTransform="uppercase">
                                    <Trans i18nKey={t(`common.storiesPage.${theme}.title`)} t={t}>
                                        {t(`common.storiesPage.${theme}.title`)}
                                    </Trans>
                                </Typography>
                                <Typography component="h4" variant="h6" color="white" fontWeight={"medium"}>
                                    {t(`common.storiesPage.${theme}.description`)}
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
                <Grid item xs={12} md={4} lg={4} xl={3} sx={{ paddingLeft: "0px !important" }} marginBottom={"100px"}>
                    <StoryModeStepper theme={theme} storyModeStep={storyModeStep} setStoryModeStep={setStoryModeStep} />
                </Grid>
                <Grid
                    item
                    xs={12}
                    md={8}
                    lg={8}
                    xl={9}
                    padding="16px"
                    marginTop={{ xs: "16px", md: "55px" }}
                    sx={{ maxWidth: "1200px !important" }}
                >
                    <MapComponent theme={searchParams.get("theme") as ThemeType} storyModeStep={storyModeStep} />
                </Grid>
            </Grid>
        </Layout>
    );
};
