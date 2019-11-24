import React, { Component } from "react";
import { connect } from "react-redux";
import { State } from "../../store/types";
import IntegrationReactSelect from "../BasicSelect";
import { Translation } from "../../types/Translation";
import { selectSpecies } from "../../store/reducers/translations-reducer";
import {
  selectPreventionFilters,
  selectPreventionStudies
} from "../../store/reducers/prevention-reducer";
import { setSpecies } from "../../store/actions/prevention-actions";
import {
  filterByInsecticideClass,
  filterByInsecticideTypes,
  filterByType
} from "../layers/studies-filters";
import * as R from "ramda";

const mapStateToProps = (state: State) => ({
  species: selectSpecies(state),
  studies: selectPreventionStudies(state),
  preventionFilters: selectPreventionFilters(state)
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
    const { preventionFilters, studies } = this.props;
    const { insecticideClass, insecticideTypes, type } = preventionFilters;

    const filters = [
      filterByInsecticideClass(insecticideClass),
      filterByInsecticideTypes(insecticideTypes),
      filterByType(type)
    ];

    const filteredStudies = filters.reduce(
      (studies, filter) => studies.filter(filter),
      studies
    );

    const uniques = R.uniq(R.map(R.prop("SPECIES"), filteredStudies));

    const suggestions: any[] = uniques.map((specie: string) => ({
      label: specie,
      value: specie
    }));
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
