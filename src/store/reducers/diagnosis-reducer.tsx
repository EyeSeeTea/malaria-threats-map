import * as R from "ramda";
import { ActionTypeEnum } from "../actions";
import { createReducer } from "../reducer-utils";
import { createSelector } from "reselect";
import { DiagnosisMapType, DiagnosisState, State } from "../types";
import { DiagnosisResponse } from "../../types/Diagnosis";

const initialState: DiagnosisState = Object.freeze({
  studies: [],
  filters: {
    mapType: DiagnosisMapType.PFHRP2,
    surveyTypes: [],
    patientType: null
  }
});

function updateFilter<T>(key: string, value: T, def?: T) {
  return (state: DiagnosisState) => {
    return {
      ...state,
      filters: {
        ...state.filters,
        [key]: value || def
      }
    };
  };
}

function updateSurveyTypes(surveyTypes: string[]) {
  return updateFilter("surveyTypes", surveyTypes, []);
}

function updatePatientType(patientType: string) {
  return updateFilter("patientType", patientType);
}

export default createReducer<DiagnosisState>(initialState, {
  [ActionTypeEnum.FetchDiagnosisStudiesSuccess]: (
    response: DiagnosisResponse
  ) => R.assoc("studies", response.features.map(feature => feature.attributes)),
  [ActionTypeEnum.SetSurveyTypes]: updateSurveyTypes,
  [ActionTypeEnum.SetPatientType]: updatePatientType
});

export const selectDiagnosisState = (state: State) => state.diagnosis;

export const selectDiagnosisStudies = createSelector(
  selectDiagnosisState,
  R.prop("studies")
);

export const selectDiagnosisFilters = createSelector(
  selectDiagnosisState,
  R.prop("filters")
);
