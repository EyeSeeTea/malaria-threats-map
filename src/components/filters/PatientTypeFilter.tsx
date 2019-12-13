import React, { Component } from "react";
import { connect } from "react-redux";
import { State } from "../../store/types";
import IntegrationReactSelect from "../BasicSelect";
import { selectPatientType } from "../../store/reducers/translations-reducer";
import {
  selectDiagnosisFilters, selectDiagnosisStudies,
  selectFilteredDiagnosisStudies
} from "../../store/reducers/diagnosis-reducer";
import { setDiagnosisPatientType } from "../../store/actions/diagnosis-actions";
import {
  filterByDeletionType,
  filterByRegion,
  filterBySurveyTypes,
  filterByYearRange
} from "../layers/studies-filters";
import * as R from "ramda";
import { selectFilters, selectRegion } from "../../store/reducers/base-reducer";
import { DiagnosisStudy } from "../../types/Diagnosis";
import { Divider, FilterWrapper } from "./Filters";
import FormLabel from "@material-ui/core/FormLabel";
import T from "../../translations/T";

const mapStateToProps = (state: State) => ({
  patientType: selectPatientType(state),
  studies: selectDiagnosisStudies(state),
  yearFilter: selectFilters(state),
  diagnosisFilters: selectDiagnosisFilters(state),
  region: selectRegion(state)
});

const mapDispatchToProps = {
  setPatientType: setDiagnosisPatientType
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

class PatientTypeFilter extends Component<Props, any> {
  onChange = (selection: any) => {
    this.props.setPatientType(selection ? selection.value : null);
  };

  render() {
    const { diagnosisFilters, studies, yearFilter, region } = this.props;

    const filters = [
      filterByDeletionType(diagnosisFilters.deletionType),
      filterBySurveyTypes(diagnosisFilters.surveyTypes),
      filterByYearRange(yearFilter),
      filterByRegion(region)
    ];

    const filteredStudies: DiagnosisStudy[] = filters.reduce(
      (studies, filter) => studies.filter(filter),
      studies
    );

    const uniques = R.uniq(R.map(R.prop("PATIENT_TYPE"), filteredStudies));

    const suggestions: any[] = uniques.map((patientType: string) => ({
      label: patientType,
      value: patientType
    }));
    const selection = suggestions.find(
      suggestion => this.props.diagnosisFilters.patientType === suggestion.value
    );
    return (
      <FilterWrapper>
        <FormLabel component="legend">
          <T i18nKey={`filters.patient_type`} />
        </FormLabel>
        <Divider />
        <IntegrationReactSelect
          isClearable
          suggestions={suggestions}
          onChange={this.onChange}
          value={selection}
        />
      </FilterWrapper>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PatientTypeFilter);
