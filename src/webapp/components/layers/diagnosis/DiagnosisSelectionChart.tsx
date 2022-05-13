import React, { Component } from "react";
import { DiagnosisMapType, State } from "../../../store/types";
import { selectSelection, selectTheme } from "../../../store/reducers/base-reducer";
import { setPreventionFilteredStudiesAction } from "../../../store/actions/prevention-actions";
import { setSelection } from "../../../store/actions/base-actions";
import { connect } from "react-redux";
import GeneDeletionChart from "./GeneDeletions/GeneDeletionChart";
import { selectDiagnosisFilters } from "../../../store/reducers/diagnosis-reducer";
import { DiagnosisStudy } from "../../../../domain/entities/DiagnosisStudy";

const mapStateToProps = (state: State) => ({
    diagnosisFilters: selectDiagnosisFilters(state),
    selection: selectSelection(state),
});

type StateProps = ReturnType<typeof mapStateToProps>;

type OwnProps = {
    studies: DiagnosisStudy[];
    popup?: boolean;
};
type Props = StateProps & OwnProps;

class DiagnosisSelectionChart extends Component<Props> {
    render() {
        const {
            studies,
            popup,
            selection,
            diagnosisFilters: { mapType },
        } = this.props;
        //const filteredStudies = studies.filter(study => study.SITE_ID === selection.SITE_ID);
        return (
            <>{<GeneDeletionChart studies={studies} popup={popup} />}</>
        );
    }
}

export default connect(mapStateToProps)(DiagnosisSelectionChart);
