import React, { Component } from "react";
import { connect } from "react-redux";
import { setRegionAction } from "../../store/actions/base-actions";
import { selectCountryLayer } from "../../store/reducers/country-layer-reducer";
import { selectRegion } from "../../store/reducers/base-reducer";
import { State } from "../../store/types";
import { Translation } from "../../types/Translation";
import IntegrationReactSelect from "../BasicSelect";
import { selectCountries } from "../../store/reducers/translations-reducer";

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
        value={suggestions.find((s: any) => s.value === region.country) || null}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CountrySelector);
