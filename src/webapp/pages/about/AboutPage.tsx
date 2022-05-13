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
import DonorsOption from "../../assets/img/about-page/about-page-donors-option.png";
import { useWindowDimensions } from "../../components/hooks/use-window-dimensions";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';

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

interface Props {
    windowWidth: number;
}

const ContentDiv = styled.div<Props>`
width: ${props => `${props.windowWidth * 0.83}px`};
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
    const { width } = useWindowDimensions();
    const [alignment, setAlignment] = React.useState<string | null>('left');

    const handleAlignment = (
      event: React.MouseEvent<HTMLElement>,
      newAlignment: string | null,
    ) => {
      setAlignment(newAlignment);
    };
/*
<Divider variant="fullWidth" style={{ marginTop: 100 }} />
                <Footer t={t} />
*/
// marginTop: "83", marginBottom: "83"s
const typesOfPeople = {
    controlProgram: {
        quote: "The MTM gives me access to the most recent public data on vector insecticide resistance – this helps me make decisions around which insecticide products to fund for IRS and whether standard LLINs or new Pyrethroid-PBO nets should be deployed. The interactivity of the platform allows me to select the specific criteria that I am interested in – and then easily export visualisations to facilitate discussions. No other platform is as comprehensive as the MTM.",
        quoteName: "Name",
        globalFund: "Global Fund"
    },
    ngos: {
        quote: "The MTM gives me access to the most recent public data on vector insecticide resistance – this helps me make decisions around which insecticide products to fund for IRS and whether standard LLINs or new Pyrethroid-PBO nets should be deployed. The interactivity of the platform allows me to select the specific criteria that I am interested in – and then easily export visualisations to facilitate discussions. No other platform is as comprehensive as the MTM.",
        quoteName: "Name",
        globalFund: "Global Fund"
    },
    donors: {
        quote: "The MTM gives me access to the most recent public data on vector insecticide resistance – this helps me make decisions around which insecticide products to fund for IRS and whether standard LLINs or new Pyrethroid-PBO nets should be deployed. The interactivity of the platform allows me to select the specific criteria that I am interested in – and then easily export visualisations to facilitate discussions. No other platform is as comprehensive as the MTM.",
        quoteName: "Name",
        globalFund: "Global Fund"
    },
    whoStaff: {
        quote: "The MTM gives me access to the most recent public data on vector insecticide resistance – this helps me make decisions around which insecticide products to fund for IRS and whether standard LLINs or new Pyrethroid-PBO nets should be deployed. The interactivity of the platform allows me to select the specific criteria that I am interested in – and then easily export visualisations to facilitate discussions. No other platform is as comprehensive as the MTM.",
        quoteName: "Name",
        globalFund: "Global Fund"
    },
    researchers: {
        quote: "The MTM gives me access to the most recent public data on vector insecticide resistance – this helps me make decisions around which insecticide products to fund for IRS and whether standard LLINs or new Pyrethroid-PBO nets should be deployed. The interactivity of the platform allows me to select the specific criteria that I am interested in – and then easily export visualisations to facilitate discussions. No other platform is as comprehensive as the MTM.",
        quoteName: "Name",
        globalFund: "Global Fund"
    }
};

    return (
        <React.Fragment>
            <StyledBanner>
                <Header t={t} />
                <ContentDiv windowWidth={width}>
                    <TitleBannerDiv>
                        <Typography variant="h3" color={"inherit"} textTransform="uppercase" fontSize={46}>
                            Learn More About  <br /> <strong>The Malaria Threats Map</strong>
                        </Typography>
                    </TitleBannerDiv>
                </ContentDiv>
                
            </StyledBanner>
            <ContentDiv style={{display: "flex", margin: "64px auto"}} windowWidth={width}>
                    <MediaCardDiv style={{marginRight: 30}}>
                    <Typography variant="h4" fontWeight="bold" color={"inherit"}>
                        Where does the data come from?
                        </Typography>
                        <Typography variant="body2" color={"inherit"}>
                        Data is collected by National Malaria Programmes, their implementation partners, research institutes and non-governmental organizations. They are either provided directly to WHO Global Malaria Programme (GMP) or extracted from publications. All data are quality controlled, incorporated into WHO global databases and then published to the Malaria Threats Map.
                        </Typography>
                    </MediaCardDiv>
                <img src={DataGraphic} width={644} />
                </ContentDiv>

                <div style={{backgroundColor: "#F7F7F7"}}>
                    <ContentDiv style={{padding: "64px auto", backgroundColor: "#F7F7F7"}} windowWidth={width}>
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

                <ContentDiv style={{display: "flex"}} windowWidth={width}>
                    <MediaCardDiv style={{marginTop: 58}}>
                    <Typography variant="h4" fontWeight="bold" color={"inherit"}>
                    Thousands of people use the Malaria Threats Map to understand challenges to malaria control and elimination, access data and guide decision-making.
                        </Typography>
                        <div style={{ margin: "50px auto"}}>
                            <ToggleButtonGroup
                                value={alignment}
                                exclusive
                                onChange={handleAlignment}
                                aria-label="text alignment"
                                color="primary"
                                >
                                <ToggleButton value="left" aria-label="left aligned">
                                    <Typography variant="body1" fontWeight="bold" color={"inherit"}>National Malaria Control Programmes</Typography>
                                </ToggleButton>
                                <ToggleButton value="center" aria-label="centered">
                                    <Typography variant="body1" fontWeight="bold" color={"inherit"}>NGOS</Typography>
                                </ToggleButton>
                                <ToggleButton value="right" aria-label="right aligned">
                                    <Typography variant="body1" fontWeight="bold" color={"inherit"}>Donors</Typography>
                                </ToggleButton>
                                <ToggleButton value="justify" aria-label="justified">
                                    <Typography variant="body1" fontWeight="bold" color={"inherit"}>WHO Staff</Typography>
                                </ToggleButton>
                                <ToggleButton value="justify" aria-label="justified">
                                    <Typography variant="body1" fontWeight="bold" color={"inherit"}>Researchers</Typography>
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </div>
                        <div style={{display: "flex", justifyContent: "space-between"}}>
                        <img src={DonorsOption} width={475} />
                        <MediaCardDiv style={{marginLeft: 30}}>
                    <Typography variant="h6" fontWeight="bold" color={"inherit"}>
                        Donors
                        </Typography>
                        <Typography variant="body2" color={"#343434"} margin="16px 0">
                        “The MTM gives me access to the most recent public data on vector insecticide resistance – this helps me make decisions around which insecticide products to fund for IRS and whether standard LLINs or new Pyrethroid-PBO nets should be deployed. The interactivity of the platform allows me to select the specific criteria that I am interested in – and then easily export visualisations to facilitate discussions. No other platform is as comprehensive as the MTM.”                        </Typography>
                        <div style={{display: "flex", alignItems: "flex-end", justifyContent: "flex-end"}}>
                        <Typography variant="body2" color="#343434" style={{padding: "4px 20px 20px 20px"}}>Name</Typography>
                        <Typography variant="body2" color="#636463" fontWeight="bold" style={{padding: "4px 20px 20px 20px"}}>Global Fund</Typography>
                        </div>
                    </MediaCardDiv>
                        </div>
                    </MediaCardDiv>
                </ContentDiv>
        </React.Fragment>
    );
};
