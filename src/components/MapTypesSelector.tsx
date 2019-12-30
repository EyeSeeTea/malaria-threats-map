import React, { Component } from "react";
import { connect } from "react-redux";
import {
  DiagnosisMapType,
  InvasiveMapType,
  PreventionMapType,
  State,
  TreatmentMapType
} from "../store/types";
import IntegrationReactSelect, { OptionType } from "./BasicSelect";
import { ValueType } from "react-select/src/types";
import { setPreventionMapType } from "../store/actions/prevention-actions";
import { selectPreventionFilters } from "../store/reducers/prevention-reducer";
import { selectTheme } from "../store/reducers/base-reducer";
import { setDiagnosisMapType } from "../store/actions/diagnosis-actions";
import { selectDiagnosisFilters } from "../store/reducers/diagnosis-reducer";
import { selectTreatmentFilters } from "../store/reducers/treatment-reducer";
import { setTreatmentMapType } from "../store/actions/treatment-actions";
import { selectInvasiveFilters } from "../store/reducers/invasive-reducer";
import { setInvasiveMapType } from "../store/actions/invasive-actions";
import styled from "styled-components";

const mapStateToProps = (state: State) => ({
  theme: selectTheme(state),
  preventionFilters: selectPreventionFilters(state),
  diagnosisFilters: selectDiagnosisFilters(state),
  treatmentFilters: selectTreatmentFilters(state),
  invasiveFilters: selectInvasiveFilters(state)
});

const mapDispatchToProps = {
  setPreventionMapType: setPreventionMapType,
  setDiagnosisMapType: setDiagnosisMapType,
  setTreatmentMapType: setTreatmentMapType,
  setInvasiveMapType: setInvasiveMapType
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

const Wrapper = styled.div`
  min-width: 275px;
`;

const preventionSuggestions: OptionType[] = [
  {
    label: "prevention.resistance_status",
    value: PreventionMapType.RESISTANCE_STATUS
  },
  {
    label: "prevention.resistance_intensity",
    value: PreventionMapType.INTENSITY_STATUS
  },
  {
    label: "prevention.resistance_mechanism",
    value: PreventionMapType.RESISTANCE_MECHANISM
  },
  {
    label: "prevention.synergist_involvement",
    value: PreventionMapType.LEVEL_OF_INVOLVEMENT
  },
  {
    label: "prevention.pbo_deployment",
    value: PreventionMapType.PBO_DEPLOYMENT
  }
];

const diagnosisSuggestions: OptionType[] = [
  { label: "diagnosis.gene_deletions", value: DiagnosisMapType.GENE_DELETIONS }
];

const treatmentSuggestions: OptionType[] = [
  {
    label: "treatment.treatment_failure",
    value: TreatmentMapType.TREATMENT_FAILURE
  },
  {
    label: "treatment.delayed_parasite_clearance",
    value: TreatmentMapType.DELAYED_PARASITE_CLEARANCE
  },
  {
    label: "treatment.molecular_markers",
    value: TreatmentMapType.MOLECULAR_MARKERS
  }
];

const invasiveSuggestions: OptionType[] = [
  {
    label: "invasive.vector_occurrance",
    value: InvasiveMapType.VECTOR_OCCURANCE
  }
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
      case "treatment":
        this.props.setTreatmentMapType(selection.value);
        break;
      case "invasive":
        this.props.setInvasiveMapType(selection.value);
        break;
      default:
        break;
    }
  };

  getSuggestions = () => {
    switch (this.props.theme) {
      case "prevention":
        return preventionSuggestions;
      case "diagnosis":
        return diagnosisSuggestions;
      case "treatment":
        return treatmentSuggestions;
      case "invasive":
        return invasiveSuggestions;
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
      case "treatment":
        return treatmentSuggestions.find(
          s => s.value === this.props.treatmentFilters.mapType
        );
      case "invasive":
        return invasiveSuggestions.find(
          s => s.value === this.props.invasiveFilters.mapType
        );
      default:
        break;
    }
  };

  render() {
    return (
      <Wrapper>
        <IntegrationReactSelect
          suggestions={this.getSuggestions()}
          onChange={this.onChange}
          value={this.getSelection()}
        />
      </Wrapper>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapTypesSelector);
