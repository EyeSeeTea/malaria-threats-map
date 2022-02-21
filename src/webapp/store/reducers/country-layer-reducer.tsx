import { createReducer } from "../reducer-utils";
import { ActionTypeEnum } from "../actions";
import * as R from "ramda";
import { CountryLayerState, State } from "../types";
import { createSelector } from "reselect";
import { CountryLayer } from "../../../domain/entities/CountryLayer";

const initialState: CountryLayerState = Object.freeze({
    layer: null,
    loading: false,
    countries: [],
});

export default createReducer<CountryLayerState>(initialState, {
    [ActionTypeEnum.FetchCountryLayerRequest]: () => R.assoc("loading", true),
    [ActionTypeEnum.FetchCountryLayerSuccess]: (countryLayer: CountryLayer) =>
        R.mergeLeft({
            layer: countryLayer,
            loading: false,
            countries: countryLayer.features.map(feature => feature.properties),
        }),
    [ActionTypeEnum.FetchCountryLayerError]: () => R.assoc("loading", false),
});

const selectCountryLayerState = (state: State) => state.countryLayer;

export const selectCountryLayer = createSelector(selectCountryLayerState, state => state.layer);

export const selectCountries = createSelector(selectCountryLayerState, state => state.countries);

export const selectCountryLayerIsLoading = createSelector(selectCountryLayerState, state => state.loading);
