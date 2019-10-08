import * as R from "ramda";
import { ActionTypeEnum } from "../actions";
import { createReducer } from "../reducer-utils";
import { createSelector } from "reselect";
import { State, TreatmentState } from "../types";
import { TreatmentResponse } from "../../types/Treatment";

const initialState: TreatmentState = Object.freeze({
  studies: []
});

export default createReducer<TreatmentState>(initialState, {
  [ActionTypeEnum.FetchTreatmentStudiesSuccess]: (
    response: TreatmentResponse
  ) => R.assoc("studies", response.features.map(feature => feature.attributes))
});

export const selectTreatmentState = (state: State) => state.treatment;

export const selectTreatmentStudies = createSelector(
  selectTreatmentState,
  R.prop("studies")
);
