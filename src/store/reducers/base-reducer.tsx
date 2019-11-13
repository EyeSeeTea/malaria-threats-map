import * as R from "ramda";
import { createSelector } from "reselect";
import { MalariaState, RegionState, State } from "../types";
import { createReducer } from "../reducer-utils";
import { ActionTypeEnum } from "../actions";

const initialState: MalariaState = Object.freeze({
  theme: "prevention",
  any: null,
  endemicity: false,
  countryMode: false,
  storyMode: false,
  filters: [2010, 2018],
  region: {
    country: "",
    region: "",
    subRegion: ""
  },
  initialDialogOpen: false,
  filtersOpen: false
});

export default createReducer<MalariaState>(initialState, {
  [ActionTypeEnum.MalariaSetTheme]: (theme: string) => R.assoc("theme", theme),
  [ActionTypeEnum.MalariaSetAny]: (any: any) => R.assoc("any", any),
  [ActionTypeEnum.MalariaSetRegion]: (region: RegionState) => state => ({
    ...state,
    region: { ...initialState.region, ...region }
  }),
  [ActionTypeEnum.MalariaSetFilters]: (filters: number[] | undefined) =>
    R.assoc("filters", filters || initialState.filters),
  [ActionTypeEnum.MalariaToogleEndemicityLayer]: (visible: boolean) =>
    R.assoc("endemicity", visible),
  [ActionTypeEnum.MalariaSetCountryMode]: (countryMode: boolean) =>
    R.assoc("countryMode", countryMode),
  [ActionTypeEnum.MalariaSetStoryMode]: (storyMode: boolean) =>
    R.assoc("storyMode", storyMode),
  [ActionTypeEnum.MalariaSetInitialDialogOpen]: (initialDialogOpen: boolean) =>
    R.assoc("initialDialogOpen", initialDialogOpen),
  [ActionTypeEnum.SetFiltersOpen]: (filtersOpen: boolean) =>
    R.assoc("filtersOpen", filtersOpen)
});

export const selectMalariaState = (state: State) => state.malaria;

export const selectTheme = createSelector(selectMalariaState, R.prop("theme"));
export const selectStoryMode = createSelector(
  selectMalariaState,
  R.prop("storyMode")
);
export const selectAny = createSelector(selectMalariaState, R.prop("any"));
export const selectEndemicity = createSelector(
  selectMalariaState,
  R.prop("endemicity")
);
export const selectCountryMode = createSelector(
  selectMalariaState,
  R.prop("countryMode")
);
export const selectFilters = createSelector(
  selectMalariaState,
  R.prop("filters")
);
export const selectRegion = createSelector(
  selectMalariaState,
  R.prop("region")
);
export const selectIsInitialDialogOpen = createSelector(
  selectMalariaState,
  R.prop("initialDialogOpen")
);

export const selectAreFiltersOpen = createSelector(
  selectMalariaState,
  R.prop("filtersOpen")
);
