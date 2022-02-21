import * as R from "ramda";
import { ActionTypeEnum } from "../actions";
import { createReducer } from "../reducer-utils";
import { createSelector } from "reselect";
import { State, TreatmentMapType, TreatmentState } from "../types";
import { TreatmentStudy } from "../../../domain/entities/TreatmentStudy";

const initialState: TreatmentState = Object.freeze({
    studies: [],
    error: null,
    loading: false,
    filteredStudies: [],
    filters: {
        mapType: TreatmentMapType.TREATMENT_FAILURE,
        plasmodiumSpecies: "P._FALCIPARUM",
        drug: "DRUG_AL",
        molecularMarker: 1,
        excludeLowerPatients: false,
        excludeLowerSamples: false,
    },
});

function updateFilter<T>(key: string, value: T, def?: T) {
    return (state: TreatmentState) => {
        return {
            ...state,
            filters: {
                ...state.filters,
                [key]: value || def,
            },
        };
    };
}

function updateMapType(mapType: TreatmentMapType) {
    return updateFilter("mapType", mapType, TreatmentMapType.TREATMENT_FAILURE);
}

function updatePlasmodiumSpecies(plasmodiumSpecies: string) {
    return updateFilter("plasmodiumSpecies", plasmodiumSpecies, "P._FALCIPARUM");
}

function updateDrug(drug: string) {
    return updateFilter("drug", drug, "DRUG_AL");
}

function updateMolecularMarker(molecularMarker: number) {
    return updateFilter("molecularMarker", molecularMarker, 1);
}

function updateExcludeLowerPatients(value: boolean) {
    return updateFilter("excludeLowerPatients", value, false);
}

function updateExcludeLowerSamples(value: boolean) {
    return updateFilter("excludeLowerSamples", value, false);
}

export default createReducer<TreatmentState>(initialState, {
    [ActionTypeEnum.FetchTreatmentStudiesRequest]: () => (state: TreatmentState) => ({
        ...state,
        loading: true,
    }),
    [ActionTypeEnum.FetchTreatmentStudiesSuccess]: (studies: TreatmentStudy[]) => (state: TreatmentState) => ({
        ...state,
        loading: false,
        studies: studies,
    }),
    [ActionTypeEnum.FetchTreatmentStudiesError]: () => (state: TreatmentState) => ({
        ...state,
        error: "There was a problem loading studies",
        loading: false,
    }),
    [ActionTypeEnum.SetTreatmentMapType]: updateMapType,
    [ActionTypeEnum.SetPlasmodiumSpecies]: updatePlasmodiumSpecies,
    [ActionTypeEnum.SetDrug]: updateDrug,
    [ActionTypeEnum.SetMolecularMarker]: updateMolecularMarker,
    [ActionTypeEnum.SetExcludeLowerPatients]: updateExcludeLowerPatients,
    [ActionTypeEnum.SetExcludeLowerSamples]: updateExcludeLowerSamples,
    [ActionTypeEnum.SetTreatmentFilteredStudies]: (filteredStudies: TreatmentStudy[]) =>
        R.assoc("filteredStudies", filteredStudies),
});

const selectTreatmentState = (state: State) => state.treatment;

export const selectTreatmentStudies = createSelector(selectTreatmentState, state => state.studies);

export const selectTreatmentStudiesLoading = createSelector(selectTreatmentState, state => state.loading);

export const selectTreatmentStudiesError = createSelector(selectTreatmentState, state => state.error);

export const selectFilteredTreatmentStudies = createSelector(selectTreatmentState, state => state.filteredStudies);

export const selectTreatmentFilters = createSelector(selectTreatmentState, state => state.filters);
