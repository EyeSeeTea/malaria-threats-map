import React, { Component } from "react";
import { connect } from "react-redux";
import { DiagnosisMapType, State } from "../../store/types";
import IntegrationReactSelect, { OptionType } from "../BasicSelect";
import { ValueType } from "react-select/src/types";
import { setDiagnosisMapType } from "../../store/actions/diagnosis-actions";
import { selectDiagnosisFilters } from "../../store/reducers/diagnosis-reducer";

const mapStateToProps = (state: State) => ({
  diagnosisFilters: selectDiagnosisFilters(state)
});

const mapDispatchToProps = {
  setDiagnosisMapType: setDiagnosisMapType
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

const diagnosisSuggestions: OptionType[] = [
  { label: "diagnosis.gene_deletions", value: DiagnosisMapType.GENE_DELETIONS }
];

export class DiagnosisMapTypesSelector extends Component<Props> {
  onChange = (value: ValueType<OptionType>) => {
    const selection = value as OptionType;
    this.props.setDiagnosisMapType(selection.value);
  };

  render() {
    return (
      <IntegrationReactSelect
        suggestions={diagnosisSuggestions}
        onChange={this.onChange}
        value={diagnosisSuggestions.find(
          s => s.value === this.props.diagnosisFilters.mapType
        )}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DiagnosisMapTypesSelector);
