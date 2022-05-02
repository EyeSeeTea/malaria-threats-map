import React from "react";
import styled from "styled-components";
import { useTranslation, Trans } from "react-i18next";
import { Box, Typography, Grid } from "@mui/material";

import HomepageMap from "../../assets/img/homepage-map.png";
import Divider from "@mui/material/Divider";


import Footer from "../Footer";
import Header from "../Header";

const StyledBanner = styled.div`
    display: block;
    position: relative;
    backgroundattachment: fixed;
    margin: 0;
    left: 0;
    width: 100%;
    background: linear-gradient(90deg, #bbd7e8 0%, #bbd7e800 100%), url(${HomepageMap});
    background-position: right;
    height: 450px;
    opacity: 1;
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

export const AboutPage = () => {
    const { t } = useTranslation();

    return (
        <React.Fragment>
            <StyledBanner>
                <Header t={t} />
                <ContentDiv>
                    <TitleBannerDiv>
                        <Typography variant="h2" color={"inherit"} sx={{ textTransform: "uppercase" }}>
                            Learn More About  <br /> <strong>The Malaria Threats Map</strong>
                        </Typography>
                    </TitleBannerDiv>
                    <Box sx={{ flexGrow: 1 }}>
                        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                                
                        </Grid>
                    </Box>
                </ContentDiv>
                <Divider variant="fullWidth" style={{ marginTop: 100 }} />
                <Footer t={t} />
            </StyledBanner>
        </React.Fragment>
    );
};
