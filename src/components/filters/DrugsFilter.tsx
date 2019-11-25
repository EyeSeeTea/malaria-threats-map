import React, { Component } from "react";
import { connect } from "react-redux";
import { State } from "../../store/types";
import IntegrationReactSelect from "../BasicSelect";
import { Translation } from "../../types/Translation";
import { selectDrugs } from "../../store/reducers/translations-reducer";
import {
  selectFilteredTreatmentStudies,
  selectTreatmentFilters
} from "../../store/reducers/treatment-reducer";
import { setTreatmentDrug } from "../../store/actions/treatment-actions";
import {
  filterByDimensionId,
  filterByPlasmodiumSpecies,
  filterByRegion,
  filterByYearRange
} from "../layers/studies-filters";
import { selectFilters, selectRegion } from "../../store/reducers/base-reducer";
import * as R from "ramda";
import { TreatmentStudy } from "../../types/Treatment";

const mapStateToProps = (state: State) => ({
  drugs: selectDrugs(state),
  studies: selectFilteredTreatmentStudies(state),
  yearFilter: selectFilters(state),
  treatmentFilters: selectTreatmentFilters(state),
  region: selectRegion(state)
});

const mapDispatchToProps = {
  setDrug: setTreatmentDrug
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

class DrugsFilter extends Component<Props, any> {
  onChange = (selection: any) => {
    this.props.setDrug(selection ? selection.value : undefined);
  };

  render() {
    const { treatmentFilters, studies, yearFilter, region } = this.props;

    const filters = [
      filterByDimensionId(256),
      filterByPlasmodiumSpecies(treatmentFilters.plasmodiumSpecies),
      filterByYearRange(yearFilter),
      filterByRegion(region)
    ];

    const filteredStudies: TreatmentStudy[] = filters.reduce(
      (studies, filter) => studies.filter(filter),
      studies
    );

    const uniques = R.uniq(R.map(R.prop("DRUG_NAME"), filteredStudies));

    const suggestions: any[] = uniques.map((drug: string) => ({
      label: drug,
      value: drug
    }));

    const selection = suggestions.find(
      suggestion => this.props.treatmentFilters.drug === suggestion.value
    );
    return (
      <IntegrationReactSelect
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
)(DrugsFilter);
