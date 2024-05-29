import { createReducer } from "../reducer-utils";
import { ActionTypeEnum } from "../actions";
import * as R from "ramda";
import { DistrictsState, State } from "../types";
import { createSelector } from "reselect";

const initialState: DistrictsState = Object.freeze({
    layer: null,
    loading: false,
    districts: [],
});

export default createReducer<DistrictsState>(initialState, {
    [ActionTypeEnum.FetchDistrictsRequest]: () => R.assoc("loading", true),
    [ActionTypeEnum.FetchDistrictsSuccess]: (response: any) =>
        R.mergeLeft({
            layer: response,
            loading: false,
            districts: response.features.map((feature: any) => feature.properties),
        }),
    [ActionTypeEnum.FetchDistrictsError]: () => R.assoc("loading", false),
});

const selectDistrictsState = (state: State) => state.district;

export const selectDistrictsLayer = createSelector(selectDistrictsState, districtState => districtState.layer);

export const selectDistricts = createSelector(selectDistrictsState, districtState => districtState.districts);

export const selectDistrictsAreLoading = createSelector(selectDistrictsState, districtState => districtState.loading);
