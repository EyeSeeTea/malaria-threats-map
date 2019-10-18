import React, { Component } from "react";
import { connect } from "react-redux";
import { State } from "../../store/types";
import IntegrationReactSelect from "../BasicSelect";
import { Translation } from "../../types/Translation";
import { selectSurveyTypes } from "../../store/reducers/translations-reducer";
import { selectDiagnosisFilters } from "../../store/reducers/diagnosis-reducer";
import { setDiagnosisSurveyTypes } from "../../store/actions/diagnosis-actions";

const mapStateToProps = (state: State) => ({
  surveyTypes: selectSurveyTypes(state),
  diagnosisFilters: selectDiagnosisFilters(state)
});

const mapDispatchToProps = {
  setSurveyTypes: setDiagnosisSurveyTypes
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

class SurveyTypeFilter extends Component<Props, any> {
  onChange = (selection: any[]) => {
    this.props.setSurveyTypes(
      (selection || []).map(selection => selection.value)
    );
  };

  render() {
    const suggestions: any[] = (this.props.surveyTypes as Translation[]).map(
      (country: Translation) => ({
        label: country.VALUE_,
        value: country.VALUE_
      })
    );
    const selection = suggestions.filter(suggestion =>
      this.props.diagnosisFilters.surveyTypes.includes(suggestion.value)
    );
    return (
      <IntegrationReactSelect
        isMulti
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
)(SurveyTypeFilter);
