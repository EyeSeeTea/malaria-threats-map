import React, { Component } from "react";
import { DiagnosisMapType, State } from "../../../store/types";
import {
  selectCountryMode,
  selectSelection,
  selectTheme
} from "../../../store/reducers/base-reducer";
import { setPreventionFilteredStudiesAction } from "../../../store/actions/prevention-actions";
import { setSelection } from "../../../store/actions/base-actions";
import { connect } from "react-redux";
import GeneDeletionChart from "./GeneDeletions/GeneDeletionChart";
import GeneDeletionCountryChart from "./GeneDeletions/GeneDeletionCountryChart";
import { DiagnosisStudy } from "../../../types/Diagnosis";
import { selectDiagnosisFilters } from "../../../store/reducers/diagnosis-reducer";

const mapStateToProps = (state: State) => ({
  theme: selectTheme(state),
  diagnosisFilters: selectDiagnosisFilters(state),
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
  studies: DiagnosisStudy[];
};
type Props = StateProps & DispatchProps & OwnProps;

class DiagnosisSelectionChart extends Component<Props> {
  render() {
    const {
      theme,
      studies,
      countryMode,
      selection,
      diagnosisFilters: { mapType }
    } = this.props;
    if (!selection) {
      return <div />;
    }
    const filteredStudies = studies.filter(study =>
      countryMode
        ? study.ISO2 === selection.ISO_2_CODE
        : study.SITE_ID === selection.SITE_ID
    );
    if (!filteredStudies.length || theme !== "diagnosis") {
      return <div />;
    }
    return (
      <>
        {!countryMode && mapType === DiagnosisMapType.GENE_DELETIONS && (
          <GeneDeletionChart studies={filteredStudies} />
        )}
        {countryMode && mapType === DiagnosisMapType.GENE_DELETIONS && (
          <GeneDeletionCountryChart studies={filteredStudies} />
        )}
      </>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DiagnosisSelectionChart);
