import React from "react";
import styled from "styled-components";
import { useTranslation, Trans } from "react-i18next";
import { Box, Typography } from "@mui/material";

import HomepageMap from "../../assets/img/homepage-map.png";
import PreventionIcon from "../../assets/img/prevention-icon.svg";
import TreatmentIcon from "../../assets/img/treatment-icon.svg";
import DiagnosisIcon from "../../assets/img/diagnosis-icon.svg";
import InvasiveIcon from "../../assets/img/invasive-icon.svg";
import Dashboards from "../../assets/img/home-page/dashboards.png";
import DataDownload from "../../assets/img/home-page/data_download.png";
import Maps from "../../assets/img/maps.png";
import Divider from "@mui/material/Divider";
import ThemePaper from "./ThemePaper";
import MediaCard from "./MediaCard";
import Header from "../layout/Header";
import { useWindowDimensions } from "../../components/hooks/use-window-dimensions";
import Footer from "../layout/Footer";

const StyledBanner = styled.div`
    display: block;
    position: relative;
    backgroundattachment: fixed;
    margin: 0;
    left: 0;
    width: 100%;
    background: linear-gradient(90deg, #bbd7e8 0%, #bbd7e800 100%), url(${HomepageMap});
    background-position: right;
    height: 600px;
    opacity: 1;
`;
interface Props {
    windowWidth: number;
}

const ContentDiv = styled.div<Props>`
    width: ${props => `${props.windowWidth * 0.83}px`};
    margin: auto;
`;

const TitleBannerDiv = styled.div`
    margin-top: 90px;
    @media (max-width: 1024px) {
        margin-top: 75px;
    }
`;

const MediaCardDiv = styled.div`
    margin-top: 67px;
    margin-bottom: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    @media (max-width: 1400px) {
        flex-wrap: wrap;
    }
    @media (max-width: 1024px) {
        margin-top: 55px;
    }
    @media (max-width: 1000px) {
        justify-content: center;
        flex-direction: column;
    }
    @media (max-width: 768px) {
        margin-top: 45px;
    }
`;

const HeaderDiv = styled.div`
    width: 80%;
    margin: auto;
    padding: 30px 0 40px 0;
    @media (max-width: 425px) {
        padding: 10px 0 20px 0;
    }
`;

const StyledDivider = styled(Divider)`
    margin-top: 83px;
`;
const ThemePaperOuterDiv = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    @media (max-width: 815px) {
        flex-direction: column;
    }
`;
const ThemeTypography = styled(Typography)`
    @media (max-width: 425px) {
        line-height: 30px;
        font-size: 22px;
    }
`;
export const themePaperColors = {
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
    const { width } = useWindowDimensions();

    return (
        <React.Fragment>
            <StyledBanner>
                <Header />
                <ContentDiv windowWidth={width}>
                    <TitleBannerDiv>
                        <Typography variant="h2" color={"inherit"} textTransform="uppercase">
                            <Trans i18nKey="common.homepage.title" t={t}>
                                Malaria <br /> <strong>Threats Map</strong>
                            </Trans>
                        </Typography>
                        <Typography variant="h5" color={"inherit"} marginTop="27px">
                            {t("common.homepage.subtitle")}
                        </Typography>
                    </TitleBannerDiv>

                    <MediaCardDiv>
                        <MediaCard
                            title={t("common.homepage.media_cards.maps.title")}
                            subtitle={t("common.homepage.media_cards.maps.subtitle")}
                            buttonText={t("common.homepage.media_cards.maps.button_text")}
                            buttonLink={"maps"}
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
                        <ThemeTypography
                            gutterBottom
                            variant="h4"
                            textAlign="center"
                            fontWeight="bold"
                            lineHeight="50px"
                            fontSize="30px"
                        >
                            {t("common.homepage.header")}
                        </ThemeTypography>
                    </HeaderDiv>

                    <Box sx={{ flexGrow: 1 }}>
                        <ThemePaperOuterDiv>
                            <ThemePaper
                                t={t}
                                icon={PreventionIcon}
                                altText="Prevention Icon"
                                title={t("common.themes.prevention")}
                                subtitle={t("common.homepage.theme_paper.prevention_subtitle")}
                                color={themePaperColors.preventionColor}
                                colorOpaque={themePaperColors.preventionColorOpaque}
                                maxPaperHeight={200}
                            />
                            <ThemePaper
                                t={t}
                                icon={InvasiveIcon}
                                altText="Invasive Icon"
                                title={t("common.themes.invasive")}
                                subtitle={t("common.homepage.theme_paper.invasive_subtitle")}
                                color={themePaperColors.invasiveColor}
                                colorOpaque={themePaperColors.invasiveColorOpaque}
                                maxPaperHeight={200}
                            />
                            <ThemePaper
                                t={t}
                                icon={TreatmentIcon}
                                altText="Treatment Icon"
                                title={t("common.themes.treatment")}
                                subtitle={t("common.homepage.theme_paper.treatment_subtitle")}
                                color={themePaperColors.treatmentColor}
                                colorOpaque={themePaperColors.treatmentColorOpaque}
                                maxPaperHeight={220}
                            />
                            <ThemePaper
                                t={t}
                                icon={DiagnosisIcon}
                                altText="Diagnosis Icon"
                                title={t("common.themes.diagnosis")}
                                subtitle={t("common.homepage.theme_paper.diagnosis_subtitle")}
                                color={themePaperColors.diagnosisColor}
                                colorOpaque={themePaperColors.diagnosisColorOpaque}
                                maxPaperHeight={220}
                            />
                        </ThemePaperOuterDiv>
                    </Box>
                </ContentDiv>
                <StyledDivider variant="fullWidth" />
                <Footer />
            </StyledBanner>
        </React.Fragment>
    );
};
