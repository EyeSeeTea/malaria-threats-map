import React, { Component } from "react";
import { DiagnosisMapType, State } from "../../../store/types";
import { selectCountryMode } from "../../../store/reducers/base-reducer";
import { setPreventionFilteredStudiesAction } from "../../../store/actions/prevention-actions";
import { connect } from "react-redux";
import GeneDeletionChart from "./GeneDeletions/GeneDeletionChart";
import GeneDeletionCountryChart from "./GeneDeletions/GeneDeletionCountryChart";
import { selectDiagnosisFilters } from "../../../store/reducers/diagnosis-reducer";
import { DiagnosisStudy } from "../../../../domain/entities/DiagnosisStudy";

const mapStateToProps = (state: State) => ({
    diagnosisFilters: selectDiagnosisFilters(state),
    countryMode: selectCountryMode(state),
});

const mapDispatchToProps = {
    setFilteredStudies: setPreventionFilteredStudiesAction,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

type OwnProps = {
    studies: DiagnosisStudy[];
    popup: boolean;
};
type Props = StateProps & DispatchProps & OwnProps;

class DiagnosisSelectionChart extends Component<Props> {
    render() {
        const {
            studies,
            countryMode,
            popup,
            diagnosisFilters: { mapType },
        } = this.props;

        return (
            <>
                {!countryMode && mapType === DiagnosisMapType.GENE_DELETIONS && (
                    <GeneDeletionChart studies={studies} popup={popup} />
                )}
                {countryMode && mapType === DiagnosisMapType.GENE_DELETIONS && (
                    <GeneDeletionCountryChart studies={studies} />
                )}
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DiagnosisSelectionChart);
