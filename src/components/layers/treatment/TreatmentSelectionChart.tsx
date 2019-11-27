import React, { Component } from "react";
import { State, TreatmentMapType } from "../../../store/types";
import {
  selectCountryMode,
  selectSelection
} from "../../../store/reducers/base-reducer";
import { setPreventionFilteredStudiesAction } from "../../../store/actions/prevention-actions";
import { setSelection } from "../../../store/actions/base-actions";
import { connect } from "react-redux";
import MolecularMarkersChart from "./MolecularMarkers/MolecularMarkersChart";
import TreatmentFailureChart from "./TreatmentFailure/TreatmentFailureChart";
import TreatmentFailureCountryChart from "./TreatmentFailure/TreatmentFailureCountryChart";
import { TreatmentStudy } from "../../../types/Treatment";
import { selectTreatmentFilters } from "../../../store/reducers/treatment-reducer";

const mapStateToProps = (state: State) => ({
  treatmentFilters: selectTreatmentFilters(state),
  countryMode: selectCountryMode(state),
  selection: selectSelection(state)
});

const mapDispatchToProps = {
  setFilteredStudies: setPreventionFilteredStudiesAction,
  setSelection: setSelection
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

type OwnProps = {
  studies: TreatmentStudy[];
};
type Props = StateProps & DispatchProps & OwnProps;

class PreventionSelectionChart extends Component<Props> {
  render() {
    const {
      studies,
      countryMode,
      selection,
      treatmentFilters: { mapType }
    } = this.props;
    const filteredStudies = studies.filter(study =>
      countryMode
        ? study.ISO2 === selection.ISO_2_CODE
        : study.SITE_ID === selection.SITE_ID
    );
    if (!filteredStudies.length) {
      return <div />;
    }
    return (
      <>
        {!countryMode && mapType === TreatmentMapType.MOLECULAR_MARKERS && (
          <MolecularMarkersChart studies={filteredStudies} />
        )}
        {!countryMode &&
          mapType === TreatmentMapType.DELAYED_PARASITE_CLEARANCE && (
            <TreatmentFailureChart studies={filteredStudies} />
          )}
        {!countryMode && mapType === TreatmentMapType.TREATMENT_FAILURE && (
          <TreatmentFailureChart studies={filteredStudies} />
        )}
        {countryMode && mapType === TreatmentMapType.TREATMENT_FAILURE && (
          <TreatmentFailureCountryChart studies={filteredStudies} />
        )}
      </>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PreventionSelectionChart);
