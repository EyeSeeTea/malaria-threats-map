import { createReducer } from "../reducer-utils";
import { ActionTypeEnum } from "../actions";
import * as R from "ramda";
import { CountryLayerState, State } from "../types";
import { createSelector } from "reselect";

const initialState: CountryLayerState = Object.freeze({
  layer: null,
  loading: false
});

export default createReducer<CountryLayerState>(initialState, {
  [ActionTypeEnum.FetchCountryLayerRequest]: () => R.assoc("loading", true),
  [ActionTypeEnum.FetchCountryLayerSuccess]: (response: any) =>
    R.mergeLeft({ layer: response, loading: false }),
  [ActionTypeEnum.FetchCountryLayerError]: () => R.assoc("loading", false)
});

export const selectCountryLayerState = (state: State) => state.countryLayer;

export const selectCountryLayer = createSelector(
  selectCountryLayerState,
  R.prop("layer")
);

export const selectCountryLayerIsLoading = createSelector(
  selectCountryLayerState,
  R.prop("loading")
);
