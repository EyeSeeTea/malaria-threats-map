import React from "react";
import { connect } from "react-redux";
import { selectCountryLayer } from "../../../store/reducers/country-layer-reducer";
import { State } from "../../../store/types";
import { Translation } from "../../../types/Translation";
import IntegrationReactSelect, { OptionType } from "../../BasicSelect";
import { selectCountries } from "../../../store/reducers/translations-reducer";
import FormLabel from "@material-ui/core/FormLabel";
import T from "../../../translations/T";
import { Divider, FilterWrapper } from "../../filters/Filters";
import { useTranslation } from "react-i18next";

const mapStateToProps = (state: State) => ({
  countryLayer: selectCountryLayer(state),
  countries: selectCountries(state)
});

type OwnProps = {
  value: string[];
  onChange: (value: string[]) => void;
};

type StateProps = ReturnType<typeof mapStateToProps>;
type Props = OwnProps & StateProps;

function CountriesSelector({ onChange, value, countries = [] }: Props) {
  const { t } = useTranslation("common");
  const onOptionChange = (selection: OptionType[]) => {
    onChange((selection || []).map(s => s.value));
  };
  const suggestions: any[] = countries.map((country: Translation) => ({
    label: t(country.VALUE_),
    value: country.VALUE_
  }));

  return (
    <FilterWrapper>
      <FormLabel component="legend">
        <T i18nKey={"filters.countries"} />
      </FormLabel>
      <Divider />
      <IntegrationReactSelect
        isClearable
        isMulti
        suggestions={suggestions}
        onChange={onOptionChange}
        value={suggestions.filter(s => value.includes(s.value))}
      />
    </FilterWrapper>
  );
}

export default connect(mapStateToProps, null)(CountriesSelector);
