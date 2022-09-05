import { Box, Button, Container, Grid, Paper, TextField, Typography } from "@mui/material";
import React from "react";
import { useTranslation, Trans } from "react-i18next";
import styled from "styled-components";
import Layout from "../layout/Layout";
import HomepageMap from "../../assets/img/homepage-map.png";
import { connect } from "react-redux";
import { State } from "../../store/types";
import { selectFeedback } from "../../store/reducers/feedback-reducer";
import { feedbackFieldChange, feedbackSubmit } from "../../store/actions/feedback-actions";
import ShareDataChart from "../../assets/img/share-data-page/share-data-chart.png";
import ContributeDataGraphic from "../../assets/img/share-data-page/contribute-data.png";
import DownloadIcon from "@mui/icons-material/Download";

const ImageBanner = styled.div`
    background: linear-gradient(90deg, #bbd7e8 0%, #bbd7e800 100%), url(${HomepageMap});
    background-position: right;
    height: 25vh;
    min-height: 260px;
`;

const TitleContainer = styled(Container)`
    padding-top: 60px;
    font-weight: lighter;
    @media (max-width: 768px) {
        padding-top: 5vh;
    }
`;
const BlueStyledButton = styled(Button)`
    &.MuiButton-root {
        color: white;
        font-size: 18px;
        background-color: #1899cc;
        font-weight: bold;
        margin-top: 16px;
        padding: 6px 50px;
        width: fit-content;
        @media (max-width: 768px) {
            font-size: 13px;
            padding: 6px 20px;
        }
    }
`;

const BlackStyledButton = styled(Button)`
    &.MuiButton-root {
        color: white;
        font-size: 18px;
        background-color: black;
        font-weight: bold;
        margin-top: 16px;
        @media (max-width: 768px) {
            font-size: 13px;
        }
    }
`;

const ShareDataChartImage = styled.img`
    width: 80%;
    height: auto;
    z-index: 2;
    /* @media (max-width: 768px) {
        width: 90vw;
    } */
`;
const ContributeDataImage = styled.img`
    width: 70%;
    height: auto;
`;

const ListLink = styled.a`
    color: #08bbe1;
    &:visited {
        color: #08bbe1;
    }
    &:hover {
        color: #1899cc;
    }
`;

const mapStateToProps = (state: State) => ({
    feedback: selectFeedback(state),
});

const mapDispatchToProps = {
    fieldChange: feedbackFieldChange,
    submit: feedbackSubmit,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = StateProps & DispatchProps;

const ShareDataPage: React.FC<Props> = () => {
    const { t } = useTranslation();

    return (
        <Layout>
            <ImageBanner>
                <TitleContainer maxWidth="xl">
                    <Typography
                        variant="h2"
                        component="h1"
                        textTransform="uppercase"
                        fontSize={{ xs: "30px", sm: "5vw", md: "4vw", lg: "3vw" }}
                    >
                        <Trans i18nKey="common.shareDataPage.title" t={t}>
                            Contribute to the Malaria Threats Map by sharing your <strong>data</strong>
                        </Trans>
                    </Typography>
                </TitleContainer>
            </ImageBanner>
            <Container maxWidth="xl">
                <Grid container rowSpacing={7} columnSpacing={2} sx={{ marginTop: 4, marginBottom: 4 }}>
                    <Grid item md={6} xs={12} display="flex" flexDirection={"column"} justifyContent="center">
                        <Typography
                            fontSize={{ xs: "30px", md: "40px" }}
                            fontWeight="bold"
                            marginBottom="25px"
                            color="#343434"
                        >
                            {t("common.shareDataPage.section1.title")}
                        </Typography>
                        <Typography marginBottom="25px" fontSize={{ xs: "18px", md: "25px" }} maxWidth={"90%"}>
                            {t("common.shareDataPage.section1.description")}
                        </Typography>
                        <ul>
                            <li>
                                <Typography fontSize={{ xs: "18px", md: "25px" }}>
                                    {t("common.shareDataPage.section1.list.1")}{" "}
                                    <ListLink href="#">{t("common.shareDataPage.section1.list.download")}</ListLink>
                                </Typography>
                            </li>
                            <li>
                                <Typography fontSize={{ xs: "18px", md: "25px" }}>
                                    {t("common.shareDataPage.section1.list.2")}{" "}
                                    <ListLink href="#">{t("common.shareDataPage.section1.list.download")}</ListLink>
                                </Typography>
                            </li>
                            <li>
                                <Typography fontSize={{ xs: "18px", md: "25px" }}>
                                    {t("common.shareDataPage.section1.list.3")}{" "}
                                    <ListLink href="#">{t("common.shareDataPage.section1.list.download")}</ListLink>
                                </Typography>
                            </li>
                        </ul>
                        <BlueStyledButton variant="contained" color="primary" href="#">
                            {t("common.shareDataPage.buttons.send_data")}
                        </BlueStyledButton>
                    </Grid>
                    <Grid item md={6} xs={12} display={"flex"} alignItems="center" justifyContent={"center"}>
                        <Box
                            borderRadius={"100%"}
                            bgcolor="#5CCDCE"
                            width={{ xs: "65vw", sm: "60vw", md: "40vw", lg: "500px" }}
                            height={{ xs: "65vw", sm: "60vw", md: "40vw", lg: "500px" }}
                            position="absolute"
                        ></Box>
                        <ShareDataChartImage src={ShareDataChart} alt="Share Data Chart" />
                    </Grid>
                    <Grid
                        item
                        md={6}
                        xs={12}
                        display={"flex"}
                        alignItems="center"
                        justifyContent={{ xs: "center", md: "flex-start" }}
                        order={{ xs: 4, md: 3 }}
                    >
                        <ContributeDataImage src={ContributeDataGraphic} alt="Contribute Data Graphic" />
                    </Grid>
                    <Grid
                        item
                        md={6}
                        xs={12}
                        display="flex"
                        flexDirection={"column"}
                        justifyContent="center"
                        order={{ xs: 3, md: 4 }}
                    >
                        <Typography
                            fontWeight="bold"
                            fontSize={{ xs: "30px", md: "40px" }}
                            marginBottom="25px"
                            width={"100%"}
                            color="#343434"
                        >
                            <Trans i18nKey="common.shareDataPage.section2.title" t={t}>
                                Contribute <i>An. stephensi</i> detection data
                            </Trans>
                        </Typography>
                        <Typography fontSize={{ xs: "18px", md: "25px" }} marginBottom="25px" maxWidth={"90%"}>
                            {t("common.shareDataPage.section2.description")}
                        </Typography>
                        <Grid width={"100%"}>
                            <Grid item md={12} xs={12}>
                                <BlackStyledButton
                                    variant="contained"
                                    color="primary"
                                    href="#"
                                    startIcon={<DownloadIcon />}
                                >
                                    {t("common.shareDataPage.buttons.download_excel")}
                                </BlackStyledButton>
                            </Grid>
                            <Grid item md={12} xs={12}>
                                <BlueStyledButton variant="contained" color="primary" href="#">
                                    {t("common.shareDataPage.buttons.send_data")}
                                </BlueStyledButton>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </Layout>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(ShareDataPage);
