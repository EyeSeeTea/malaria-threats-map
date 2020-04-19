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
  includeGlobalOption?: boolean;
  menuIsOpen?: boolean;
  label?: string;
  className?: string;
  value: string[];
  onChange: (value: string[]) => void;
};

type StateProps = ReturnType<typeof mapStateToProps>;
type Props = OwnProps & StateProps;

function CountriesSelector({
  onChange,
  value,
  countries = [],
  includeGlobalOption,
  menuIsOpen,
  label,
  className
}: Props) {
  const { t } = useTranslation("common");
  const global = value.includes("GLOBAL");
  const onOptionChange = (selection: OptionType[] | OptionType | undefined) => {
    if (!global) {
      const selected = (selection || []) as OptionType[];
      onChange(selected.map(s => s.value));
    } else {
      if (selection) {
        onChange(["GLOBAL"]);
      } else {
        onChange([]);
      }
    }
  };
  const suggestions: any[] = countries.map((country: Translation) => ({
    label: t(country.VALUE_),
    value: country.VALUE_
  }));

  const globalOption = {
    label: "Project applies globally",
    value: "GLOBAL"
  };

  const suggs = includeGlobalOption
    ? [...suggestions, globalOption]
    : suggestions;

  return (
    <FilterWrapper className={className}>
      <FormLabel component="legend">
        {label || <T i18nKey={"filters.countries"} />}
      </FormLabel>
      <Divider />
      <IntegrationReactSelect
        isClearable
        isMulti={!value.includes("GLOBAL")}
        suggestions={suggs}
        onChange={onOptionChange}
        value={
          global ? globalOption : suggs.filter(s => value.includes(s.value))
        }
        menuIsOpen={menuIsOpen}
      />
    </FilterWrapper>
  );
}

export default connect(mapStateToProps, null)(CountriesSelector);
