import React, { Component } from "react";
import { connect } from "react-redux";
import { State } from "../../store/types";
import IntegrationReactSelect from "../BasicSelect";
import { selectInsecticideTypes } from "../../store/reducers/translations-reducer";
import { setInsecticideTypes } from "../../store/actions/prevention-actions";
import {
  selectFilteredPreventionStudies,
  selectPreventionFilters,
  selectPreventionStudies
} from "../../store/reducers/prevention-reducer";
import * as R from "ramda";
import FormLabel from "@material-ui/core/FormLabel";
import { Divider, FilterWrapper } from "./Filters";
import T from "../../translations/T";
import {filterByInsecticideClass} from "../layers/studies-filters";

const mapStateToProps = (state: State) => ({
  insecticideTypes: selectInsecticideTypes(state),
  preventionFilters: selectPreventionFilters(state),
  studies: selectPreventionStudies(state),
  filteredStudies: selectFilteredPreventionStudies(state)
});

const mapDispatchToProps = {
  setInsecticideTypes: setInsecticideTypes
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

class InsecticideTypeFilter extends Component<Props, any> {
  onChange = (selection: any[]) => {
    this.props.setInsecticideTypes(
      (selection || []).map(selection => selection.value)
    );
  };

  render() {
    const { preventionFilters, studies } = this.props;
    const { insecticideClass } = preventionFilters;

    const filters = [filterByInsecticideClass(insecticideClass)];

    const filteredStudies = filters.reduce(
      (studies, filter) => studies.filter(filter),
      studies
    );

    const uniques = R.uniq(R.map(R.prop("INSECTICIDE_TYPE"), filteredStudies));

    const suggestions: any[] = uniques.map((type: string) => ({
      label: type,
      value: type
    }));

    const selection = suggestions.filter(suggestion =>
      this.props.preventionFilters.insecticideTypes.includes(suggestion.value)
    );

    return (
      <FilterWrapper>
        <FormLabel component="legend">
          <T i18nKey={"filters.insecticide_type"} />
        </FormLabel>
        <Divider />
        <IntegrationReactSelect
          isMulti
          isClearable
          suggestions={suggestions}
          onChange={this.onChange}
          value={selection}
        />
      </FilterWrapper>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InsecticideTypeFilter);
