import * as R from "ramda";
import { ActionTypeEnum } from "../../store/actions";
import { createReducer } from "../../store/reducer-utils";
import { createSelector } from "reselect";
import { State } from "../../store/types";
import { TreatmentResponse, TreatmentStudy } from "../../types/Treatment";

export interface TreatmentState {
  studies: TreatmentStudy[];
}

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
