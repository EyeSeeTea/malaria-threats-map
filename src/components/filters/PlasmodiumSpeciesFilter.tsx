import React, { Component } from "react";
import { connect } from "react-redux";
import { State } from "../../store/types";
import IntegrationReactSelect from "../BasicSelect";
import { selectPlasmodiumSpecies } from "../../store/reducers/translations-reducer";
import { selectTreatmentFilters } from "../../store/reducers/treatment-reducer";
import { setTreatmentPlasmodiumSpecies } from "../../store/actions/treatment-actions";
import { Divider, FilterWrapper } from "./Filters";
import FormLabel from "@material-ui/core/FormLabel";
import T from "../../translations/T";

const mapStateToProps = (state: State) => ({
  plasmodiumSpecies: selectPlasmodiumSpecies(state),
  treatmentFilters: selectTreatmentFilters(state)
});

const mapDispatchToProps = {
  setPlasmodiumSpecies: setTreatmentPlasmodiumSpecies
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

const suggestions: any[] = [
  {
    label: "P. falciparum",
    value: "P._FALCIPARUM"
  },
  {
    label: "P. vivax",
    value: "P._VIVAX"
  },
  {
    label: "P. knowlesi",
    value: "P._KNOWLESI"
  },
  {
    label: "P. malariae",
    value: "P._MALARIAE"
  },
  {
    label: "P. ovale",
    value: "P._OVALE"
  }
];

class PlasmodiumSpeciesFilter extends Component<Props, any> {
  onChange = (selection: any) => {
    this.props.setPlasmodiumSpecies(selection ? selection.value : undefined);
  };

  render() {
    const selection = suggestions.find(
      suggestion =>
        this.props.treatmentFilters.plasmodiumSpecies === suggestion.value
    );
    return (
      <FilterWrapper>
        <FormLabel component="legend">
          <T i18nKey={`filters.plasmodium_species`} />
        </FormLabel>
        <Divider />
        <IntegrationReactSelect
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
)(PlasmodiumSpeciesFilter);
