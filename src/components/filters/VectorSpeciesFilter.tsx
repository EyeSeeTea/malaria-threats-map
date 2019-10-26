import React, { Component } from "react";
import { connect } from "react-redux";
import { State } from "../../store/types";
import IntegrationReactSelect from "../BasicSelect";
import { setInvasiveVectorSpecies } from "../../store/actions/invasive-actions";
import { selectInvasiveFilters } from "../../store/reducers/invasive-reducer";

const mapStateToProps = (state: State) => ({
  invasiveFilters: selectInvasiveFilters(state)
});

const mapDispatchToProps = {
  setVectorSpecies: setInvasiveVectorSpecies
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

const suggestions = [
  {
    label: "An. stephensi type form",
    value: "AN_STEPHENSI_TYPE_FORM"
  },
  {
    label: "An. stephensi mysorensis",
    value: "AN_STEPHENSI_MYSORENSIS"
  },
  {
    label: "An. stephensi type form",
    value: "AN_STEPHENSI_INTERMEDIATE_FORM"
  }
];

export const VectorSpeciesKey: { [key: string]: string } = {
  AN_STEPHENSI_TYPE_FORM: "An. stephensi type form",
  AN_STEPHENSI_MYSORENSIS: "An. stephensi mysorensis",
  AN_STEPHENSI_INTERMEDIATE_FORM: "An. stephensi intermediate form"
};

class VectorSpeciesFilter extends Component<Props, any> {
  onChange = (selection: any[]) => {
    this.props.setVectorSpecies(
      (selection || []).map(selection => selection.value)
    );
  };

  render() {
    const selection = suggestions.filter(suggestion =>
      this.props.invasiveFilters.vectorSpecies.includes(suggestion.value)
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
)(VectorSpeciesFilter);
