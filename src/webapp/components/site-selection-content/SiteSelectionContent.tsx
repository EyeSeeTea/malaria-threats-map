import React from "react";
import { connect } from "react-redux";
import { selectTheme } from "../../store/reducers/base-reducer";
import { selectTreatmentSelectionStudies } from "../../store/reducers/treatment-reducer";
import { setSelection } from "../../store/actions/base-actions";
import { State } from "../../store/types";
import TreatmentSelectionChart from "../layers/treatment/TreatmentSelectionChart";
import styled from "styled-components";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SelectionDataContent from "./SelectionDataContent";

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
    treatmentSelectionStudies: selectTreatmentSelectionStudies(state),
});

const mapDispatchToProps = {
    setSelection: setSelection,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

const SiteSelectionContent: React.FC<Props> = ({ theme, treatmentSelectionStudies, setSelection }) => {
    const handleClose = React.useCallback(() => {
        setSelection(null);
    }, [setSelection]);

    //TODO: Review when preventionSelectionStudies,diagnosisSelectionStudies,
    // treatmentSelectionStudies, invasiveSelectionStudies has not been neccesary
    if (theme === "treatment" && !treatmentSelectionStudies.length) {
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

            {theme === "prevention" && <SelectionDataContent />}
            {theme === "diagnosis" && <SelectionDataContent />}
            {theme === "treatment" && <TreatmentSelectionChart studies={treatmentSelectionStudies} />}
            {theme === "invasive" && <SelectionDataContent />}
        </Container>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(SiteSelectionContent);
