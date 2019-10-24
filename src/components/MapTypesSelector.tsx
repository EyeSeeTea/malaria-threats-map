import React, { Component } from "react";
import { connect } from "react-redux";
import { DiagnosisMapType, PreventionMapType, State } from "../store/types";
import IntegrationReactSelect, { OptionType } from "./BasicSelect";
import { ValueType } from "react-select/src/types";
import { setPreventionMapType } from "../store/actions/prevention-actions";
import { selectPreventionFilters } from "../store/reducers/prevention-reducer";
import { selectTheme } from "../store/reducers/base-reducer";
import { setDiagnosisMapType } from "../store/actions/diagnosis-actions";
import { selectDiagnosisFilters } from "../store/reducers/diagnosis-reducer";

const mapStateToProps = (state: State) => ({
  theme: selectTheme(state),
  preventionFilters: selectPreventionFilters(state),
  diagnosisFilters: selectDiagnosisFilters(state)
});

const mapDispatchToProps = {
  setPreventionMapType: setPreventionMapType,
  setDiagnosisMapType: setDiagnosisMapType
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

const preventionSuggestions: OptionType[] = [
  { label: "Resistance Status", value: PreventionMapType.RESISTANCE_STATUS },
  { label: "Intensity Status", value: PreventionMapType.INTENSITY_STATUS },
  {
    label: "Resistance Mechanism",
    value: PreventionMapType.RESISTANCE_MECHANISM
  },
  {
    label: "Level of Involvement",
    value: PreventionMapType.LEVEL_OF_INVOLVEMENT
  },
  {
    label: "PBO Deployment",
    value: PreventionMapType.PBO_DEPLOYMENT
  }
];

const diagnosisSuggestions: OptionType[] = [
  { label: "Gene Deletions", value: DiagnosisMapType.GENE_DELETIONS }
];

class MapTypesSelector extends Component<Props> {
  onChange = (value: ValueType<OptionType>) => {
    const selection = value as OptionType;
    switch (this.props.theme) {
      case "prevention":
        this.props.setPreventionMapType(selection.value);
        break;
      case "diagnosis":
        this.props.setDiagnosisMapType(selection.value);
        break;
      default:
        break;
    }
  };

  getSuggestions = () => {
    switch (this.props.theme) {
      case "prevention":
        return preventionSuggestions.filter(
          s => s.value !== this.props.preventionFilters.mapType
        );
      case "diagnosis":
        return diagnosisSuggestions.filter(
          s => s.value !== this.props.diagnosisFilters.mapType
        );
      default:
        break;
    }
  };

  getSelection = () => {
    switch (this.props.theme) {
      case "prevention":
        return preventionSuggestions.find(
          s => s.value === this.props.preventionFilters.mapType
        );
      case "diagnosis":
        return diagnosisSuggestions.find(
          s => s.value === this.props.diagnosisFilters.mapType
        );
      default:
        break;
    }
  };

  render() {
    return (
      <IntegrationReactSelect
        suggestions={this.getSuggestions()}
        onChange={this.onChange}
        value={this.getSelection()}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapTypesSelector);
