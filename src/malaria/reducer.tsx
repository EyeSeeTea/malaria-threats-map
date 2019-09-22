import * as R from "ramda";
import { ActionTypeEnum } from "../store/actions";
import { createReducer } from "../store/reducer-utils";
import { createSelector } from "reselect";
import { State } from "../store/types";

export interface RegionState {
  country: string;
}

export interface MalariaState {
  title: string;
  theme: string;
  endemicity: boolean;
  filters: number[];
  region: RegionState;
}

const initialState: MalariaState = Object.freeze({
  title: "Malaria Threats Map",
  theme: "prevention",
  endemicity: false,
  filters: [2010, 2018],
  region: {
    country: ""
  }
});

export default createReducer<MalariaState>(initialState, {
  [ActionTypeEnum.MalariaSetTitle]: (theme: string) => R.assoc("title", theme),
  [ActionTypeEnum.MalariaSetTheme]: (theme: string) => R.assoc("theme", theme),
  [ActionTypeEnum.MalariaSetRegion]: (region: RegionState) =>
    R.assoc("region", region),
  [ActionTypeEnum.MalariaSetFilters]: (filters: number[] | undefined) =>
    R.assoc("filters", filters || initialState.filters),
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
export const selectRegion = createSelector(
  selectMalariaState,
  R.prop("region")
);
