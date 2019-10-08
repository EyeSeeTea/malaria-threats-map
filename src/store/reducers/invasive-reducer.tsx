import * as R from "ramda";
import { ActionTypeEnum } from "../actions";
import { createReducer } from "../reducer-utils";
import { createSelector } from "reselect";
import { InvasiveState, State } from "../types";
import { InvasiveResponse } from "../../types/Invasive";

const initialState: InvasiveState = Object.freeze({
  studies: []
});

export default createReducer<InvasiveState>(initialState, {
  [ActionTypeEnum.FetchInvasiveStudiesSuccess]: (response: InvasiveResponse) =>
    R.assoc("studies", response.features.map(feature => feature.attributes))
});

export const selectInvasiveState = (state: State) => state.invasive;

export const selectInvasiveStudies = createSelector(
  selectInvasiveState,
  R.prop("studies")
);
