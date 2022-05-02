import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Button, AppBar, Toolbar, Box, Typography, Grid } from "@mui/material";

import HomepageMap from "../../assets/img/homepage-map.png";
import PreventionIcon from "../../assets/img/prevention-icon.svg";
import TreatmentIcon from "../../assets/img/treatment-icon.svg";
import DiagnosisIcon from "../../assets/img/diagnosis-icon.svg";
import InvasiveIcon from "../../assets/img/invasive-icon.svg";
import Divider from '@mui/material/Divider';
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
    backgroundAttachment: fixed;
    margin: 0;
    left: 0;
    width: 100%;
    background: linear-gradient(90deg, #BBD7E8 0%, #BBD7E800 100%), url(${HomepageMap});
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
}

export const HomePage = () => {
    const { t } = useTranslation("common");
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
                                    <StyledButton>Home</StyledButton>
                                    <StyledButton>Tools</StyledButton>
                                    <StyledButton>About</StyledButton>
                                    <StyledButton>Contact</StyledButton>
                                    <StyledButton>Share Data</StyledButton>
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
                    <Typography variant="h2" color={"inherit"} sx={{ textTransform: "uppercase" }}>Malaria <br /> <strong>Threats Map</strong></Typography>
                    <Typography variant="h5" color={"inherit"} sx={{ marginTop: 10 }}>
                    Explore data about the major biological threats to malaria control and elimination.
                    </Typography>
                </TitleBannerDiv>

                <MediaCardDiv>
                    <MediaCard title="Maps" subtitle="Explore individual studies and site-level data for all the threats." buttonText="Enter Map" image={Maps} altText="Maps" />
                    <MediaCard title="Dashboards" subtitle="View summaries of the threats at different geographical levels." buttonText="View Dashboards" image={Dashboards} altText="Dashboards"/>
                    <MediaCard title="Data download" subtitle="Download the data behind the MTM for your own analysis." buttonText="Download Data" image={DataDownload} altText="Data Download"/>
                </MediaCardDiv>
                <HeaderDiv>
                    <Typography gutterBottom variant="h4" component="div" textAlign="center" sx={{fontWeight: "bold", lineHeight: "60px"}}>
                        The Malaria Threats Map is the most comprehensive platform on the four biological threats to malaria control and elimination.
                    </Typography>
                 </HeaderDiv>

                 <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                        <Grid item xs={2} sm={4} md={6}>
                            <ThemePaper 
                            icon={PreventionIcon}
                            altText="Prevention Icon"
                            title="Vector insecticide resistance"
                            subtitle="Vector resistance to the insecticides used for vector control  threatens malaria control efforts."
                            color={themePaperColors.preventionColor}
                            colorOpaque={themePaperColors.preventionColorOpaque}
                            />
                        </Grid>
                        <Grid item xs={2} sm={4} md={6}>
                            <ThemePaper 
                                icon={InvasiveIcon}
                                altText="Invasive Icon"
                                title="Invasive vector species"
                                subtitle="The spread of certain anopheline vector species and their establishment in new ecosystems poses a threat to malaria control."
                                color={themePaperColors.invasiveColor}
                                colorOpaque={themePaperColors.invasiveColorOpaque}
                                />
                        </Grid>
                        <Grid item xs={2} sm={4} md={6}>
                            <ThemePaper 
                                icon={TreatmentIcon}
                                altText="Treatment Icon"
                                title="Antimalarial drug efficacy and resistance"
                                subtitle="Antimalarial drug resistance remains one of the key threats to global malaria control efforts, particularly in the Greater Mekong Subregion."
                                color={themePaperColors.treatmentColor}
                                colorOpaque={themePaperColors.treatmentColorOpaque}
                            />
                        </Grid>
                        <Grid item xs={2} sm={4} md={6}>
                            <ThemePaper 
                                icon={DiagnosisIcon}
                                altText="Diagnosis Icon"
                                title="Parasite pfhrp2/3 gene deletions"
                                subtitle="Gene deletions among some malaria parasites cause false negative diagnostic test results, complicating case management and control."
                                color={themePaperColors.diagnosisColor}
                                colorOpaque={themePaperColors.diagnosisColorOpaque}
                            />
                        </Grid>
                    </Grid>
                 </Box>
            </ContentDiv>
            <Divider variant="fullWidth" style={{marginTop: 100 }} />
            <Footer />
            </StyledBanner>
        </React.Fragment>
    );
};