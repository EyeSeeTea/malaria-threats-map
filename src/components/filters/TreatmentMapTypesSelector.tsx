import React, { Component } from "react";
import { connect } from "react-redux";
import { State, TreatmentMapType } from "../../store/types";
import IntegrationReactSelect, { OptionType } from "../BasicSelect";
import { ValueType } from "react-select/src/types";
import { selectTreatmentFilters } from "../../store/reducers/treatment-reducer";
import { setTreatmentMapType } from "../../store/actions/treatment-actions";

const mapStateToProps = (state: State) => ({
  treatmentFilters: selectTreatmentFilters(state)
});

const mapDispatchToProps = {
  setTreatmentMapType: setTreatmentMapType
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

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

export class TreatmentMapTypesSelector extends Component<Props> {
  onChange = (value: ValueType<OptionType>) => {
    const selection = value as OptionType;
    this.props.setTreatmentMapType(selection.value);
  };

  render() {
    return (
      <IntegrationReactSelect
        suggestions={treatmentSuggestions}
        onChange={this.onChange}
        value={treatmentSuggestions.find(
          s => s.value === this.props.treatmentFilters.mapType
        )}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TreatmentMapTypesSelector);
