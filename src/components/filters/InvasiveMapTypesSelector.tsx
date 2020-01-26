import React, {Component} from "react";
import {connect} from "react-redux";
import {InvasiveMapType, State} from "../../store/types";
import IntegrationReactSelect, {OptionType} from "../BasicSelect";
import {ValueType} from "react-select/src/types";
import {selectInvasiveFilters} from "../../store/reducers/invasive-reducer";
import {setInvasiveMapType} from "../../store/actions/invasive-actions";

const mapStateToProps = (state: State) => ({
  invasiveFilters: selectInvasiveFilters(state)
});

const mapDispatchToProps = {
  setInvasiveMapType: setInvasiveMapType
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

const invasiveSuggestions: OptionType[] = [
  {
    label: "invasive.vector_occurrance",
    value: InvasiveMapType.VECTOR_OCCURANCE
  }
];

export class InvasiveMapTypesSelector extends Component<Props> {
  onChange = (value: ValueType<OptionType>) => {
    const selection = value as OptionType;
    this.props.setInvasiveMapType(selection.value);
  };
  render() {
    return (
      <IntegrationReactSelect
        suggestions={invasiveSuggestions}
        onChange={this.onChange}
        value={invasiveSuggestions.find(
          s => s.value === this.props.invasiveFilters.mapType
        )}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InvasiveMapTypesSelector);
