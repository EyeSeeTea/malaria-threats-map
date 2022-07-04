import * as R from "ramda";
import { ActionTypeEnum } from "../actions";
import { createReducer } from "../reducer-utils";
import { createSelector } from "reselect";
import { PreventionMapType, PreventionSelectionData, PreventionState, State } from "../types";
import { PreventionStudy } from "../../../domain/entities/PreventionStudy";

const initialState: PreventionState = Object.freeze({
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
    selectionStudies: [],
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
    [ActionTypeEnum.FetchPreventionStudiesRequest]: () => (state: PreventionState) => ({
        ...state,
        loading: true,
    }),
    [ActionTypeEnum.FetchPreventionStudiesSuccess]: (studies: PreventionStudy[]) => (state: PreventionState) => ({
        ...state,
        loading: false,
        studies,
    }),
    [ActionTypeEnum.FetchPreventionStudiesError]: () => (state: PreventionState) => ({
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
    [ActionTypeEnum.SetPreventionSelectionStudies]: (studies: PreventionStudy[]) => (state: PreventionState) => ({
        ...state,
        selectionStudies: studies,
    }),
    [ActionTypeEnum.SetPreventionSelectionData]:
        (selectionData: PreventionSelectionData) => (state: PreventionState) => ({
            ...state,
            selectionData,
        }),
});

const selectPreventionState = (state: State) => state.prevention;

export const selectPreventionStudies = createSelector(selectPreventionState, state => state.studies);

export const selectPreventionStudiesLoading = createSelector(selectPreventionState, state => state.loading);

export const selectPreventionStudiesError = createSelector(selectPreventionState, state => state.error);

export const selectFilteredPreventionStudies = createSelector(selectPreventionState, state => state.filteredStudies);

export const selectPreventionFilters = createSelector(selectPreventionState, state => state.filters);

export const selectPreventionSelectionStudies = createSelector(selectPreventionState, state => state.selectionStudies);

export const selectPreventionSelectionData = createSelector(selectPreventionState, state => state.selectionData);
