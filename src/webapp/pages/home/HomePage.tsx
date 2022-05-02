import React from "react";
import styled from "styled-components";
import { useTranslation, Trans } from "react-i18next";
import { Button, AppBar, Toolbar, Box, Typography, Grid } from "@mui/material";

import HomepageMap from "../../assets/img/homepage-map.png";
import PreventionIcon from "../../assets/img/prevention-icon.svg";
import TreatmentIcon from "../../assets/img/treatment-icon.svg";
import DiagnosisIcon from "../../assets/img/diagnosis-icon.svg";
import InvasiveIcon from "../../assets/img/invasive-icon.svg";
import Divider from "@mui/material/Divider";
import Dashboards from "../../assets/img/dashboards.png";
import DataDownload from "../../assets/img/data_download.png";
import Maps from "../../assets/img/maps.png";

import LanguageSelectorSelect from "../../components/LanguageSelectorSelect";
import ThemePaper from "./ThemePaper";
import MediaCard from "./MediaCard";
import Footer from "./Footer";

const StyledToolbar = styled(Toolbar)`
    &.MuiToolbar-root {
        width: 85%;
        margin: auto;
        @media (min-width: 600px) {
            padding: 0 70px;
            min-height: 50px;
        }
    }
`;

const StyledButton = styled(Button)`
    &.MuiButton-root {
        padding: 15px 40px;
        color: black;
        letter-spacing: 0.235px;
        &:hover {
            border: none;
            color: #2FB3AF;
            font-weight: bold;
            padding-bottom: 10px;
            letter-spacing: 0;
            border-bottom: 5px solid #2FB3AF;
            border-radius: 0;
            cursor;
            transition: none;
        }
    }
`;

const StyledBanner = styled.div`
    display: block;
    position: relative;
    backgroundattachment: fixed;
    margin: 0;
    left: 0;
    width: 100%;
    background: linear-gradient(90deg, #bbd7e8 0%, #bbd7e800 100%), url(${HomepageMap});
    background-position: right;
    height: 720px;
    opacity: 1;
`;

const StickyMenu = styled.div`
    position: relative;
    bottom: 0;
    top: 0;
    right: 0;
    left: 0;
`;

const ContentDiv = styled.div`
    width: 80%;
    margin: auto;
`;

const TitleBannerDiv = styled.div`
    margin-top: 100px;
`;

const MediaCardDiv = styled.div`
    margin-top: 81px;
    margin-bottom: 60px;
    display: flex;
    justify-content: space-between;
`;

const HeaderDiv = styled.div`
    width: 80%;
    margin: auto;
    padding-top: 20px;
    padding-bottom: 40px;
`;

const themePaperColors = {
    preventionColor: "#5ABE86",
    preventionColorOpaque: "rgb(90, 190, 134, 0.9)",
    invasiveColor: "#5CC579",
    invasiveColorOpaque: "rgb(92, 197, 121, 0.9)",
    treatmentColor: "#5CCDCE",
    treatmentColorOpaque: "rgb(92, 205, 206, 0.9)",
    diagnosisColor: "#1899CC",
    diagnosisColorOpaque: "rgb(24, 153, 204, 0.9)",
};

export const HomePage = () => {
    const { t } = useTranslation();
    const classes = {
        icon: { marginRight: 5 },
        menuOptionBox: { flexGrow: 1, display: { xs: "flex" }, width: "60%", margin: "auto" },
        languageSelectorBox: { flexGrow: 0 },
        appBar: { backgroundColor: "white" },
    };

    return (
        <React.Fragment>
            <StyledBanner>
                <StickyMenu>
                    <Box>
                        <AppBar position="sticky" sx={classes.appBar}>
                            <StyledToolbar>
                                <Box sx={classes.menuOptionBox}>
                                    <StyledButton>{t("common.homepage.menu.home")}</StyledButton>
                                    <StyledButton>{t("common.homepage.menu.tools")}</StyledButton>
                                    <StyledButton>{t("common.homepage.menu.about")}</StyledButton>
                                    <StyledButton>{t("common.homepage.menu.contact")}</StyledButton>
                                    <StyledButton>{t("common.homepage.menu.share_data")}</StyledButton>
                                </Box>
                                <Box sx={classes.languageSelectorBox}>
                                    <LanguageSelectorSelect section="homeItem" />
                                </Box>
                            </StyledToolbar>
                        </AppBar>
                    </Box>
                </StickyMenu>

                <ContentDiv>
                    <TitleBannerDiv>
                        <Typography variant="h2" color={"inherit"} sx={{ textTransform: "uppercase" }}>
                            <Trans i18nKey="common.homepage.title" t={t}>
                            Malaria <br /> <strong>Threats Map</strong>
                            </Trans>
                        </Typography>
                        <Typography variant="h5" color={"inherit"} sx={{ marginTop: 10 }}>
                        {t("common.homepage.subtitle")}
                        </Typography>
                    </TitleBannerDiv>

                    <MediaCardDiv>
                        <MediaCard
                            title={t("common.homepage.media_cards.maps.title")}
                            subtitle={t("common.homepage.media_cards.maps.subtitle")}
                            buttonText={t("common.homepage.media_cards.maps.button_text")}
                            image={Maps}
                            altText={t("common.homepage.media_cards.maps.title")}
                        />
                        <MediaCard
                            title={t("common.homepage.media_cards.dashboards.title")}
                            subtitle={t("common.homepage.media_cards.dashboards.subtitle")}
                            buttonText={t("common.homepage.media_cards.dashboards.button_text")}
                            image={Dashboards}
                            altText={t("common.homepage.media_cards.dashboards.title")}
                        />
                        <MediaCard
                            title={t("common.homepage.media_cards.data_download.title")}
                            subtitle={t("common.homepage.media_cards.data_download.subtitle")}
                            buttonText={t("common.homepage.media_cards.data_download.button_text")}
                            image={DataDownload}
                            altText={t("common.homepage.media_cards.data_download.title")}
                        />
                    </MediaCardDiv>
                    <HeaderDiv>
                        <Typography
                            gutterBottom
                            variant="h4"
                            component="div"
                            textAlign="center"
                            sx={{ fontWeight: "bold", lineHeight: "60px" }}
                        >
                            {t("common.homepage.header")}
                        </Typography>
                    </HeaderDiv>

                    <Box sx={{ flexGrow: 1 }}>
                        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                            <Grid item xs={2} sm={4} md={6}>
                                <ThemePaper
                                    icon={PreventionIcon}
                                    altText="Prevention Icon"
                                    title={t("common.themes.prevention")}
                                    subtitle={t("common.homepage.theme_paper.prevention_subtitle")}
                                    color={themePaperColors.preventionColor}
                                    colorOpaque={themePaperColors.preventionColorOpaque}
                                />
                            </Grid>
                            <Grid item xs={2} sm={4} md={6}>
                                <ThemePaper
                                    icon={InvasiveIcon}
                                    altText="Invasive Icon"
                                    title={t("common.themes.invasive")}
                                    subtitle={t("common.homepage.theme_paper.invasive_subtitle")}
                                    color={themePaperColors.invasiveColor}
                                    colorOpaque={themePaperColors.invasiveColorOpaque}
                                />
                            </Grid>
                            <Grid item xs={2} sm={4} md={6}>
                                <ThemePaper
                                    icon={TreatmentIcon}
                                    altText="Treatment Icon"
                                    title={t("common.themes.treatment")}
                                    subtitle={t("common.homepage.theme_paper.treatment_subtitle")}
                                    color={themePaperColors.treatmentColor}
                                    colorOpaque={themePaperColors.treatmentColorOpaque}
                                />
                            </Grid>
                            <Grid item xs={2} sm={4} md={6}>
                                <ThemePaper
                                    icon={DiagnosisIcon}
                                    altText="Diagnosis Icon"
                                    title={t("common.themes.diagnosis")}
                                    subtitle={t("common.homepage.theme_paper.diagnosis_subtitle")}
                                    color={themePaperColors.diagnosisColor}
                                    colorOpaque={themePaperColors.diagnosisColorOpaque}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </ContentDiv>
                <Divider variant="fullWidth" style={{ marginTop: 100 }} />
                <Footer t={t} />
            </StyledBanner>
        </React.Fragment>
    );
};
