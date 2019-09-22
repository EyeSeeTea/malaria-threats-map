import React, { Component } from "react";
import { connect } from "react-redux";
import { State } from "../store/types";
import {
  PreventionMapType,
  selectFilters
} from "../malaria/prevention/reducer";
import { setPreventionMapType } from "../malaria/prevention/actions";
import IntegrationReactSelect, { OptionType } from "./BasicSelect";
import { ValueType } from "react-select/src/types";

const mapStateToProps = (state: State) => ({
  filters: selectFilters(state)
});

const mapDispatchToProps = {
  setPreventionMapType: setPreventionMapType
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

const suggestions: OptionType[] = [
  { label: "Resistance Status", value: PreventionMapType.RESISTANCE_STATUS },
  { label: "Intensity Status", value: PreventionMapType.INTENSITY_STATUS },
  {
    label: "Resistance Mechanism",
    value: PreventionMapType.RESISTANCE_MECHANISM
  },
  {
    label: "Level of Involvement",
    value: PreventionMapType.LEVEL_OF_INVOLVEMENT
  }
];

class PreventionMapTypesSelector extends Component<Props> {
  onChange = (value: ValueType<OptionType>) => {
    const selection = value as OptionType;
    this.props.setPreventionMapType(selection.value);
  };
  render() {
    return (
      <IntegrationReactSelect
        suggestions={suggestions}
        onChange={this.onChange}
        value={suggestions.find(s => s.value === this.props.filters.mapType)}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PreventionMapTypesSelector);
