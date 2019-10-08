import * as R from "ramda";
import { ActionTypeEnum } from "../actions";
import { createReducer } from "../reducer-utils";
import { createSelector } from "reselect";
import { DiagnosisState, State } from "../types";
import { DiagnosisResponse } from "../../types/Diagnosis";

const initialState: DiagnosisState = Object.freeze({
  studies: []
});

export default createReducer<DiagnosisState>(initialState, {
  [ActionTypeEnum.FetchDiagnosisStudiesSuccess]: (
    response: DiagnosisResponse
  ) => R.assoc("studies", response.features.map(feature => feature.attributes))
});

export const selectDiagnosisState = (state: State) => state.diagnosis;

export const selectDiagnosisStudies = createSelector(
  selectDiagnosisState,
  R.prop("studies")
);
