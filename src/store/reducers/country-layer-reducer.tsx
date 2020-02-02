import { createReducer } from "../reducer-utils";
import { ActionTypeEnum } from "../actions";
import * as R from "ramda";
import { CountryLayerState, State } from "../types";
import { createSelector } from "reselect";

const initialState: CountryLayerState = Object.freeze({
  layer: null,
  loading: false,
  countries: []
});

export default createReducer<CountryLayerState>(initialState, {
  [ActionTypeEnum.FetchCountryLayerRequest]: () => R.assoc("loading", true),
  [ActionTypeEnum.FetchCountryLayerSuccess]: (response: any) =>
    R.mergeLeft({
      layer: response,
      loading: false,
      countries: response.features.map((feature: any) => feature.properties)
    }),
  [ActionTypeEnum.FetchCountryLayerError]: () => R.assoc("loading", false)
});

export const selectCountryLayerState = (state: State) => state.countryLayer;

export const selectCountryLayer = createSelector(
  selectCountryLayerState,
  R.prop("layer")
);

export const selectCountries = createSelector(
  selectCountryLayerState,
  R.prop("countries")
);

export const selectMekongCountries = createSelector(
  selectCountries,
  R.filter(country => {
    return (
      country.SUBREGION === "GREATER MEKONG" ||
      country.SUBREGION === "GREATER_MEKONG"
    );
  })
);

export const selectCountryLayerIsLoading = createSelector(
  selectCountryLayerState,
  R.prop("loading")
);
