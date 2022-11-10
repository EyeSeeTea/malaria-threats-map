import React from "react";
import { Grid, Paper, Stack, Typography } from "@mui/material";
import { Trans, useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import ImageBanner from "../common/ImageBanner";
import PreventionIcon from "../../assets/img/prevention-icon.svg";
import TreatmentIcon from "../../assets/img/treatment-icon.svg";
import DiagnosisIcon from "../../assets/img/diagnosis-icon.svg";
import InvasiveIcon from "../../assets/img/invasive-icon.svg";
import Map from "../../assets/img/stories-page/map.png";
import CircleIcon from "@mui/icons-material/Circle";

import Layout from "../layout/Layout";
import StoryModeStepper from "../../components/StoryModeStepper";

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
    position: relative;
`;

const StyledPaper = styled(Paper)`
    position: absolute;
    bottom: 20px;
    right: 20px;
    border-radius: 10px;
    box-shadow: 2;
    padding: 10px;
    @media (max-width: 768px) {
        bottom: 5px;
        right: 5px;
    }
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

export const StoriesPage: React.FC = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const theme = searchParams.get("theme") as ThemeType;

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
                    <StoryModeStepper theme={theme} />
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
                    <div style={{ position: "relative" }}>
                        <MapImage src={Map} alt="map" />
                        <StyledPaper>
                            <Stack spacing={{ xs: 0, md: 2 }}>
                                <Typography variant="caption" fontWeight="bold">
                                    {t(`common.prevention.resistance_status`)}
                                </Typography>
                                <Stack>
                                    <Stack direction={"row"} spacing={1} alignItems="center">
                                        <CircleIcon sx={{ color: "#869C66", fontSize: 10 }} />
                                        <Typography variant="caption">
                                            {t(`common.prevention.legend.resistance_status.confirmed`)}
                                        </Typography>
                                    </Stack>
                                    <Stack direction={"row"} spacing={1} alignItems="center">
                                        <CircleIcon sx={{ color: "#FD9225", fontSize: 10 }} />
                                        <Typography variant="caption">
                                            {t(`common.prevention.legend.resistance_status.possible`)}
                                        </Typography>
                                    </Stack>
                                    <Stack direction={"row"} spacing={1} alignItems="center">
                                        <CircleIcon sx={{ color: "#E41517", fontSize: 10 }} />
                                        <Typography variant="caption">
                                            {t(`common.prevention.legend.resistance_status.susceptible`)}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </StyledPaper>
                    </div>
                </Grid>
            </Grid>
        </Layout>
    );
};
