import React, { Component } from "react";
import { State } from "../../../store/types";
import { selectSelection, selectTheme } from "../../../store/reducers/base-reducer";
import { setSelection } from "../../../store/actions/base-actions";
import { connect } from "react-redux";
import { DiagnosisStudy } from "../../../../domain/entities/DiagnosisStudy";
import SelectionDataContent from "../../site-selection-content/SelectionDataContent";

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
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
        const { theme, studies, selection } = this.props;
        if (!selection) {
            return <div />;
        }

        const filteredStudies = studies.filter(study => study.SITE_ID === selection.SITE_ID);

        if (!filteredStudies.length || theme !== "diagnosis") {
            return <div />;
        }
        return (
            <>
                <SelectionDataContent />
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DiagnosisSelectionChart);
