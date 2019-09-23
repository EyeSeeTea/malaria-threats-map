import React, { Component } from "react";
import { connect } from "react-redux";
import { State } from "../store/types";
import IntegrationReactSelect from "./BasicSelect";
import { setRegionAction } from "../malaria/actions";
import { selectRegion } from "../malaria/reducer";
import { selectCountryLayer } from "../store/reducers/country-layer-reducer";
import { selectCountries } from "../malaria/translations/reducer";
import { Translation, TranslationFeature } from "../types/Translation";

const mapStateToProps = (state: State) => ({
  region: selectRegion(state),
  countryLayer: selectCountryLayer(state),
  countries: selectCountries(state)
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
    this.props.setRegion({ country: selection ? selection.value : undefined });
  };
  render() {
    const { region, countries = [] } = this.props;
    const suggestions: any[] = countries.map((country: Translation) => ({
      label: country.VALUE_,
      value: country.VALUE_
    }));
    return (
      <IntegrationReactSelect
        isClearable
        placeholder={"Select Country"}
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
