import React, { Component } from "react";
import { connect } from "react-redux";
import { State } from "../../store/types";
import IntegrationReactSelect from "../BasicSelect";
import { Translation } from "../../types/Translation";
import { selectDrugs } from "../../store/reducers/translations-reducer";
import { selectTreatmentFilters } from "../../store/reducers/treatment-reducer";
import { setTreatmentDrug } from "../../store/actions/treatment-actions";

const mapStateToProps = (state: State) => ({
  drugs: selectDrugs(state),
  treatmentFilters: selectTreatmentFilters(state)
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
    const suggestions: any[] = (this.props.drugs as Translation[]).map(
      (country: Translation) => ({
        label: country.VALUE_,
        value: country.VALUE_
      })
    );
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
