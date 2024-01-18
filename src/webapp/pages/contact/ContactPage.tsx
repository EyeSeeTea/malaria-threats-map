import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import React from "react";
import styled from "styled-components";
import Layout from "../layout/Layout";
import HomepageMap from "../../assets/img/homepage-map.png";
import { connect } from "react-redux";
import { State } from "../../store/types";
import { selectFeedback } from "../../store/reducers/feedback-reducer";
import { feedbackFieldChange, feedbackSubmit } from "../../store/actions/feedback-actions";
import { useTranslation, Trans } from "react-i18next";
import GoodReview from "../../assets/img/contact-page/good-review.png";
import TecnicalSupportGraphic from "../../assets/img/contact-page/computer-map.png";
import { Link } from "react-router-dom";
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

const GoodReviewImage = styled.img`
    width: 130px;
    height: auto;
    z-index: 2;
    @media (max-width: 768px) {
        width: 20%;
    }
`;

const TecnicalSupportImage = styled.img`
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

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = StateProps & DispatchProps;

const ContactPage: React.FC<Props> = () => {
    useSendAnalyticsPageView();

    const { t } = useTranslation();

    return (
        <Layout>
            <ImageBanner>
                <TitleContainer maxWidth="xl">
                    <Typography variant="h2" component="h1" textTransform="uppercase">
                        <Trans i18nKey="common.contactPage.title" t={t}>
                            Contribute to the Malaria Threats Map by sharing your <strong>feedback</strong>
                        </Trans>
                    </Typography>
                </TitleContainer>
            </ImageBanner>
            <Container maxWidth="xl">
                <Grid container rowSpacing={12} columnSpacing={2} sx={{ marginTop: 4, marginBottom: 4 }}>
                    <Grid item md={6} xs={12} display="flex" flexDirection={"column"} justifyContent="center">
                        <Typography variant="h4" fontWeight="bold" marginBottom="25px">
                            {t("common.contactPage.section1.title")}
                        </Typography>
                        <Typography variant="body1" marginBottom="25px" maxWidth={"90%"}>
                            <Trans i18nKey="common.contactPage.section1.description" t={t}>
                                We are eager to hear how you use the MTM and how we can improve the platform for all its
                                users. To contact the MTM team, email
                                <a href="mailto:gmp-maps@who.int" target="_blank" rel="noreferrer">
                                    gmp-maps@who.int
                                </a>
                                .
                            </Trans>
                        </Typography>
                    </Grid>
                    <Grid item md={6} xs={12} display={"flex"} alignItems="center" justifyContent={"center"}>
                        <Box
                            borderRadius={"100%"}
                            bgcolor="#5CCDCE"
                            width={{ xs: "40vw", sm: "30vw", md: "250px", lg: "300px" }}
                            height={{ xs: "40vw", sm: "30vw", md: "250px", lg: "300px" }}
                            border="7px solid gray"
                            position="absolute"
                        ></Box>
                        <GoodReviewImage src={GoodReview} alt="Feedback" />
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
                        <TecnicalSupportImage src={TecnicalSupportGraphic} alt="Tecnical Support Graphic" />
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
                        <Stack>
                            <Typography variant="h4" fontWeight="bold" marginBottom="25px">
                                {t("common.contactPage.section2.title1")}
                            </Typography>
                            <Typography variant="body1" marginBottom="25px" maxWidth={"90%"}>
                                <Trans i18nKey="common.contactPage.section2.description1" t={t}>
                                    If you would like to submit data to the MTM, please use the{" "}
                                    <Link to="/share-data">share data</Link> portal.
                                </Trans>
                            </Typography>
                            <Typography variant="h4" fontWeight="bold" marginBottom="25px">
                                {t("common.contactPage.section2.title2")}
                            </Typography>
                            <Typography variant="body1" marginBottom="25px" maxWidth={"90%"}>
                                {t("common.contactPage.section2.description2")}
                            </Typography>
                        </Stack>
                    </Grid>
                </Grid>
            </Container>
        </Layout>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(ContactPage);
