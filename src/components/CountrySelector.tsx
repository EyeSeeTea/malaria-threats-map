import React, { Component } from "react";
import { connect } from "react-redux";
import { State } from "../store/types";
import IntegrationReactSelect from "./BasicSelect";
import { setRegionAction } from "../malaria/actions";
import { selectRegion } from "../malaria/reducer";

const mapStateToProps = (state: State) => ({
  region: selectRegion(state)
});

const mapDispatchToProps = {
  setRegion: setRegionAction
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

const suggestions: any[] = [
  { label: "France", value: "FRANCE" },
  { label: "Spain", value: "SPAIN" }
];

class CountrySelector extends Component<Props> {
  onChange = (selection: any) => {
    this.props.setRegion({ country: selection.value });
  };
  render() {
    const { region } = this.props;
    return (
      <IntegrationReactSelect
        suggestions={suggestions}
        onChange={this.onChange}
        value={suggestions.find((s: any) => s.value === region.country)}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CountrySelector);
