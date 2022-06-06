import React, { Component } from "react";
import { State, TreatmentMapType } from "../../../store/types";
import { selectSelection, selectTheme } from "../../../store/reducers/base-reducer";
import { setSelection } from "../../../store/actions/base-actions";
import { connect } from "react-redux";
import MolecularMarkersChart from "./MolecularMarkers/MolecularMarkersChart";
import TreatmentFailureChart from "../../site-selection-content/treatment/TreatmentFailureChart";
import { selectTreatmentFilters } from "../../../store/reducers/treatment-reducer";
import { TreatmentStudy } from "../../../../domain/entities/TreatmentStudy";

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
    treatmentFilters: selectTreatmentFilters(state),
    selection: selectSelection(state),
});

const mapDispatchToProps = {
    setSelection: setSelection,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

type OwnProps = {
    studies: TreatmentStudy[];
};
type Props = StateProps & DispatchProps & OwnProps;

class TreatmentSelectionChart extends Component<Props> {
    render() {
        const {
            theme,
            studies,
            selection,
            treatmentFilters: { mapType },
        } = this.props;
        if (!selection) {
            return <div />;
        }
        const filteredStudies = studies.filter(study => study.SITE_ID === selection.SITE_ID);
        if (!filteredStudies.length || theme !== "treatment") {
            return <div />;
        }
        return (
            <>
                {mapType === TreatmentMapType.MOLECULAR_MARKERS && <MolecularMarkersChart studies={filteredStudies} />}
                {mapType === TreatmentMapType.DELAYED_PARASITE_CLEARANCE && (
                    <TreatmentFailureChart studies={filteredStudies} />
                )}
                {mapType === TreatmentMapType.TREATMENT_FAILURE && <TreatmentFailureChart studies={filteredStudies} />}
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TreatmentSelectionChart);
