import React from "react";
import { DiagnosisIcon, InvasiveIcon, PreventionIcon, TreatmentIcon } from "./Icons";
import styled from "styled-components";
import { Box, Grid, GridSize, IconButton } from "@mui/material";
import { State } from "../store/types";
import { connect } from "react-redux";
import { setActionGroupSelected, setThemeAction, Source } from "../store/actions/base-actions";
import { selectTheme } from "../store/reducers/base-reducer";
import { selectPreventionStudiesError } from "../store/reducers/prevention-reducer";
import { selectDiagnosisStudiesError } from "../store/reducers/diagnosis-reducer";
import { selectTreatmentStudiesError } from "../store/reducers/treatment-reducer";
import { selectInvasiveStudiesError } from "../store/reducers/invasive-reducer";
import { useTranslation } from "react-i18next";

const GridContainer = styled(Grid)`
    padding: 18px 20px;
`;

const ThemeButton = styled.div<{ disabled?: boolean }>`
    display: flex;
    flex-direction: column;
    text-align: center;
    align-items: center;
    justify-content: center;

    cursor: ${props => (props.disabled ? "not-allowed" : "")};
    opacity: ${props => (props.disabled ? 0.7 : 1)};
    background: #f5f5f5;
    border-radius: 10px;
    &.Mui-selected {
        background-color: #e2e2e2;
    }
    &.Mui-selected:hover {
        background-color: #e2e2e2;
    }
    height: 152px;
    padding: 6px;
`;

const Title = styled.span`
    color: black;
    font-size: 13px;
    letter-spacing: 0px;
    margin: 0px;
    text-transform: none;
    font-weight: 300;
    line-height: 16px;
    height: 50px;
    display: inline-flex;
    align-items: center;
`;

// const LearnMoreButton = styled(Button)`
//     color: #487299;
//     font-size: 13px;
//     text-decoration: underline;
//     padding: 2px 8px;
// `;

interface ownProps {
    themeItemGridSize?: GridSize;
    from: Source;
}

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
    preventionError: selectPreventionStudiesError(state),
    diagnosisError: selectDiagnosisStudiesError(state),
    treatmentError: selectTreatmentStudiesError(state),
    invasiveError: selectInvasiveStudiesError(state),
});

const mapDispatchToProps = {
    setTheme: setThemeAction,
    setActionGroupSelected: setActionGroupSelected,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps & ownProps;

const ThemeSelector: React.FC<Props> = ({
    from,
    themeItemGridSize,
    theme,
    setTheme,
    preventionError,
    diagnosisError,
    treatmentError,
    invasiveError,
    setActionGroupSelected,
}) => {
    const { t } = useTranslation();

    const handlePreventionClick = React.useCallback(() => {
        setTheme("prevention", from);

        if (from === "map") {
            setActionGroupSelected("MAP_TYPE");
        } else {
            setActionGroupSelected("DATASET");
        }
    }, [setTheme, setActionGroupSelected, from]);

    const handleInvasiveClick = React.useCallback(() => {
        setTheme("invasive", from);

        if (from === "map") {
            setActionGroupSelected("DATA");
        } else {
            setActionGroupSelected(null);
        }
    }, [setTheme, setActionGroupSelected, from]);

    const handleDiagnosisClick = React.useCallback(() => {
        setTheme("diagnosis", from);

        if (from === "map") {
            setActionGroupSelected("MAP_TYPE");
        } else {
            setActionGroupSelected(null);
        }
    }, [setTheme, setActionGroupSelected, from]);

    const handleTreatmentClick = React.useCallback(() => {
        setTheme("treatment", from);

        if (from === "map") {
            setActionGroupSelected("MAP_TYPE");
        } else {
            setActionGroupSelected("DATASET");
        }
    }, [setTheme, setActionGroupSelected, from]);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <GridContainer container spacing={2}>
                <Grid item xs={themeItemGridSize || 6}>
                    <ThemeButton disabled={!!invasiveError}>
                        <IconButton
                            disableRipple
                            title={t("common.themes.invasive")}
                            disabled={!!invasiveError}
                            onClick={handleInvasiveClick}
                        >
                            <InvasiveIcon selected={theme === "invasive"} />
                        </IconButton>
                        <Title>{t("common.themes.invasive")}</Title>
                        {/* <LearnMoreButton variant="text">{t("common.themes.learnMore")}</LearnMoreButton> */}
                    </ThemeButton>
                </Grid>
                <Grid item xs={themeItemGridSize || 6}>
                    <ThemeButton disabled={!!preventionError}>
                        <IconButton
                            disableRipple
                            disabled={!!preventionError}
                            title={t("common.themes.prevention")}
                            onClick={handlePreventionClick}
                        >
                            <PreventionIcon selected={theme === "prevention" && !preventionError} />
                        </IconButton>
                        <Title>{t("common.themes.prevention")}</Title>
                        {/* <LearnMoreButton variant="text">{t("common.themes.learnMore")}</LearnMoreButton> */}
                    </ThemeButton>
                </Grid>
                <Grid item xs={themeItemGridSize || 6}>
                    <ThemeButton disabled={!!treatmentError}>
                        <IconButton
                            disableRipple
                            title={t("common.themes.treatment")}
                            disabled={!!treatmentError}
                            onClick={handleTreatmentClick}
                        >
                            <TreatmentIcon selected={theme === "treatment"} />
                        </IconButton>
                        <Title>{t("common.themes.treatment")}</Title>
                        {/* <LearnMoreButton variant="text">{t("common.themes.learnMore")}</LearnMoreButton> */}
                    </ThemeButton>
                </Grid>
                <Grid item xs={themeItemGridSize || 6}>
                    <ThemeButton disabled={!!diagnosisError}>
                        <IconButton
                            disableRipple
                            disabled={!!diagnosisError}
                            title={t("common.themes.diagnosis")}
                            onClick={handleDiagnosisClick}
                        >
                            <DiagnosisIcon selected={theme === "diagnosis"} />
                        </IconButton>
                        <Title>{t("common.themes.diagnosis")}</Title>
                        {/* <LearnMoreButton variant="text">{t("common.themes.learnMore")}</LearnMoreButton> */}
                    </ThemeButton>
                </Grid>
            </GridContainer>
        </Box>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(ThemeSelector);
