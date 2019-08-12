import * as R from "ramda";
import { ActionTypeEnum } from "../../store/actions";
import { createReducer } from "../../store/reducer-utils";
import { createSelector } from "reselect";
import { State } from "../../store/types";
import { DiagnosisResponse, DiagnosisStudy } from "../../types/Diagnosis";

export interface DiagnosisState {
  studies: DiagnosisStudy[];
}

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
