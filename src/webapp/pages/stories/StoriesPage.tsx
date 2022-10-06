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
    max-width: 78%;
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
    top: 30px;
    right: 25px;
    border-radius: 10px;
    box-shadow: 2;
    padding: 10px;
    @media (max-width: 768px) {
        top: auto;
        bottom: 30px;
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

    return (
        <Layout>
            <ImageBanner bgColor1="#5ABE86" bgColor2="#5abe8574">
                <Grid container spacing={3} height="100%">
                    <Grid
                        item
                        xs={4}
                        display="flex"
                        justifyContent={"right"}
                        height={{ xs: "90%", sm: "100%", md: "110%" }}
                    >
                        <ThemeImage theme={searchParams.get("theme") as ThemeType} />
                    </Grid>
                    <Grid item xs={8} display="flex" justifyContent={"left"} paddingLeft="10px">
                        <TitleContainer>
                            <Stack gap={{ xs: 1, sm: 2, lg: 3 }}>
                                <Typography
                                    fontSize={{ xs: "20px", sm: "30px", md: "40px", lg: "45px", xl: "55px" }}
                                    component="h1"
                                    color="white"
                                    textTransform="uppercase"
                                >
                                    <Trans i18nKey={t(`common.storiesPage.${searchParams.get("theme")}.title`)} t={t}>
                                        {t(`common.storiesPage.${searchParams.get("theme")}.title`)}
                                    </Trans>
                                </Typography>
                                <Typography
                                    fontSize={{ xs: "14px", sm: "20px", xl: "30px" }}
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
                <Grid item xs={12} md={4} lg={4} xl={3} sx={{ paddingLeft: "0px !important" }} marginBottom={"100px"}>
                    <StoryModeStepper theme={searchParams.get("theme") as ThemeType} />
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
                    position="relative"
                >
                    <MapImage src={Map} alt="map" />
                    <StyledPaper>
                        <Stack spacing={{ xs: 1, md: 2 }}>
                            <Typography fontSize={{ xs: "10px", md: "12px" }} fontWeight="bold">
                                {t(`common.prevention.resistance_status`)}
                            </Typography>
                            <Stack>
                                <Stack direction={"row"} spacing={1} alignItems="center">
                                    <CircleIcon sx={{ color: "#869C66", fontSize: 10 }} />
                                    <Typography fontSize={{ xs: "9px", md: "11px" }}>
                                        {t(`common.prevention.legend.resistance_status.confirmed`)}
                                    </Typography>
                                </Stack>
                                <Stack direction={"row"} spacing={1} alignItems="center">
                                    <CircleIcon sx={{ color: "#FD9225", fontSize: 10 }} />
                                    <Typography fontSize={{ xs: "9px", md: "11px" }}>
                                        {t(`common.prevention.legend.resistance_status.possible`)}
                                    </Typography>
                                </Stack>
                                <Stack direction={"row"} spacing={1} alignItems="center">
                                    <CircleIcon sx={{ color: "#E41517", fontSize: 10 }} />
                                    <Typography fontSize={{ xs: "9px", md: "11px" }}>
                                        {t(`common.prevention.legend.resistance_status.susceptible`)}
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Stack>
                    </StyledPaper>
                </Grid>
            </Grid>
        </Layout>
    );
};
