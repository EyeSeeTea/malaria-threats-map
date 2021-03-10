import React from "react";
import { connect } from "react-redux";
import { setRegionAction } from "../../store/actions/base-actions";
import {
  selectCountryLayer,
  selectMekongCountries,
} from "../../store/reducers/country-layer-reducer";
import { selectRegion } from "../../store/reducers/base-reducer";
import { State } from "../../store/types";
import { Translation } from "../../types/Translation";
import IntegrationReactSelect, { Option } from "../BasicSelect";
import { selectCountries } from "../../store/reducers/translations-reducer";
import FormLabel from "@material-ui/core/FormLabel";
import { Divider, FilterWrapper } from "./Filters";
import T from "../../translations/T";
import config from "../../config";
import { useTranslation } from "react-i18next";
import { sendAnalytics } from "../../utils/analytics";

const mapStateToProps = (state: State) => ({
  region: selectRegion(state),
  countryLayer: selectCountryLayer(state),
  countries: selectCountries(state),
  mekongCountries: selectMekongCountries(state),
});

const mapDispatchToProps = {
  setRegion: setRegionAction,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

const CountrySelector = ({
  region,
  countries = [],
  mekongCountries,
  setRegion,
}: Props) => {
  const { t } = useTranslation("common");
  const onChange = (selection: Option | undefined) => {
    const label = selection ? selection.value : undefined;
    if (label)
      sendAnalytics({ type: "event", category: "geoFilter", action: "Country", label });
    setRegion({ country: selection ? selection.value : undefined });
  };
  const suggestions: any[] = config.mekong
    ? mekongCountries.map((country) => ({
        label: t(country.ISO_2_CODE),
        value: country.ISO_2_CODE,
      }))
    : countries.map((country: Translation) => ({
        label: t(country.VALUE_ === "NA" ? "COUNTRY_NA" : country.VALUE_),
        value: country.VALUE_,
      }));
  return (
    <FilterWrapper>
      <FormLabel component="legend">
        <T i18nKey={"filters.country"} />
      </FormLabel>
      <Divider />
      <IntegrationReactSelect
        isClearable
        placeholder={"Select Country"}
        suggestions={suggestions.sort((s1, s2) =>
          s1.label > s2.label ? 1 : -1
        )}
        onChange={onChange}
        value={suggestions.find((s: any) => s.value === region.country) || null}
      />
    </FilterWrapper>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(CountrySelector);
