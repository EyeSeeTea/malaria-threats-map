import React from "react";
import Dialog from "@mui/material/Dialog";
import styled from "styled-components";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { Fade, Button, AppBar, Toolbar, Box, Container, Typography, Paper, Link } from "@mui/material";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import HomepageMap from "../../assets/img/homepage-map.png";
import Grid from '@mui/material/Grid';
import PreventionIcon from "../../assets/img/prevention-icon.svg";
import TreatmentIcon from "../../assets/img/treatment-icon.svg";
import DiagnosisIcon from "../../assets/img/diagnosis-icon.svg";
import InvasiveIcon from "../../assets/img/invasive-icon.svg";
import Divider from '@mui/material/Divider';
import WhoLogoBlue from "../../assets/img/who-logo-blue.png";
import Dashboards from "../../assets/img/dashboards.png";
import DataDownload from "../../assets/img/data_download.png";
import Maps from "../../assets/img/maps.png";
import LanguageSelectorSelect from "../../components/LanguageSelectorSelect";


const FlexGrow = styled.div`
    flex-grow: 1;
`;
const Row = styled.div`
    display: flex;
`;

const CenteredRow = styled(Row)`
    align-items: center;
    min-width: 20px;
`;

const Column = styled.div`
    padding-left: 10px;
    padding-right: 10px;
`;

const LanguageWrapper = styled.div`
    max-width: 200px;
`;

const WhiteColumn = styled(Column)`
    color: white;
`;

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

const StyledCardButton = styled(Button)`
    &.MuiButton-root {
        color: white;
        font-size: 1rem;
        background-color: #343434;
        width: 250px;
        font-weight: bold;

    }
`;

const StyledBanner = styled.div`
    display: block;
    position: relative;
    backgroundAttachment: fixed;
    margin: 0;
    left: 0;
    width: 100%;
    background: linear-gradient(90deg, #BBD7E8 0%, #BBD7E800 100%), url(${HomepageMap}) 0% 0% no-repeat padding-box;
    background-position: right;
    height: 720px;
    opacity: 1;
`;

interface MediaCardProps {
    title: string;
    subtitle: string;
    buttonText: string;
    image: string;
    buttonLink?: string;
}
const MediaCard = ({title, subtitle, buttonText, image }: MediaCardProps) => {
    return (
      <Card sx={{ maxWidth: 430, borderRadius: "15px", boxShadow: "0px 4px 10px #00000033" }}>
        <CardMedia
          component="img"
          height="230"
          image={image}
          alt="green iguana"
          style={{width: "94%", margin: "auto", padding: 10, borderRadius: "25px 25px 0 0"}}
        />
        <CardContent sx={{padding: "20px 50px"}}>
          <Typography gutterBottom variant="h5" component="div" textAlign="center" sx={{fontWeight: "bold"}}>
            {title}
          </Typography>
          <Typography variant="h6" color="text.secondary" textAlign="center" style={{color: "black", fontSize: 18 }}>
            {subtitle}
          </Typography>
        </CardContent>
        <CardActions style={{paddingBottom: 35}}>
          <StyledCardButton style={{margin: "auto", textAlign: "center"}} size="large" variant="contained">{buttonText}</StyledCardButton>
        </CardActions>
      </Card>
    );
  };

interface ThemePaperProps {
icon: string;
altText: string;
title: string;
subtitle: string;
color: string;
colorOpaque: string;
}
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

const ThemePaper = ({
    icon,
    altText,
    title,
    subtitle,
    color,
    colorOpaque }: ThemePaperProps) => {
return (
    <div>
        <Paper elevation={0} square style={{backgroundColor: color, display: "flex", flexDirection: "column", padding: color === "#5CCDCE" ? "40px 25px": 40}}>
            <div style={{display: "flex"}}>
                <img src={icon} alt={altText}/>

                <div style={{paddingLeft: 40}}>
                        <Typography gutterBottom variant="h4" component="div" textAlign="left" sx={{fontWeight: "bold", color: "white" }}>{title}</Typography>
                    <Typography gutterBottom variant="body1" component="div" textAlign="left">
                    {subtitle}
                    </Typography>
                </div>
            </div>
        </Paper>
        <Paper elevation={0} square style={{backgroundColor: colorOpaque, display: "flex", flexDirection: "column", padding: 40}}>
            <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                <div style={{display: "flex", flexDirection: "column"}}>
                    <Typography gutterBottom variant="body1" component="div" textAlign="left">
                        <strong>Number of studies:</strong> 23820
                    </Typography>
                    <Typography gutterBottom variant="body1" component="div" textAlign="left">
                    <strong>Database last updated:</strong> 28/09/2021
                    </Typography>
                </div>
                <StyledCardButton style={{textAlign: "center", margin: "auto 0"}} size="large" variant="contained">Read Story</StyledCardButton>
            </div>
        </Paper> 
    </div>
);
};
export const HomePage = () => {
    const { t } = useTranslation("common");
    const classes = {
        icon: { marginRight: 5 },
        menuOptionBox: { flexGrow: 1, display: { xs: "flex" }, width: "60%", margin: "auto" },
        screenshotBox: { flexGrow: 0 },
        appBar: { backgroundColor: "white" },
    };

    return (
        <React.Fragment>
            <StyledBanner>
                <div style={{ position: "relative", bottom: 0, top: 0, right: 0, left: 0 }}>
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
                                <Box sx={classes.screenshotBox}>
                                    <LanguageSelectorSelect section="homeItem" />
                                </Box>
                            </StyledToolbar>
                        </AppBar>
                    </Box>
                </div>

                <div style={{width: "80%", margin: "auto"}}>
                <div
                    style={{
                        marginTop: 100,
                    }}
                >
                    <Typography variant="h2" color={"inherit"} sx={{ textTransform: "uppercase" }}>
                        Malaria <br />
                        <strong>Threats Map</strong>
                    </Typography>
                    <Typography variant="h5" color={"inherit"} style={{ marginTop: 10 }}>
                    Explore data about the major biological threats to malaria control and elimination.
                    </Typography>
                </div>

                <div style={{marginTop: 81, marginBottom: 60, display: "flex", justifyContent: "space-between"}}>
                <MediaCard title="Maps" subtitle="Explore individual studies and site-level data for all the threats." buttonText="Enter Map" image={Maps} />
                <MediaCard title="Dashboards" subtitle="View summaries of the threats at different geographical levels." buttonText="View Dashboards" image={Dashboards}/>
                <MediaCard title="Data download" subtitle="Download the data behind the MTM for your own analysis." buttonText="Download Data" image={DataDownload} />
                </div>
                <div style={{width: "80%", margin: "auto", paddingTop: 20, paddingBottom: 40}}>
                    <Typography gutterBottom variant="h4" component="div" textAlign="center" sx={{fontWeight: "bold", lineHeight: "60px"}}>
                    The Malaria Threats Map is the most comprehensive platform on the four biological threats to malaria control and elimination.
                </Typography>
                 </div>

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
            </div>
            <Divider variant="fullWidth" style={{marginTop: 100 }} />
            <div style={{display: "flex", flexDirection: "row", justifyContent: "space-evenly", margin: "40px 0"}}>
                    <img src={WhoLogoBlue} style={{maxWidth: "100%", height: 55 }} alt="WHO Logo Blue" />
                    <div>
                        <Typography gutterBottom variant="body1" component="div" textAlign="left" color="#636463" fontWeight="bold">Policies </Typography>
                        <Link href="#" underline="none" variant="h6" textAlign="left" color="#343434">Disclaimer</Link>
                    </div>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <Typography gutterBottom variant="body1" component="div" textAlign="left" color="#636463" fontWeight="bold">Other WHO resources</Typography>
                        <Link href="#" underline="none" variant="h6" textAlign="left" color="#343434" style={{margin: "5px 0"}}>WHO insecticide resistance monitoring</Link>
                        <Link href="#" underline="none" variant="h6" textAlign="left" color="#343434" style={{margin: "5px 0"}}>WHO malaria drug efficacy and resistance</Link>
                        <Link href="#" underline="none" variant="h6" textAlign="left" color="#343434" style={{margin: "5px 0"}}>WHO malaria RDT guidelines</Link>
                        <Link href="#" underline="none" variant="h6" textAlign="left" color="#343434" style={{margin: "5px 0"}}>WHO malaria guidelines</Link>
                        <Link href="#" underline="none" variant="h6" textAlign="left" color="#343434" style={{margin: "5px 0"}}>WHO World malaria report</Link>
                    </div>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <Typography gutterBottom variant="body1" component="div" textAlign="left" color="#636463" fontWeight="bold">About WHO GMP</Typography>
                        <Link href="#" underline="none" variant="h6" textAlign="left" color="#343434" style={{margin: "5px 0"}}>WHO Global Malaria Programme</Link>
                        <Link href="#" underline="none" variant="h6" textAlign="left" color="#343434" style={{margin: "5px 0"}}>Contact us</Link>
                        <Button style={{textAlign: "center", margin: "auto 0", color: "white", backgroundColor: "#343434", fontWeight: "bold"}} size="large" variant="contained">SUBSCRIBE TO GMP NEWSLETTER</Button>
                    </div>
            </div>
            <Divider variant="fullWidth" />
        <div style={{padding: "25px 0", width: "85%", margin: "auto", display: "flex", justifyContent: "space-between"}}>
                <Link href="#" underline="none" variant="body1" textAlign="center" color="#343434">Privacy Legal Notice</Link>
                <Typography variant="body1" textAlign="center" color="#343434">© 2021 WHO</Typography>
            </div>
            </StyledBanner>
        </React.Fragment>
    );
};