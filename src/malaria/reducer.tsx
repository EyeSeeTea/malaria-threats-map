import * as R from "ramda";
import { ActionTypeEnum } from "../store/actions";
import { createReducer } from "../store/reducer-utils";
import { createSelector } from "reselect";
import { State } from "../store/types";

export interface MalariaState {
  title: string;
}

const initialState: MalariaState = Object.freeze({
  title: "Malaria Threats Map"
});

export default createReducer<MalariaState>(initialState, {
  [ActionTypeEnum.MalariaSetTitle]: (title: string) => R.assoc("title", title)
});

export const selectMalariaState = (state: State) => state.malaria;

export const selectTitle = createSelector(selectMalariaState, R.prop("title"));
