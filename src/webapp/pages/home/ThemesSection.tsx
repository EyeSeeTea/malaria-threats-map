import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, Card, CircularProgress, Container, Grid, Typography } from "@mui/material";

import { State } from "../../store/types";
import { selectLastUpdatedDates, selectTheme, selectTotalStudiesInThemes } from "../../store/reducers/base-reducer";
import { fetchPreventionStudiesRequest } from "../../store/actions/prevention-actions";
import { fetchDiagnosisStudiesRequest } from "../../store/actions/diagnosis-actions";
import { fetchTreatmentStudiesRequest } from "../../store/actions/treatment-actions";
import { fetchInvasiveStudiesRequest } from "../../store/actions/invasive-actions";
import { getTotalStudiesInThemesRequestAction } from "../../store/actions/base-actions";
import PreventionIcon from "../../assets/img/prevention-icon.svg";
import TreatmentIcon from "../../assets/img/treatment-icon.svg";
import DiagnosisIcon from "../../assets/img/diagnosis-icon.svg";
import InvasiveIcon from "../../assets/img/invasive-icon.svg";

const Section = styled.section`
    padding: 10vmin;
`;

const ThemeCard = styled(Card)`
    height: 100%;
    display: flex;
    flex-direction: column;
`;

const ThemeCardContent = styled(Grid)<{ background: string }>`
    background: ${props => props.background};
    flex: 1;
    padding: 4vmin 6vmin;
`;

const ThemeCardActions = styled(Grid)<{ background: string }>`
    background: ${props => props.background};
    padding: 4vmin 6vmin;
`;

const StyledCardButton = styled(Button)`
    &.MuiButton-root {
        color: white;
        background-color: #343434;
        width: 160px;
        font-weight: bold;
        text-align: center;
        display: block;
        margin: auto 0;
    }
`;

const mapStateToProps = (state: State) => ({
    lastUpdatedDates: selectLastUpdatedDates(state),
    theme: selectTheme(state),
    totalStudiesInThemes: selectTotalStudiesInThemes(state),
});

const mapDispatchToProps = {
    fetchPreventionStudies: fetchPreventionStudiesRequest,
    fetchDiagnosisStudies: fetchDiagnosisStudiesRequest,
    fetchTreatmentStudies: fetchTreatmentStudiesRequest,
    fetchInvasiveStudies: fetchInvasiveStudiesRequest,
    fetchTotalStudiesInThemes: getTotalStudiesInThemesRequestAction,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

type Props = StateProps & DispatchProps;

// NOTICE: fetchPreventionStudie has been commented out because it freezes the navigation menu until the request and build from csv to data is not completed.
const ThemesSection: React.FC<Props> = ({
    lastUpdatedDates,
    totalStudiesInThemes,
    // fetchPreventionStudies,
    fetchDiagnosisStudies,
    fetchTreatmentStudies,
    fetchInvasiveStudies,
    fetchTotalStudiesInThemes,
}) => {
    const { t } = useTranslation();
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        // fetchPreventionStudies();
        fetchDiagnosisStudies();
        fetchTreatmentStudies();
        fetchInvasiveStudies();
        fetchTotalStudiesInThemes();
    }, [
        // fetchPreventionStudies,
        fetchDiagnosisStudies,
        fetchTreatmentStudies,
        fetchInvasiveStudies,
        fetchTotalStudiesInThemes,
    ]);

    React.useEffect(() => {
        if (
            totalStudiesInThemes.prevention &&
            totalStudiesInThemes.diagnosis &&
            totalStudiesInThemes.treatment &&
            totalStudiesInThemes.invasive
        ) {
            setLoading(false);
        }
    }, [
        totalStudiesInThemes.diagnosis,
        totalStudiesInThemes.invasive,
        totalStudiesInThemes.prevention,
        totalStudiesInThemes.treatment,
    ]);

    const themes = React.useMemo(
        () => [
            {
                title: t("common.themes.prevention"),
                subtitle: t("common.homepage.theme_paper.prevention_subtitle"),
                icon: PreventionIcon,
                altText: "Prevention Icon",
                color: "#5ABE86",
                colorOpaque: "rgb(90, 190, 134, 0.9)",
                lastUpdated: loading ? undefined : lastUpdatedDates["prevention"]?.toLocaleDateString(),
                numStudies: loading ? undefined : totalStudiesInThemes.prevention,
                link: "/stories?theme=prevention",
            },
            {
                title: t("common.themes.invasive"),
                subtitle: t("common.homepage.theme_paper.invasive_subtitle"),
                icon: InvasiveIcon,
                altText: "Invasive Icon",
                color: "#5CC579",
                colorOpaque: "rgb(92, 197, 121, 0.9)",
                lastUpdated: loading ? undefined : lastUpdatedDates["invasive"]?.toLocaleDateString(),
                numStudies: loading ? undefined : totalStudiesInThemes.invasive,
                link: "/stories?theme=invasive",
            },
            {
                title: t("common.themes.treatment"),
                subtitle: t("common.homepage.theme_paper.treatment_subtitle"),
                icon: TreatmentIcon,
                altText: "Invasive Icon",
                color: "#5CCDCE",
                colorOpaque: "rgb(92, 205, 206, 0.9)",
                lastUpdated: loading ? undefined : lastUpdatedDates["treatment"]?.toLocaleDateString(),
                numStudies: loading ? undefined : totalStudiesInThemes.treatment,
                link: "/stories?theme=treatment",
            },
            {
                title: t("common.themes.diagnosis"),
                subtitle: t("common.homepage.theme_paper.diagnosis_subtitle"),
                icon: DiagnosisIcon,
                altText: "Diagnosis Icon",
                color: "#1899CC",
                colorOpaque: "rgb(24, 153, 204, 0.9)",
                lastUpdated: loading ? undefined : lastUpdatedDates["diagnosis"]?.toLocaleDateString(),
                numStudies: loading ? undefined : totalStudiesInThemes.diagnosis,
                link: "/stories?theme=diagnosis",
            },
        ],
        [
            lastUpdatedDates,
            loading,
            t,
            totalStudiesInThemes.diagnosis,
            totalStudiesInThemes.invasive,
            totalStudiesInThemes.prevention,
            totalStudiesInThemes.treatment,
        ]
    );

    return (
        <Section>
            <Container maxWidth="xl">
                <Typography variant="h4" fontWeight="bold" color="inherit" marginBottom="10vmin" align="center">
                    {t("common.homepage.header")}
                </Typography>
                <Grid container spacing={5} sx={{ marginBottom: 6 }} justifyContent="center">
                    {themes.map((theme, index) => {
                        return (
                            <Grid key={index} item md={6} xs={12}>
                                <ThemeCard>
                                    <ThemeCardContent
                                        background={theme.color}
                                        container
                                        rowSpacing={3}
                                        columnSpacing={8}
                                    >
                                        <Grid item lg={3} md={12} style={{ width: "100%" }}>
                                            <img
                                                src={theme.icon}
                                                alt={theme.altText}
                                                width="100vh"
                                                style={{ margin: "auto", display: "block" }}
                                            />
                                        </Grid>
                                        <Grid item lg={9} md={12}>
                                            <Typography gutterBottom variant="h5" textAlign="left">
                                                {theme.title}
                                            </Typography>
                                            <Typography gutterBottom variant="body1" component="div" textAlign="left">
                                                {theme.subtitle}
                                            </Typography>
                                        </Grid>
                                    </ThemeCardContent>
                                    <ThemeCardActions
                                        background={theme.colorOpaque}
                                        container
                                        rowSpacing={3}
                                        columnSpacing={1}
                                        alignItems="center"
                                    >
                                        <Grid item lg={8} md={12} style={{ width: "100%" }}>
                                            <Typography gutterBottom variant="body1" component="div" textAlign="left">
                                                <strong>{t("common.legend.number_of_studies")}: </strong>
                                                {theme.numStudies ? (
                                                    theme.numStudies
                                                ) : (
                                                    <CircularProgress size="20px" color="info" />
                                                )}
                                            </Typography>
                                            <Typography gutterBottom variant="body1" component="div" textAlign="left">
                                                <strong>{t("common.homepage.media_cards.db_last_updated")}: </strong>
                                                {theme.lastUpdated ? (
                                                    theme.lastUpdated
                                                ) : (
                                                    <CircularProgress size="20px" color="info" />
                                                )}
                                            </Typography>
                                        </Grid>
                                        <Grid item lg={4} md={12} alignContent="center" alignItems="center">
                                            <Link to={theme.link} style={{ textDecoration: "none" }}>
                                                <StyledCardButton variant="contained">
                                                    {t("common.homepage.media_cards.read_story")}
                                                </StyledCardButton>
                                            </Link>
                                        </Grid>
                                    </ThemeCardActions>
                                </ThemeCard>
                            </Grid>
                        );
                    })}
                </Grid>
            </Container>
        </Section>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(ThemesSection);
