import React, { Component } from "react";
import { connect } from "react-redux";
import { State } from "../../store/types";
import IntegrationReactSelect from "../BasicSelect";
import { Translation } from "../../types/Translation";
import { selectTypes } from "../../store/reducers/translations-reducer";
import {
  selectPreventionFilters,
  selectPreventionStudies
} from "../../store/reducers/prevention-reducer";
import { setType } from "../../store/actions/prevention-actions";
import * as R from "ramda";
import {
  filterByInsecticideClass,
  filterByInsecticideTypes
} from "../layers/studies-filters";

const mapStateToProps = (state: State) => ({
  types: selectTypes(state),
  studies: selectPreventionStudies(state),
  preventionFilters: selectPreventionFilters(state)
});

const mapDispatchToProps = {
  setType: setType
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

class TypeFilter extends Component<Props, any> {
  onChange = (selection: any) => {
    this.props.setType(selection ? selection.value : undefined);
  };

  render() {
    const { preventionFilters, studies } = this.props;
    const { insecticideClass, insecticideTypes } = preventionFilters;

    const filters = [
      filterByInsecticideClass(insecticideClass),
      filterByInsecticideTypes(insecticideTypes)
    ];

    const filteredStudies = filters.reduce(
      (studies, filter) => studies.filter(filter),
      studies
    );

    const uniques = R.uniq(R.map(R.prop("TYPE"), filteredStudies));

    const suggestions: any[] = uniques.map((type: string) => ({
      label: type,
      value: type
    }));
    const selection = suggestions.find(
      suggestion => this.props.preventionFilters.type === suggestion.value
    );
    return (
      <IntegrationReactSelect
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
)(TypeFilter);
