import React, { Component } from "react";
import { connect } from "react-redux";
import { State } from "../../store/types";
import IntegrationReactSelect from "../BasicSelect";
import { Translation } from "../../types/Translation";
import { selectPlasmodiumSpecies } from "../../store/reducers/translations-reducer";
import { selectTreatmentFilters } from "../../store/reducers/treatment-reducer";
import { setTreatmentPlasmodiumSpecies } from "../../store/actions/treatment-actions";

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

class PlasmodiumSpeciesFilter extends Component<Props, any> {
  onChange = (selection: any) => {
    this.props.setPlasmodiumSpecies(selection ? selection.value : undefined);
  };

  render() {
    const suggestions: any[] = (this.props
      .plasmodiumSpecies as Translation[]).map((option: Translation) => ({
      label: option.VALUE_.replace(".", "%2E"),
      value: option.VALUE_
    }));
    const selection = suggestions.find(
      suggestion =>
        this.props.treatmentFilters.plasmodiumSpecies === suggestion.value
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
)(PlasmodiumSpeciesFilter);
