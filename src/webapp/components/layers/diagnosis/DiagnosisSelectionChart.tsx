import React, { Component } from "react";
import { DiagnosisMapType, State } from "../../../store/types";
import { selectSelection, selectTheme } from "../../../store/reducers/base-reducer";
import { setSelection } from "../../../store/actions/base-actions";
import { connect } from "react-redux";
import GeneDeletionChart from "./GeneDeletions/GeneDeletionChart";
import { selectDiagnosisFilters } from "../../../store/reducers/diagnosis-reducer";
import { DiagnosisStudy } from "../../../../domain/entities/DiagnosisStudy";

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
    diagnosisFilters: selectDiagnosisFilters(state),
    selection: selectSelection(state),
});

const mapDispatchToProps = {
    setSelection: setSelection,
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
            selection,
            diagnosisFilters: { mapType },
        } = this.props;
        if (!selection) {
            return <div />;
        }
        const filteredStudies = studies.filter(study => study.SITE_ID === selection.SITE_ID);

        if (!filteredStudies.length || theme !== "diagnosis") {
            return <div />;
        }
        return <>{mapType === DiagnosisMapType.GENE_DELETIONS && <GeneDeletionChart studies={filteredStudies} />}</>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DiagnosisSelectionChart);
