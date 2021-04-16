import * as R from "ramda";
import { ActionTypeEnum } from "../actions";
import { createReducer } from "../reducer-utils";
import { createSelector } from "reselect";
import { PreventionMapType, PreventionState, State } from "../types";
import { PreventionResponse, PreventionStudy } from "../../types/Prevention";

export const initialState: PreventionState = Object.freeze({
    studies: [],
    error: null,
    loading: false,
    filteredStudies: [],
    filters: {
        mapType: PreventionMapType.RESISTANCE_STATUS,
        insecticideClass: "PYRETHROIDS",
        insecticideTypes: [],
        synergistTypes: [],
        assayTypes: [],
        type: null,
        species: [],
    },
});

function updateFilter<T>(key: string, value: T, def?: T) {
    return (state: PreventionState) => {
        return {
            ...state,
            filters: {
                ...state.filters,
                [key]: value || def,
            },
        };
    };
}

function updatePreventionMapType(mapType: PreventionMapType) {
    return updateFilter("mapType", mapType, PreventionMapType.RESISTANCE_STATUS);
}

function updateInsecticideClass(insecticideClass: string) {
    return updateFilter("insecticideClass", insecticideClass, "PYRETHROIDS");
}

function updateInsecticideTypes(insecticideTypes: string[]) {
    return updateFilter("insecticideTypes", insecticideTypes, []);
}

function updateType(type: string) {
    return updateFilter("type", type);
}
function updateSynergistTypes(synergistTypes: string[]) {
    return updateFilter("synergistTypes", synergistTypes, []);
}

function updateSpecies(species: string[]) {
    return updateFilter("species", species, []);
}

function updateAssayTypes(assayTypes: string[]) {
    return updateFilter("assayTypes", assayTypes, []);
}

export default createReducer<PreventionState>(initialState, {
    [ActionTypeEnum.FetchPreventionStudiesRequest]: () => state => ({
        ...state,
        loading: true,
    }),
    [ActionTypeEnum.FetchPreventionStudiesSuccess]: (response: PreventionResponse) => state => ({
        ...state,
        loading: false,
        studies: response.features.map(feature => feature.attributes),
    }),
    [ActionTypeEnum.FetchPreventionStudiesError]: () => state => ({
        ...state,
        error: "There was a problem loading studies",
        loading: false,
    }),
    [ActionTypeEnum.SetPreventionMapType]: updatePreventionMapType,
    [ActionTypeEnum.SetInsecticideClass]: updateInsecticideClass,
    [ActionTypeEnum.SetInsecticideTypes]: updateInsecticideTypes,
    [ActionTypeEnum.SetAssayTypes]: updateAssayTypes,
    [ActionTypeEnum.SetSynergistTypes]: updateSynergistTypes,
    [ActionTypeEnum.SetType]: updateType,
    [ActionTypeEnum.SetSpecies]: updateSpecies,
    [ActionTypeEnum.SetPreventionFilteredStudies]: (filteredStudies: PreventionStudy[]) =>
        R.assoc("filteredStudies", filteredStudies),
});

export const selectPreventionState = (state: State) => state.prevention;

export const selectPreventionStudies = createSelector(selectPreventionState, R.prop("studies"));

export const selectPreventionStudiesLoading = createSelector(selectPreventionState, R.prop("loading"));

export const selectPreventionStudiesError = createSelector(selectPreventionState, R.prop("error"));

export const selectFilteredPreventionStudies = createSelector(selectPreventionState, R.prop("filteredStudies"));

export const selectPreventionFilters = createSelector(selectPreventionState, R.prop("filters"));
