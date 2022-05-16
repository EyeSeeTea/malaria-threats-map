import React, { Component } from "react";
import { State, TreatmentMapType } from "../../../store/types";
import { selectSelection, selectTheme } from "../../../store/reducers/base-reducer";
import { setPreventionFilteredStudiesAction } from "../../../store/actions/prevention-actions";
import { connect } from "react-redux";
import MolecularMarkersChart from "./MolecularMarkers/MolecularMarkersChart";
import TreatmentFailureChart from "./TreatmentFailure/TreatmentFailureChart";
import { selectTreatmentFilters } from "../../../store/reducers/treatment-reducer";
import { TreatmentStudy } from "../../../../domain/entities/TreatmentStudy";

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
    treatmentFilters: selectTreatmentFilters(state),
    selection: selectSelection(state),
});

const mapDispatchToProps = {
    setFilteredStudies: setPreventionFilteredStudiesAction,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

type OwnProps = {
    studies: TreatmentStudy[];
    popup?: boolean;
};
type Props = StateProps & DispatchProps & OwnProps;

class TreatmentSelectionChart extends Component<Props> {
    render() {
        const {
            studies,
            popup,
            treatmentFilters: { mapType },
        } = this.props;

        return (
            <>
                {mapType === TreatmentMapType.MOLECULAR_MARKERS && (
                    <MolecularMarkersChart studies={studies} popup={popup} />
                )}

                {(mapType === TreatmentMapType.DELAYED_PARASITE_CLEARANCE ||
                    mapType === TreatmentMapType.TREATMENT_FAILURE) && (
                    <TreatmentFailureChart studies={studies} popup={popup} />
                )}
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TreatmentSelectionChart);
