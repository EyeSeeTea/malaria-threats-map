import * as R from "ramda";
import { ActionTypeEnum } from "../../store/actions";
import { createReducer } from "../../store/reducer-utils";
import { createSelector } from "reselect";
import { State } from "../../store/types";
import { InvasiveResponse, InvasiveStudy } from "../../types/Invasive";

export interface InvasiveState {
  studies: InvasiveStudy[];
}

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
