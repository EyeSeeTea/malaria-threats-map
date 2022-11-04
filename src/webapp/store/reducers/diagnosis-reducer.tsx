import * as R from "ramda";
import { ActionTypeEnum } from "../actions";
import { createReducer } from "../reducer-utils";
import { createSelector } from "reselect";
import { DiagnosisDataset, DiagnosisMapType, DiagnosisState, State } from "../types";
import { DiagnosisStudy } from "../../../domain/entities/DiagnosisStudy";

const initialState: DiagnosisState = Object.freeze({
    studies: [],
    error: null,
    loading: false,
    filteredStudies: [],
    filters: {
        mapType: DiagnosisMapType.GENE_DELETIONS,
        dataset: "PFHRP23_GENE_DELETIONS",
        deletionType: undefined,
        surveyTypes: [],
        patientType: null,
    },
    selectionStudies: [],
});

function updateFilter<T>(key: string, value: T, def?: T) {
    return (state: DiagnosisState) => {
        return {
            ...state,
            filters: {
                ...state.filters,
                [key]: value || def,
            },
        };
    };
}

function updateMapType(mapType: DiagnosisMapType) {
    return updateFilter("mapType", mapType, DiagnosisMapType.GENE_DELETIONS);
}

function updateDataset(dataset: DiagnosisDataset) {
    return updateFilter("dataset", dataset, "DIAGNOSIS");
}

function updateSurveyTypes(surveyTypes: string[]) {
    return updateFilter("surveyTypes", surveyTypes, []);
}

function updatePatientType(patientType: string) {
    return updateFilter("patientType", patientType);
}

function updateDeletionType(deletionType: string) {
    return updateFilter("deletionType", deletionType);
}

export default createReducer<DiagnosisState>(initialState, {
    [ActionTypeEnum.FetchDiagnosisStudiesRequest]: () => (state: DiagnosisState) => ({
        ...state,
        loading: true,
    }),
    [ActionTypeEnum.FetchDiagnosisStudiesSuccess]: (studies: DiagnosisStudy[]) => (state: DiagnosisState) => ({
        ...state,
        loading: false,
        studies,
    }),
    [ActionTypeEnum.FetchDiagnosisStudiesError]: () => (state: DiagnosisState) => ({
        ...state,
        error: "There was a problem loading studies",
        loading: false,
    }),
    [ActionTypeEnum.SetDiagnosisMapType]: updateMapType,
    [ActionTypeEnum.SetDiagnosisDataset]: updateDataset,
    [ActionTypeEnum.SetSurveyTypes]: updateSurveyTypes,
    [ActionTypeEnum.SetPatientType]: updatePatientType,
    [ActionTypeEnum.SetDeletionType]: updateDeletionType,
    [ActionTypeEnum.SetDiagnosisFilteredStudies]: (filteredStudies: DiagnosisStudy[]) =>
        R.assoc("filteredStudies", filteredStudies),
    [ActionTypeEnum.SetDiagnosisSelectionStudies]: (studies: DiagnosisStudy[]) => (state: DiagnosisState) => ({
        ...state,
        selectionStudies: studies,
    }),
});

const selectDiagnosisState = (state: State) => state.diagnosis;

export const selectDiagnosisStudies = createSelector(selectDiagnosisState, diagnosisState => diagnosisState.studies);

export const selectDiagnosisStudiesLoading = createSelector(
    selectDiagnosisState,
    diagnosisState => diagnosisState.loading
);

export const selectDiagnosisStudiesError = createSelector(selectDiagnosisState, diagnosisState => diagnosisState.error);

export const selectFilteredDiagnosisStudies = createSelector(
    selectDiagnosisState,
    diagnosisState => diagnosisState.filteredStudies
);

export const selectDiagnosisFilters = createSelector(selectDiagnosisState, diagnosisState => diagnosisState.filters);

export const selectDiagnosisSelectionStudies = createSelector(selectDiagnosisState, state => state.selectionStudies);
