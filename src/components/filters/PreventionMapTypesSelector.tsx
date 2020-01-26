import React, { Component } from "react";
import { connect } from "react-redux";
import { PreventionMapType, State } from "../../store/types";
import IntegrationReactSelect, { OptionType } from "../BasicSelect";
import { ValueType } from "react-select/src/types";
import { setPreventionMapType } from "../../store/actions/prevention-actions";
import { selectPreventionFilters } from "../../store/reducers/prevention-reducer";

const mapStateToProps = (state: State) => ({
  preventionFilters: selectPreventionFilters(state)
});

const mapDispatchToProps = {
  setPreventionMapType: setPreventionMapType
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

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
export class PreventionMapTypesSelector extends Component<Props> {
  onChange = (value: ValueType<OptionType>) => {
    const selection = value as OptionType;
    this.props.setPreventionMapType(selection.value);
  };

  getSuggestions = () => {
    return preventionSuggestions;
  };

  render() {
    return (
      <IntegrationReactSelect
        suggestions={preventionSuggestions}
        onChange={this.onChange}
        value={preventionSuggestions.find(
          s => s.value === this.props.preventionFilters.mapType
        )}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PreventionMapTypesSelector);
