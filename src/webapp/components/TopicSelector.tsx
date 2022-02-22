import React, { Component } from "react";
import { DiagnosisIcon, InvasiveIcon, PreventionIcon, TreatmentIcon } from "./Icons";
import styled from "styled-components";
import { Paper } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { State } from "../store/types";
import { connect } from "react-redux";
import { setThemeAction } from "../store/actions/base-actions";
import { selectTheme } from "../store/reducers/base-reducer";
import { Translation } from "react-i18next";
import { selectPreventionStudiesError } from "../store/reducers/prevention-reducer";
import { selectDiagnosisStudiesError } from "../store/reducers/diagnosis-reducer";
import { selectTreatmentStudiesError } from "../store/reducers/treatment-reducer";
import { selectInvasiveStudiesError } from "../store/reducers/invasive-reducer";

const ButtonGroup = styled.div`
    display: flex;
    justify-content: space-around;
    font-size: 90%;
`;

const StyledPaper = styled(Paper)`
    min-width: 250px;
    padding: 8px;
    pointer-events: all;
`;

const ThemeButton = styled.div<{ disabled?: boolean }>`
    display: flex;
    flex-direction: column;
    text-align: center;
    cursor: ${props => (props.disabled ? "not-allowed" : "")};
    opacity: ${props => (props.disabled ? 0.7 : 1)};
`;

const StyledIconButton = styled(IconButton)`
    padding: 8px !important;
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
                        <StyledPaper>
                            <ButtonGroup>
                                <ThemeButton disabled={!!preventionError}>
                                    <StyledIconButton
                                        title={t("common.themes.prevention")}
                                        onClick={() => setTheme("prevention")}
                                        disabled={!!preventionError}
                                    >
                                        <PreventionIcon active={theme === "prevention" && !preventionError} />
                                    </StyledIconButton>
                                </ThemeButton>
                                <ThemeButton disabled={!!diagnosisError}>
                                    <StyledIconButton
                                        title={t("common.themes.diagnosis")}
                                        onClick={() => setTheme("diagnosis")}
                                        disabled={!!diagnosisError}
                                    >
                                        <DiagnosisIcon active={theme === "diagnosis"} />
                                    </StyledIconButton>
                                </ThemeButton>
                                <ThemeButton disabled={!!treatmentError}>
                                    <StyledIconButton
                                        title={t("common.themes.treatment")}
                                        onClick={() => setTheme("treatment")}
                                        disabled={!!treatmentError}
                                    >
                                        <TreatmentIcon active={theme === "treatment"} />
                                    </StyledIconButton>
                                </ThemeButton>
                                <ThemeButton disabled={!!invasiveError}>
                                    <StyledIconButton
                                        title={t("common.themes.invasive")}
                                        onClick={() => setTheme("invasive")}
                                        disabled={!!invasiveError}
                                    >
                                        <InvasiveIcon active={theme === "invasive"} />
                                    </StyledIconButton>
                                </ThemeButton>
                            </ButtonGroup>
                        </StyledPaper>
                    );
                }}
            </Translation>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ThemeSelector);
