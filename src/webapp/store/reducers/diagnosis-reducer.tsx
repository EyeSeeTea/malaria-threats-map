import * as R from "ramda";
import {ActionTypeEnum} from "../actions";
import {createReducer} from "../reducer-utils";
import {createSelector} from "reselect";
import {DiagnosisMapType, DiagnosisState, State} from "../types";
import {DiagnosisResponse} from "../../types/Diagnosis";
import {DELETION_TYPES} from "../../components/filters/DeletionTypeFilter";
import {DiagnosisStudy} from "../../../domain/entities/DiagnosisStudy";

const initialState: DiagnosisState = Object.freeze({
    studies: [],
    error: null,
    loading: false,
    filteredStudies: [],
    filters: {
        mapType: DiagnosisMapType.GENE_DELETIONS,
        deletionType: DELETION_TYPES.HRP2_PROPORTION_DELETION.value,
        surveyTypes: [],
        patientType: null,
    },
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

function updateSurveyTypes(surveyTypes: string[]) {
    return updateFilter("surveyTypes", surveyTypes, []);
}

function updatePatientType(patientType: string) {
    return updateFilter("patientType", patientType);
}

function updateDeletionType(deletionType: string) {
    return updateFilter(
        "deletionType",
        deletionType,
        DELETION_TYPES.HRP2_PROPORTION_DELETION.value
    );
}

export default createReducer<DiagnosisState>(initialState, {
    [ActionTypeEnum.FetchDiagnosisStudiesRequest]: () => (state) => ({
        ...state,
        loading: true,
    }),
    [ActionTypeEnum.FetchDiagnosisStudiesSuccess]: (response: DiagnosisResponse) => (state) => ({
        ...state,
        loading: false,
        studies: response.features.map((feature) => feature.attributes),
    }),
    [ActionTypeEnum.FetchDiagnosisStudiesError]: () => (state) => ({
        ...state,
        error: "There was a problem loading studies",
        loading: false,
    }),
    [ActionTypeEnum.SetDiagnosisMapType]: updateMapType,
    [ActionTypeEnum.SetSurveyTypes]: updateSurveyTypes,
    [ActionTypeEnum.SetPatientType]: updatePatientType,
    [ActionTypeEnum.SetDeletionType]: updateDeletionType,
    [ActionTypeEnum.SetDiagnosisFilteredStudies]: (filteredStudies: DiagnosisStudy[]) =>
        R.assoc("filteredStudies", filteredStudies),
});

export const selectDiagnosisState = (state: State) => state.diagnosis;

export const selectDiagnosisStudies = createSelector(selectDiagnosisState, R.prop("studies"));

export const selectDiagnosisStudiesLoading = createSelector(
    selectDiagnosisState,
    R.prop("loading")
);

export const selectDiagnosisStudiesError = createSelector(selectDiagnosisState, R.prop("error"));

export const selectFilteredDiagnosisStudies = createSelector(
    selectDiagnosisState,
    R.prop("filteredStudies")
);

export const selectDiagnosisFilters = createSelector(selectDiagnosisState, R.prop("filters"));
