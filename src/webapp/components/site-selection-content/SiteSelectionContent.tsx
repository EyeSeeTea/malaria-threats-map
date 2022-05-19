import React from "react";
import { connect } from "react-redux";
import { selectTheme } from "../../store/reducers/base-reducer";
import { selectPreventionSelectionStudies } from "../../store/reducers/prevention-reducer";
import { selectDiagnosisSelectionStudies } from "../../store/reducers/diagnosis-reducer";
import { selectTreatmentSelectionStudies } from "../../store/reducers/treatment-reducer";
import { selectInvasiveSelectionStudies } from "../../store/reducers/invasive-reducer";
import { setSelection } from "../../store/actions/base-actions";
import { State } from "../../store/types";
import DiagnosisSelectionChart from "../layers/diagnosis/DiagnosisSelectionChart";
import InvasiveSelectionChart from "../layers/invasive/InvasiveSelectionChart";
import PreventionSelectionChart from "../layers/prevention/PreventionSelectionChart";
import TreatmentSelectionChart from "../layers/treatment/TreatmentSelectionChart";
import styled from "styled-components";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export const Container = styled.div<{ padding?: string }>`
    padding: ${props => props.padding || "60px 0px"};
`;

export const IconContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: end;
`;

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
    preventionSelectionStudies: selectPreventionSelectionStudies(state),
    diagnosisSelectionStudies: selectDiagnosisSelectionStudies(state),
    treatmentSelectionStudies: selectTreatmentSelectionStudies(state),
    invasiveSelectionStudies: selectInvasiveSelectionStudies(state),
});

const mapDispatchToProps = {
    setSelection: setSelection,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

const SiteSelectionContent: React.FC<Props> = ({
    theme,
    preventionSelectionStudies,
    diagnosisSelectionStudies,
    treatmentSelectionStudies,
    invasiveSelectionStudies,
    setSelection,
}) => {
    const handleClose = React.useCallback(() => {
        setSelection(null);
    }, [setSelection]);

    if (
        !preventionSelectionStudies.length &&
        !diagnosisSelectionStudies.length &&
        !treatmentSelectionStudies.length &&
        !invasiveSelectionStudies.length
    ) {
        return <div />;
    }

    return (
        // Remove padding according to theme when all charts are refactored
        <Container padding={theme === "prevention" ? "60px 0px" : "60px 8px"}>
            <IconContainer>
                <IconButton onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
            </IconContainer>

            {theme === "prevention" && <PreventionSelectionChart studies={preventionSelectionStudies} />}
            {theme === "diagnosis" && <DiagnosisSelectionChart studies={diagnosisSelectionStudies} />}
            {theme === "treatment" && <TreatmentSelectionChart studies={treatmentSelectionStudies} />}
            {theme === "invasive" && <InvasiveSelectionChart studies={invasiveSelectionStudies} />}
        </Container>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(SiteSelectionContent);
