import * as R from "ramda";
import { ActionTypeEnum } from "../../store/actions";
import { createReducer } from "../../store/reducer-utils";
import { createSelector } from "reselect";
import { State } from "../../store/types";
import { PreventionResponse, PreventionStudy } from "../../types/Prevention";

export interface PreventionState {
  studies: PreventionStudy[];
}

const initialState: PreventionState = Object.freeze({
  studies: []
});

export default createReducer<PreventionState>(initialState, {
  [ActionTypeEnum.FetchPreventionStudiesSuccess]: (
    response: PreventionResponse
  ) => R.assoc("studies", response.features.map(feature => feature.attributes))
});

export const selectPreventionState = (state: State) => state.prevention;

export const selectPreventionStudies = createSelector(
  selectPreventionState,
  R.prop("studies")
);
