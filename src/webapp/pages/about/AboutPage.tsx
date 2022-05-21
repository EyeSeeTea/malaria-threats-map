import React from "react";
import styled from "styled-components";
import { useTranslation, Trans } from "react-i18next";
import { Box, Typography, Grid, Button } from "@mui/material";

import HomepageMap from "../../assets/img/homepage-map.png";
import Divider from "@mui/material/Divider";


import Footer from "../Footer";
import Header from "../Header";
import DataGraphic from "../../assets/img/about-page/data-graphic.svg";
import OverviewMaps from "../../assets/img/about-page/about-overview-maps.svg";
import OverviewResearchEfforts from "../../assets/img/about-page/about-overview-research-efforts.png";
import OverviewCountries from "../../assets/img/about-page/about-overview-countries.png";
import DonorsOption from "../../assets/img/about-page/about-page-donors-option.png";
import UXTesting from "../../assets/img/about-page/about-page-ux-testing.png";
import { useWindowDimensions } from "../../components/hooks/use-window-dimensions";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import ButtonGroup from '@mui/material/ButtonGroup';

// height: 373px;
const StyledBanner = styled.div`
    display: block;
    position: relative;
    backgroundattachment: fixed;
    margin: 0;
    left: 0;
    width: 100%;
    background: linear-gradient(90deg, #bbd7e8 0%, #bbd7e800 100%), url(${HomepageMap});
    background-position: right;
    max-height: 600px;
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

const ContentHerDiv = styled.div<Props>`
display: flex;
align-items: center;
width: ${props => `${props.windowWidth * 0.83}px`};
margin: auto;
margin-top: 81px;
`;

const TitleBannerDiv = styled.div`

`;
/*   display: flex;
align-items: center;
 margin-top: 81px;
    @media (max-width: 768px) {
        margin-top: 55px;
    }
    margin-top: 100px;
    margin-bottom: 60px;
*/
const MediaCardDiv = styled.div`
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

const StyledNewsletterButton = styled(Button)`
    &.MuiButton-root {
        color: white;
        font-size: 16px;
        background-color: #343434;
        font-weight: bold;
        text-align: center;
        margin: 0;
    }
`;
const DataOriginDiv = styled.div`
    display: flex; 
    margin: 64px auto;
    align-items: center;
    @media (max-width: 768px) {
        flex-direction: column;
    }
`;
const DataOriginContentDiv = styled.div<Props>`
    margin-right: 30px;
    flex-direction: column;
    width: ${props => `${(props.windowWidth * 0.83) * 0.5}px`};
    @media (max-width: 768px) {
        flex-direction: column;
        width: 100%;
        text-align: center;
    }
`;
const DataOriginGraphDiv = styled.div<Props>`
    width: ${props => `${(props.windowWidth * 0.83) * 0.5}px`};
    @media (max-width: 768px) {
        width: 100%;
    }
`;
const VideoGalleryDiv = styled.div`
    display: flex;
    justify-content: space-between;
    flex-direction: row; 
    flex-wrap: wrap;
    @media (max-width: 1300px) {
        justify-content: space-around;
    }
`;
const VideoDiv = styled.div`
    display: flex;
    flex-direction: column;
    max-width: 356px;
    width: 100%;
    @media (max-width: 1300px) {
        margin-top: 55px;
    }
`;
const ChallengesDiv = styled.div`
    display: flex;
    justify-content: space-between;
    @media (max-width: 1024px) {
        flex-direction: column;
    }
`;

const UserExperienceDiv = styled.div<Props>`
    display: flex;
    height: ${props => `${(props.windowWidth * 0.83) * 0.25}px`};
    width: ${props => `${(props.windowWidth * 0.83) * 0.8}px`};
    margin: auto;
    @media (max-width: 1024px) {
        height: ${props => `${(props.windowWidth * 0.83) * 0.40}px`};

    }
    @media (max-width: 768px) {
        height: 100%;
        flex-direction: column;
        justify-content: center;

    }
`;
const UserExperienceTextDiv = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 77px;
    justify-content: space-between;
    @media (max-width: 768px) {
        margin-left: 0;


    }
`;
const VideoTitle = styled(Typography)`
@media (max-width: 1024px) {
    margin-bottom: 0;
}
`;
const VideoDescription = styled(Typography)`
@media (max-width: 768px) {
    text-align: center;
}
`;

const StyledButtonGroup = styled(ButtonGroup)`
    display: flex;
    justify-content: space-between;
    margin: 50px 0;
    flex-wrap: wrap;
`;
//style={{backgroundColor: "#F2F5F7", color: "#1899CC", fontWeight: "bold", boxShadow: "none", borderRadius: 5}}
const StyledButton = styled(Button)`
    background-color: #F2F5F7; 
    color: #1899CC; 
    font-weight: bold; 
    box-shadow: none;
    border-radius: 5px;
    @media (max-width: 768px) {
        margin-top: 10px;
    }
`;
export const AboutPage = () => {
    const { t } = useTranslation();
    const { width } = useWindowDimensions();
    const typesOfPeople = {
        controlProgram: {
            name: "National Malaria Control Programmes",
            quote: "The MTM gives me access to the most recent public data on vector insecticide resistance – this helps me make decisions around which insecticide products to fund for IRS and whether standard LLINs or new Pyrethroid-PBO nets should be deployed. The interactivity of the platform allows me to select the specific criteria that I am interested in – and then easily export visualisations to facilitate discussions. No other platform is as comprehensive as the MTM.",
            quoteName: "Name",
            globalFund: "Global Fund"
        },
        ngos: {
            name: "NGOs",
            quote: "The MTM gives me access to the most recent public data on vector insecticide resistance – this helps me make decisions around which insecticide products to fund for IRS and whether standard LLINs or new Pyrethroid-PBO nets should be deployed. The interactivity of the platform allows me to select the specific criteria that I am interested in – and then easily export visualisations to facilitate discussions. No other platform is as comprehensive as the MTM.",
            quoteName: "Name",
            globalFund: "Global Fund"
        },
        donors: {
            name: "Donors",
            quote: "The MTM gives me access to the most recent public data on vector insecticide resistance – this helps me make decisions around which insecticide products to fund for IRS and whether standard LLINs or new Pyrethroid-PBO nets should be deployed. The interactivity of the platform allows me to select the specific criteria that I am interested in – and then easily export visualisations to facilitate discussions. No other platform is as comprehensive as the MTM.",
            quoteName: "Name",
            globalFund: "Global Fund"
        },
        whoStaff: {
            name: "WHO Staff",
            quote: "The MTM gives me access to the most recent public data on vector insecticide resistance – this helps me make decisions around which insecticide products to fund for IRS and whether standard LLINs or new Pyrethroid-PBO nets should be deployed. The interactivity of the platform allows me to select the specific criteria that I am interested in – and then easily export visualisations to facilitate discussions. No other platform is as comprehensive as the MTM.",
            quoteName: "Name",
            globalFund: "Global Fund"
        },
        researchers: {
            name: "Researchers",
            quote: "The MTM gives me access to the most recent public data on vector insecticide resistance – this helps me make decisions around which insecticide products to fund for IRS and whether standard LLINs or new Pyrethroid-PBO nets should be deployed. The interactivity of the platform allows me to select the specific criteria that I am interested in – and then easily export visualisations to facilitate discussions. No other platform is as comprehensive as the MTM.",
            quoteName: "Name",
            globalFund: "Global Fund"
        }
    };
    const [alignment, setAlignment] = React.useState<any>("Donors");
    console.log(alignment)
    const handleAlignment = (
      event: React.MouseEvent<HTMLElement>,
      newAlignment: string,
    ) => {
        console.log(newAlignment);
      setAlignment(newAlignment);
    };
/*
<Divider variant="fullWidth" style={{ marginTop: 100 }} />
                <Footer t={t} />
*/
// marginTop: "83", marginBottom: "83"s
//height: 615,
    return (
        <React.Fragment>
            <StyledBanner>
                <Header t={t} />
                <ContentHerDiv windowWidth={width}>
                    <Typography variant="h3" color={"inherit"} textTransform="uppercase" fontSize={46}>
                        Learn More About  <br /> <strong>The Malaria Threats Map</strong>
                    </Typography>
                </ContentHerDiv>
                
            </StyledBanner>
            <ContentDiv windowWidth={width}>
                <DataOriginDiv>
                    <DataOriginContentDiv windowWidth={width}>
                    <Typography variant="h4" fontWeight="bold" color={"inherit"} marginBottom={"25px"}>
                        Where does the data come from?
                    </Typography>
                        <Typography variant="body2" color={"inherit"}>
                        Data is collected by National Malaria Programmes, their implementation partners, research institutes and non-governmental organizations. They are either provided directly to WHO Global Malaria Programme (GMP) or extracted from publications. All data are quality controlled, incorporated into WHO global databases and then published to the Malaria Threats Map.
                        </Typography>
                    </DataOriginContentDiv>
                    <DataOriginGraphDiv windowWidth={width}>
                        <img src={DataGraphic} style={{maxWidth: 644, width: "100%", height: "auto"}}/>
                    </DataOriginGraphDiv>
                </DataOriginDiv>
                </ContentDiv>

                <div style={{display: "flex",  backgroundColor: "#F7F7F7", margin: "auto", padding: 64, justifyContent: "space-between", }}>
                    <div style={{display: "flex", flexDirection: "column", width: `${width * 0.83}px`, margin: "auto" }}>
                        <VideoTitle variant="h4" fontWeight="bold" color={"inherit"} marginBottom={"58px"} textAlign="center">
                        Watch: Find out about the functionality of the maps within the MTM
                    </VideoTitle>
                    <VideoGalleryDiv>
                        <VideoDiv>
                            <div style={{display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: 270, maxWidth: 356, maxHeight: 270, borderRadius: 20, backgroundColor: "#F2F5F7", boxShadow: "0px 5px 10px #00000029"}}>
                            <img src={OverviewMaps} style={{maxWidth: 262, maxHeight: 250}} width={"100%"} height="auto" />
                            </div>
                            <VideoDescription variant="h6" color={"inherit"} marginTop={"33px"}>
                            <strong>Watch:</strong> An overview of the maps
                            </VideoDescription>
                        </VideoDiv>

                        <VideoDiv>
                            <img src={OverviewResearchEfforts} width={"100%"} height={"auto"} style={{maxWidth: 356, maxHeight: 270, boxShadow: "0px 5px 10px #00000029", borderRadius: 20}}/>
                            <VideoDescription variant="h6" color={"inherit"} marginTop={"33px"}>
                            <strong>Watch:</strong> How is the MTM supporting research efforts?
                            </VideoDescription>
                        </VideoDiv>
                        <VideoDiv>
                        <img src={OverviewCountries} width={"100%"} height={"auto"} style={{maxWidth: 356, maxHeight: 270,boxShadow: "0px 5px 10px #00000029", borderRadius: 20}}/>
                            <VideoDescription variant="h6" color={"inherit"} marginTop={"33px"}>
                            <strong>Watch:</strong> How is the MTM supporting countries?
                            </VideoDescription>
                        </VideoDiv>

                    </VideoGalleryDiv>
                    </div>
                </div>

                <ContentDiv style={{display: "flex"}} windowWidth={width}>
                    <MediaCardDiv style={{marginTop: 58}}>
                    <Typography variant="h4" fontWeight="bold" color={"inherit"} letterSpacing={0} textAlign="center">
                    Thousands of people use the Malaria Threats Map to understand challenges to malaria control and elimination, access data and guide decision-making.
                        </Typography>
                        <StyledButtonGroup variant="outlined" aria-label="outlined button group">
                            <StyledButton variant="contained" onClick={() => {
                        alert('clicked');
                    }}>National Malaria Control Programmes</StyledButton>
                            <StyledButton variant="contained">NGOs</StyledButton>
                            <StyledButton variant="contained">Donors</StyledButton>
                            <StyledButton variant="contained">WHO Staff</StyledButton>
                            <StyledButton variant="contained">Researchers</StyledButton>
                        </StyledButtonGroup>

                        <ChallengesDiv>
                            <img src={DonorsOption} width={475} height={250} style={{margin: "auto"}}/>
                            <div style={{display: "flex", flexDirection: "column", justifyContent: "space-between", marginLeft: 30, marginTop: 20}}>
                                <Typography variant="h6" fontWeight="bold" color={"inherit"}>Donors</Typography>
                                <Typography variant="body2" color={"#343434"} margin="16px 0">
                                The MTM gives me access to the most recent public data on vector insecticide resistance – this helps me make decisions around which insecticide products to fund for IRS and whether standard LLINs or new Pyrethroid-PBO nets should be deployed. The interactivity of the platform allows me to select the specific criteria that I am interested in – and then easily export visualisations to facilitate discussions. No other platform is as comprehensive as the MTM.
                                </Typography>
                                <div style={{display: "flex", alignItems: "flex-end", justifyContent: "flex-end"}}>
                                    <Typography variant="body2" color="#343434" style={{padding: "4px 20px 20px 20px"}}>Name</Typography>
                                    <Typography variant="body2" color="#636463" fontWeight="bold" style={{padding: "4px 20px 20px 20px"}}>Global Fund</Typography>
                                </div>
                            </div>
                        </ChallengesDiv>
                    </MediaCardDiv>
                    <Divider variant="middle" />
                </ContentDiv>

                <div style={{display: "flex", height: 478, backgroundColor: "#BBD7E8", margin: "64px auto", justifyContent: "space-between"}}>
                    <UserExperienceDiv windowWidth={width}>
                        <img src={UXTesting} width={"100%"} height={"auto"} style={{maxWidth: 151, maxHeight: 151}}/>
                        <UserExperienceTextDiv>
                            <Typography variant="h4" fontWeight="bold" color={"inherit"}>User experience testing</Typography>
                            <Typography variant="body2" color={"inherit"}>
                            We have recently undertaken a process of user experience testing and are grateful to all who willingly gave of their time to contribute to the improvement of the MTM for all its users.                        </Typography>
                            <Typography variant="body2" color={"inherit"}>
                            This user testing has led to the addition of the home, about and contact pages, the creation of the dashboards, a dedicated download interface, and a more streamlined map interface. We have also identified additional areas of improvement, which we are working on. These include increased guidance to facilitate decision-making, and additional map layers. We want to make this tool the best it can be so that together we have the resources to control and eliminate malaria.                        </Typography>
                            <StyledNewsletterButton size="large" variant="contained" style={{maxWidth: 265, fontSize: 15}}>Acknowledgements List</StyledNewsletterButton>
                        </UserExperienceTextDiv>
                    </UserExperienceDiv>
                </div>
                <Footer t={t} />
        </React.Fragment>
    );
};
