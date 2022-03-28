import React, { Component } from "react";
import { DiagnosisIcon, InvasiveIcon, PreventionIcon, TreatmentIcon } from "./Icons";
import styled from "styled-components";
import { Box, Button, Grid, IconButton } from "@mui/material";
import { State } from "../store/types";
import { connect } from "react-redux";
import { setThemeAction } from "../store/actions/base-actions";
import { selectTheme } from "../store/reducers/base-reducer";
import { Translation } from "react-i18next";
import { selectPreventionStudiesError } from "../store/reducers/prevention-reducer";
import { selectDiagnosisStudiesError } from "../store/reducers/diagnosis-reducer";
import { selectTreatmentStudiesError } from "../store/reducers/treatment-reducer";
import { selectInvasiveStudiesError } from "../store/reducers/invasive-reducer";

const GridContainer = styled(Grid)`
    padding: 10px 20px;
`;

const GridItem = styled(Grid)`
    padding: 8px 0px;
`;

const StyledIconButton = styled(IconButton)`
    padding: 8px 40px 4px 40px !important;
`;

const ThemeButton = styled.div<{ disabled?: boolean }>`
    display: flex;
    flex-direction: column;
    text-align: center;
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
    padding 4px;
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

const LearnMoreButton = styled(Button)`
    color: #487299;
    font-size: 13px;
    text-decoration: underline;
    padding: 2px 8px;
`;

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
    preventionError: selectPreventionStudiesError(state),
    diagnosisError: selectDiagnosisStudiesError(state),
    treatmentError: selectTreatmentStudiesError(state),
    invasiveError: selectInvasiveStudiesError(state),
});

const mapDispatchToProps = {
    setTheme: setThemeAction,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

class ThemeSelector extends Component<Props> {
    render() {
        const { theme, setTheme, preventionError, diagnosisError, treatmentError, invasiveError } = this.props;
        return (
            <Translation>
                {t => {
                    return (
                        <Box sx={{ flexGrow: 1 }}>
                            <GridContainer container spacing={1}>
                                <GridItem item xs={6}>
                                    <ThemeButton disabled={!!preventionError}>
                                        <StyledIconButton
                                            disableRipple
                                            disabled={!!preventionError}
                                            title={t("common.themes.prevention")}
                                            onClick={() => setTheme("prevention")}
                                        >
                                            <PreventionIcon selected={theme === "prevention" && !preventionError} />
                                        </StyledIconButton>
                                        <Title>{t("common.themes.prevention")}</Title>
                                        <LearnMoreButton variant="text">{t("common.themes.learnMore")}</LearnMoreButton>
                                    </ThemeButton>
                                </GridItem>
                                <GridItem item xs={6}>
                                    <ThemeButton disabled={!!invasiveError}>
                                        <StyledIconButton
                                            disableRipple
                                            title={t("common.themes.invasive")}
                                            disabled={!!invasiveError}
                                            onClick={() => setTheme("invasive")}
                                        >
                                            <InvasiveIcon selected={theme === "invasive"} />
                                        </StyledIconButton>
                                        <Title>{t("common.themes.invasive")}</Title>
                                        <LearnMoreButton variant="text">{t("common.themes.learnMore")}</LearnMoreButton>
                                    </ThemeButton>
                                </GridItem>
                                <GridItem item xs={6}>
                                    <ThemeButton disabled={!!treatmentError}>
                                        <StyledIconButton
                                            disableRipple
                                            title={t("common.themes.treatment")}
                                            disabled={!!treatmentError}
                                            onClick={() => setTheme("treatment")}
                                        >
                                            <TreatmentIcon selected={theme === "treatment"} />
                                        </StyledIconButton>
                                        <Title>{t("common.themes.treatment")}</Title>
                                        <LearnMoreButton variant="text">{t("common.themes.learnMore")}</LearnMoreButton>
                                    </ThemeButton>
                                </GridItem>
                                <GridItem item xs={6}>
                                    <ThemeButton disabled={!!diagnosisError}>
                                        <StyledIconButton
                                            disableRipple
                                            disabled={!!diagnosisError}
                                            title={t("common.themes.diagnosis")}
                                            onClick={() => setTheme("diagnosis")}
                                        >
                                            <DiagnosisIcon selected={theme === "diagnosis"} />
                                        </StyledIconButton>
                                        <Title>{t("common.themes.diagnosis")}</Title>
                                        <LearnMoreButton variant="text">{t("common.themes.learnMore")}</LearnMoreButton>
                                    </ThemeButton>
                                </GridItem>
                            </GridContainer>
                        </Box>
                    );
                }}
            </Translation>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ThemeSelector);
