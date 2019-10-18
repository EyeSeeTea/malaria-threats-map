import React, { Component } from "react";
import { connect } from "react-redux";
import { State } from "../../store/types";
import IntegrationReactSelect from "../BasicSelect";
import { Translation } from "../../types/Translation";
import { selectPatientType } from "../../store/reducers/translations-reducer";
import { selectDiagnosisFilters } from "../../store/reducers/diagnosis-reducer";
import { setDiagnosisPatientType } from "../../store/actions/diagnosis-actions";

const mapStateToProps = (state: State) => ({
  patientType: selectPatientType(state),
  diagnosisFilters: selectDiagnosisFilters(state)
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
    const suggestions: any[] = (this.props.patientType as Translation[]).map(
      (country: Translation) => ({
        label: country.VALUE_,
        value: country.VALUE_
      })
    );
    const selection = suggestions.find(
      suggestion => this.props.diagnosisFilters.patientType === suggestion.value
    );
    return (
      <IntegrationReactSelect
        isClearable
        suggestions={suggestions}
        onChange={this.onChange}
        value={selection}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PatientTypeFilter);
