import React, { Component } from "react";
import { connect } from "react-redux";
import { State } from "../../store/types";
import IntegrationReactSelect from "../BasicSelect";
import { selectSpecies } from "../../malaria/translations/reducer";
import { Translation } from "../../types/Translation";
import { selectFilters } from "../../malaria/prevention/reducer";
import { setSpecies } from "../../malaria/prevention/actions";

const mapStateToProps = (state: State) => ({
  species: selectSpecies(state),
  preventionFilters: selectFilters(state)
});

const mapDispatchToProps = {
  setSpecies: setSpecies
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

class SpeciesFilter extends Component<Props, any> {
  onChange = (selection: any[]) => {
    this.props.setSpecies((selection || []).map(selection => selection.value));
  };

  render() {
    const suggestions: any[] = (this.props.species as Translation[]).map(
      (country: Translation) => ({
        label: country.VALUE_,
        value: country.VALUE_
      })
    );
    const selection = suggestions.filter(suggestion =>
      this.props.preventionFilters.species.includes(suggestion.value)
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
)(SpeciesFilter);
