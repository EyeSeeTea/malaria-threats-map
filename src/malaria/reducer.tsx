import * as R from "ramda";
import { ActionTypeEnum } from "../store/actions";
import { createReducer } from "../store/reducer-utils";
import { createSelector } from "reselect";
import { State } from "../store/types";

export interface MalariaState {
  title: string;
  theme: string;
  endemicity: boolean;
  filters: string[];
}

const initialState: MalariaState = Object.freeze({
  title: "Malaria Threats Map",
  theme: "prevention",
  endemicity: false,
  filters: ["one", "two"]
});

export default createReducer<MalariaState>(initialState, {
  [ActionTypeEnum.MalariaSetTitle]: (theme: string) => R.assoc("title", theme),
  [ActionTypeEnum.MalariaSetTheme]: (theme: string) => R.assoc("theme", theme),
  [ActionTypeEnum.MalariaSetFilters]: (filters: string[]) =>
    R.assoc("filters", filters),
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
export const selectFilters = createSelector(
  selectMalariaState,
  R.prop("filters")
);
