import React, { Component } from "react";
import { State, TreatmentMapType } from "../../../store/types";
import { selectCountryMode, selectTheme } from "../../../store/reducers/base-reducer";
import { setPreventionFilteredStudiesAction } from "../../../store/actions/prevention-actions";
import { connect } from "react-redux";
import MolecularMarkersChart from "./MolecularMarkers/MolecularMarkersChart";
import TreatmentFailureChart from "./TreatmentFailure/TreatmentFailureChart";
import TreatmentFailureCountryChart from "./TreatmentFailure/TreatmentFailureCountryChart";
import { selectTreatmentFilters } from "../../../store/reducers/treatment-reducer";
import MolecularMarkersCountryChart from "./MolecularMarkers/MolecularMarkersCountryChart";
import { TreatmentStudy } from "../../../../domain/entities/TreatmentStudy";

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
    treatmentFilters: selectTreatmentFilters(state),
    countryMode: selectCountryMode(state),
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
            countryMode,
            popup,
            treatmentFilters: { mapType },
        } = this.props;

        return (
            <>
                {!countryMode && mapType === TreatmentMapType.MOLECULAR_MARKERS && (
                    <MolecularMarkersChart studies={studies} popup={popup} />
                )}
                {!countryMode &&
                    (mapType === TreatmentMapType.DELAYED_PARASITE_CLEARANCE ||
                        mapType === TreatmentMapType.TREATMENT_FAILURE) && (
                        <TreatmentFailureChart studies={studies} popup={popup} />
                    )}
                {countryMode && mapType === TreatmentMapType.TREATMENT_FAILURE && (
                    <TreatmentFailureCountryChart studies={studies} />
                )}
                {countryMode && mapType === TreatmentMapType.DELAYED_PARASITE_CLEARANCE && (
                    <TreatmentFailureCountryChart studies={studies} />
                )}
                {countryMode && mapType === TreatmentMapType.MOLECULAR_MARKERS && (
                    <MolecularMarkersCountryChart studies={studies} />
                )}
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TreatmentSelectionChart);
