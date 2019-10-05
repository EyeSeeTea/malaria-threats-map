import React, { Component } from "react";
import { connect } from "react-redux";
import { State } from "../../store/types";
import IntegrationReactSelect from "../BasicSelect";
import { selectTypes } from "../../malaria/translations/reducer";
import { Translation } from "../../types/Translation";
import { selectFilters } from "../../malaria/prevention/reducer";
import { setType } from "../../malaria/prevention/actions";

const mapStateToProps = (state: State) => ({
  types: selectTypes(state),
  preventionFilters: selectFilters(state)
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
    const suggestions: any[] = (this.props.types as Translation[])
      .filter(translation =>
        ["WHO_TEST_KIT_ADULTS", "CDC_BOTTLE_ADULTS"].includes(
          translation.VALUE_
        )
      )
      .map((country: Translation) => ({
        label: country.VALUE_,
        value: country.VALUE_
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
