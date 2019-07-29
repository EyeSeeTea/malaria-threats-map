import * as R from "ramda";
import { ActionTypeEnum } from "../store/actions";
import { createReducer } from "../store/reducer-utils";
import { createSelector } from "reselect";
import { State } from "../store/types";

export interface MalariaState {
  title: string;
  endemicity: boolean;
}

const initialState: MalariaState = Object.freeze({
  title: "Malaria Threats Map",
  endemicity: false
});

export default createReducer<MalariaState>(initialState, {
  [ActionTypeEnum.MalariaSetTitle]: (title: string) => R.assoc("title", title),
  [ActionTypeEnum.MalariaToogleEndemicityLayer]: (visible: boolean) =>
    R.assoc("endemicity", visible)
});

export const selectMalariaState = (state: State) => state.malaria;

export const selectTitle = createSelector(selectMalariaState, R.prop("title"));
export const selectEndemicity = createSelector(selectMalariaState, R.prop("endemicity"));
