import React from "react";
import styled from "styled-components";
import { Button, Card, CircularProgress, Container, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { State } from "../../store/types";
import { selectLastUpdatedDates, selectTheme } from "../../store/reducers/base-reducer";
import { selectPreventionStudies } from "../../store/reducers/prevention-reducer";
import { selectDiagnosisStudies } from "../../store/reducers/diagnosis-reducer";
import { selectTreatmentStudies } from "../../store/reducers/treatment-reducer";
import { selectInvasiveStudies } from "../../store/reducers/invasive-reducer";
import { fetchPreventionStudiesRequest } from "../../store/actions/prevention-actions";
import { fetchDiagnosisStudiesRequest } from "../../store/actions/diagnosis-actions";
import { fetchTreatmentStudiesRequest } from "../../store/actions/treatment-actions";
import { fetchInvasiveStudiesRequest } from "../../store/actions/invasive-actions";
import { connect } from "react-redux";
import PreventionIcon from "../../assets/img/prevention-icon.svg";
import TreatmentIcon from "../../assets/img/treatment-icon.svg";
import DiagnosisIcon from "../../assets/img/diagnosis-icon.svg";
import InvasiveIcon from "../../assets/img/invasive-icon.svg";
import { Link } from "react-router-dom";

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
    preventionStudies: selectPreventionStudies(state),
    diagnosisStudies: selectDiagnosisStudies(state),
    treatmentStudies: selectTreatmentStudies(state),
    invasiveStudies: selectInvasiveStudies(state),
});

const mapDispatchToProps = {
    fetchPreventionStudies: fetchPreventionStudiesRequest,
    fetchDiagnosisStudies: fetchDiagnosisStudiesRequest,
    fetchTreatmentStudies: fetchTreatmentStudiesRequest,
    fetchInvasiveStudies: fetchInvasiveStudiesRequest,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

type Props = StateProps & DispatchProps;

const ThemesSection: React.FC<Props> = ({
    preventionStudies,
    diagnosisStudies,
    treatmentStudies,
    invasiveStudies,
    lastUpdatedDates,
    fetchPreventionStudies,
    fetchDiagnosisStudies,
    fetchTreatmentStudies,
    fetchInvasiveStudies,
}) => {
    const { t } = useTranslation();
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        fetchPreventionStudies();
        fetchDiagnosisStudies();
        fetchTreatmentStudies();
        fetchInvasiveStudies();
    }, [fetchPreventionStudies, fetchDiagnosisStudies, fetchTreatmentStudies, fetchInvasiveStudies]);

    React.useEffect(() => {
        if (
            preventionStudies.length !== 0 &&
            diagnosisStudies.length !== 0 &&
            treatmentStudies.length !== 0 &&
            invasiveStudies.length !== 0
        ) {
            setLoading(false);
        }
    }, [preventionStudies, diagnosisStudies, treatmentStudies, invasiveStudies]);

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
                numStudies: loading ? undefined : preventionStudies.length,
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
                numStudies: loading ? undefined : invasiveStudies.length,
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
                numStudies: loading ? undefined : treatmentStudies.length,
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
                numStudies: loading ? undefined : diagnosisStudies.length,
                link: "/stories?theme=diagnosis",
            },
        ],
        [t, diagnosisStudies, invasiveStudies, lastUpdatedDates, loading, preventionStudies, treatmentStudies]
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
