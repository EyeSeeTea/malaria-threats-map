import React, { Component } from "react";
import { DiagnosisMapType, State } from "../../../store/types";
import { selectCountryMode, selectViewData, selectTheme } from "../../../store/reducers/base-reducer";
import { setPreventionFilteredStudiesAction } from "../../../store/actions/prevention-actions";
import { connect } from "react-redux";
import GeneDeletionChart from "./GeneDeletions/GeneDeletionChart";
import GeneDeletionCountryChart from "./GeneDeletions/GeneDeletionCountryChart";
import { selectDiagnosisFilters } from "../../../store/reducers/diagnosis-reducer";
import { DiagnosisStudy } from "../../../../domain/entities/DiagnosisStudy";
import styled from "styled-components";

const InfoContainer = styled.div`
    padding: 20px;
`;

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
    diagnosisFilters: selectDiagnosisFilters(state),
    countryMode: selectCountryMode(state),
    viewData: selectViewData(state)
});

const mapDispatchToProps = {
    setFilteredStudies: setPreventionFilteredStudiesAction,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

type OwnProps = {
    studies: DiagnosisStudy[];
};
type Props = StateProps & DispatchProps & OwnProps;

class DiagnosisSelectionChart extends Component<Props> {
    render() {
        const {
            theme,
            studies,
            countryMode,
            viewData,
            diagnosisFilters: { mapType },
        } = this.props;
        if (!viewData) {
            return <div />;
        }
        const filteredStudies = studies.filter(study =>
            countryMode ? study.ISO2 === viewData.ISO_2_CODE : study.SITE_ID === viewData.SITE_ID
        );
        if (!filteredStudies.length || theme !== "diagnosis") {
            return <div />;
        }
        return (
            <InfoContainer>
                {!countryMode && mapType === DiagnosisMapType.GENE_DELETIONS && (
                    <GeneDeletionChart studies={filteredStudies} />
                )}
                {countryMode && mapType === DiagnosisMapType.GENE_DELETIONS && (
                    <GeneDeletionCountryChart studies={filteredStudies} />
                )}
            </InfoContainer>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DiagnosisSelectionChart);
