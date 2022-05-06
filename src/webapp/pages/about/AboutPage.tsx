import React from "react";
import styled from "styled-components";
import { useTranslation, Trans } from "react-i18next";
import { Box, Typography, Grid } from "@mui/material";

import HomepageMap from "../../assets/img/homepage-map.png";
import Divider from "@mui/material/Divider";


import Footer from "../Footer";
import Header from "../Header";
import DataGraphic from "../../assets/img/about-page/data-graphic.svg";
import OverviewMaps from "../../assets/img/about-page/about-overview-maps.svg";
import OverviewResearchEfforts from "../../assets/img/about-page/about-overview-research-efforts.png";
import OverviewCountries from "../../assets/img/about-page/about-overview-countries.png";


const StyledBanner = styled.div`
    display: block;
    position: relative;
    backgroundattachment: fixed;
    margin: 0;
    left: 0;
    width: 100%;
    background: linear-gradient(90deg, #bbd7e8 0%, #bbd7e800 100%), url(${HomepageMap});
    background-position: right;
    height: 373px;
    opacity: 1;
`;

const ContentDiv = styled.div`
    width: 1170px;
    margin: auto;
`;

const TitleBannerDiv = styled.div`
    margin-top: 81px;
`;

const MediaCardDiv = styled.div`
    margin-top: 100px;
    margin-bottom: 60px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const MediaCardDiv1 = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const HeaderDiv = styled.div`
    width: 80%;
    margin: auto;
    padding-top: 20px;
    padding-bottom: 40px;
`;

export const AboutPage = () => {
    const { t } = useTranslation();
/*
<Divider variant="fullWidth" style={{ marginTop: 100 }} />
                <Footer t={t} />
*/
    return (
        <React.Fragment>
            <StyledBanner>
                <Header t={t} />
                <ContentDiv>
                    <TitleBannerDiv>
                        <Typography variant="h3" color={"inherit"} sx={{ textTransform: "uppercase", fontSize: 46 }}>
                            Learn More About  <br /> <strong>The Malaria Threats Map</strong>
                        </Typography>
                    </TitleBannerDiv>
                </ContentDiv>
                
            </StyledBanner>
            <ContentDiv style={{display: "flex"}}>
                    <MediaCardDiv>
                    <Typography variant="h4" fontWeight="bold" color={"inherit"}>
                        Where does the data come from?
                        </Typography>
                        <Typography variant="body2" color={"inherit"}>
                        Data is collected by National Malaria Programmes, their implementation partners, research institutes and non-governmental organizations. They are either provided directly to WHO Global Malaria Programme (GMP) or extracted from publications. All data are quality controlled, incorporated into WHO global databases and then published to the Malaria Threats Map.
                        </Typography>
                    </MediaCardDiv>
                <img src={DataGraphic} width={644} />
                </ContentDiv>
                <div style={{backgroundColor: "#F7F7F7", marginTop: "83", marginBottom: "83"}}>
                    <ContentDiv style={{marginTop: "83"}}>
                        <Typography variant="h4" fontWeight="bold" color={"inherit"}>
                        Watch: Find out about the functionality of the maps within the MTM
                    </Typography>
                    <MediaCardDiv1 style={{flexDirection: "row"}}>
                        <div style={{width: 356, backgroundColor: "#F2F5F7", boxShadow: "0px 5px 10px #00000029"}}>
                        <img src={OverviewMaps} width={262} style={{margin: "auto" }}/>

                        </div>
                    <img src={OverviewResearchEfforts} width={356} />
                    <img src={OverviewCountries} width={356} />

                    </MediaCardDiv1>
                    </ContentDiv>
                </div>
        </React.Fragment>
    );
};
