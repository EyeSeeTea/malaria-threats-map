import React, { Component } from "react";
import { connect } from "react-redux";
import { State } from "../../store/types";
import IntegrationReactSelect from "../BasicSelect";
import { Translation } from "../../types/Translation";
import { selectInsecticideTypes } from "../../store/reducers/translations-reducer";
import { setInsecticideTypes } from "../../store/actions/prevention-actions";
import { selectPreventionFilters } from "../../store/reducers/prevention-reducer";

const mapStateToProps = (state: State) => ({
  insecticideTypes: selectInsecticideTypes(state),
  preventionFilters: selectPreventionFilters(state)
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
    const suggestions: any[] = (this.props
      .insecticideTypes as Translation[]).map((country: Translation) => ({
      label: country.VALUE_,
      value: country.VALUE_
    }));
    const selection = suggestions.filter(suggestion =>
      this.props.preventionFilters.insecticideTypes.includes(suggestion.value)
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
)(InsecticideTypeFilter);
