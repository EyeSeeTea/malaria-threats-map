import { Box, Container, Grid, Typography } from "@mui/material";
import React from "react";
import { useTranslation, Trans, TFunction } from "react-i18next";
import styled from "styled-components";
import Layout from "../layout/Layout";
import HomepageMap from "../../assets/img/homepage-map.png";
import { connect } from "react-redux";
import { State } from "../../store/types";
import { selectFeedback } from "../../store/reducers/feedback-reducer";
import { feedbackFieldChange, feedbackSubmit } from "../../store/actions/feedback-actions";
import ShareDataChart from "../../assets/img/share-data-page/share-data-chart.png";
import ContributeDataGraphic from "../../assets/img/share-data-page/contribute-data.png";
import { useSendAnalyticsPageView } from "../../hooks/useSendAnalyticsPageView";

const ImageBanner = styled.div`
    display: flex;
    background: linear-gradient(90deg, #bbd7e8 0%, #bbd7e800 100%), url(${HomepageMap});
    background-position: right;
    height: 30vh;
    min-height: 260px;
`;

const TitleContainer = styled(Container)`
    display: flex;
    align-items: center;
    font-weight: lighter;
`;

const ShareDataChartImage = styled.img`
    width: 80%;
    height: auto;
    z-index: 2;
`;

const ContributeDataImage = styled.img`
    width: 70%;
    height: auto;
`;

const mapStateToProps = (state: State) => ({
    feedback: selectFeedback(state),
});

const mapDispatchToProps = {
    fieldChange: feedbackFieldChange,
    submit: feedbackSubmit,
};

const SectionsFooter = ({ t }: { t: TFunction<"translation", undefined> }) => {
    useSendAnalyticsPageView();

    return (
        <Typography variant="body1">
            <Trans i18nKey="common.shareDataPage.sectionsFooter" t={t}>
                Completed forms can be sent to:{" "}
                <a href="mailto:vectorsurveillance@who.int" target="_blank" rel="noreferrer">
                    vectorsurveillance@who.int
                </a>
            </Trans>
        </Typography>
    );
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
                    <Typography variant="h2" component="h1" textTransform="uppercase">
                        <Trans i18nKey="common.shareDataPage.title" t={t}>
                            Contribute to the Malaria Threats Map by sharing your <strong>data</strong>
                        </Trans>
                    </Typography>
                </TitleContainer>
            </ImageBanner>
            <Container maxWidth="xl">
                <Grid container rowSpacing={7} columnSpacing={2} sx={{ marginTop: 4, marginBottom: 4 }}>
                    <Grid item md={6} xs={12} display="flex" flexDirection={"column"} justifyContent="center">
                        <Typography variant="h4" fontWeight="bold" marginBottom="25px">
                            {t("common.shareDataPage.section1.title")}
                        </Typography>
                        <Typography variant="body1" marginBottom="25px" maxWidth={"90%"}>
                            <Trans i18nKey="common.shareDataPage.section1.description" t={t}>
                                We invite data submissions from all individuals and organizations. Please report your
                                data using the following WHO standard data collection forms. Forms are available for
                                download{" "}
                                <a
                                    href="https://www.who.int/teams/global-malaria-programme/prevention/vector-control/global-database-on-insecticide-resistance-in-malaria-vectors"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    here
                                </a>
                                .
                            </Trans>
                        </Typography>
                        <ul>
                            <li>
                                <Typography variant="body1">{t("common.shareDataPage.section1.list.1")}</Typography>
                            </li>
                            <li>
                                <Typography variant="body1">{t("common.shareDataPage.section1.list.2")}</Typography>
                            </li>
                            <li>
                                <Typography variant="body1">{t("common.shareDataPage.section1.list.3")}</Typography>
                            </li>
                            <li>
                                <Typography variant="body1">{t("common.shareDataPage.section1.list.4")}</Typography>
                            </li>
                        </ul>
                        <SectionsFooter t={t} />
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
                        <Typography variant="h4" fontWeight="bold" marginBottom="25px" width={"100%"}>
                            <Trans i18nKey="common.shareDataPage.section2.title" t={t}>
                                Contribute <i>An. stephensi</i> detection data
                            </Trans>
                        </Typography>
                        <Typography variant="body1" marginBottom="25px" maxWidth={"90%"}>
                            <Trans i18nKey="common.shareDataPage.section2.description" t={t}>
                                We invite data submissions from all individuals and organizations about{" "}
                                <i>An. stephensi</i> detection outside of its native areas. Please report your data
                                using the WHO standard data collection form, available{" "}
                                <a
                                    href="https://www.who.int/teams/global-malaria-programme/prevention/vector-control/global-databases-on-invasive-mosquito-vector-species"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    here
                                </a>
                                .
                            </Trans>
                        </Typography>
                        <SectionsFooter t={t} />
                    </Grid>
                </Grid>
            </Container>
        </Layout>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(ShareDataPage);
