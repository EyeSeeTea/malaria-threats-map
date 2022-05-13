import React, { Component } from "react";
import { State } from "../../../store/types";
import { selectSelection} from "../../../store/reducers/base-reducer";
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
        } = this.props;
        return (
            <>{<GeneDeletionChart studies={studies} popup={popup} />}</>
        );
    }
}

export default connect(mapStateToProps)(DiagnosisSelectionChart);
