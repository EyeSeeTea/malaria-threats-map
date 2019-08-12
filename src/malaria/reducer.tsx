import * as R from "ramda";
import { ActionTypeEnum } from "../store/actions";
import { createReducer } from "../store/reducer-utils";
import { createSelector } from "reselect";
import { State } from "../store/types";

export interface MalariaState {
  title: string;
  theme: string;
  endemicity: boolean;
}

const initialState: MalariaState = Object.freeze({
  title: "Malaria Threats Map",
  theme: "prevention",
  endemicity: false
});

export default createReducer<MalariaState>(initialState, {
  [ActionTypeEnum.MalariaSetTheme]: (theme: string) => R.assoc("theme", theme),
  [ActionTypeEnum.MalariaToogleEndemicityLayer]: (visible: boolean) =>
    R.assoc("endemicity", visible)
});

export const selectMalariaState = (state: State) => state.malaria;

export const selectTitle = createSelector(
  selectMalariaState,
  R.prop("title")
);
export const selectTheme = createSelector(
  selectMalariaState,
  R.prop("theme")
);
export const selectEndemicity = createSelector(
  selectMalariaState,
  R.prop("endemicity")
);
