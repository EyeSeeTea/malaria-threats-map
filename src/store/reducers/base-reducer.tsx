import * as R from "ramda";
import { createSelector } from "reselect";
import { MalariaState, RegionState, SiteSelection, State } from "../types";
import { createReducer } from "../reducer-utils";
import { ActionTypeEnum } from "../actions";

const initialState: MalariaState = Object.freeze({
  theme: "prevention",
  any: null,
  endemicity: false,
  countryMode: false,
  storyMode: false,
  storyModeStep: 0,
  filters: [2010, 2018],
  region: {
    country: "",
    region: "",
    subRegion: ""
  },
  initialDialogOpen: false,
  filtersOpen: false,
  filtersMode: "filters",
  selection: null,
  mobileOptionsOpen: false,
  zoom: 2,
  setZoom: null,
  bounds: [[]],
  setBounds: [[]]
});

export default createReducer<MalariaState>(initialState, {
  [ActionTypeEnum.MalariaSetTheme]: (theme: string) => R.assoc("theme", theme),
  [ActionTypeEnum.MalariaSetAny]: (any: any) => R.assoc("any", any),
  [ActionTypeEnum.MalariaSetRegion]: (region: RegionState | null) => state => ({
    ...state,
    region: region ? { ...initialState.region, ...region } : null
  }),
  [ActionTypeEnum.MalariaSetFilters]: (filters: number[] | undefined) =>
    R.assoc("filters", filters || initialState.filters),
  [ActionTypeEnum.MalariaToogleEndemicityLayer]: (visible: boolean) =>
    R.assoc("endemicity", visible),
  [ActionTypeEnum.MalariaSetCountryMode]: (countryMode: boolean) =>
    R.assoc("countryMode", countryMode),
  [ActionTypeEnum.MalariaSetStoryMode]: (storyMode: boolean) =>
    R.assoc("storyMode", storyMode),
  [ActionTypeEnum.MalariaSetStoryModeStep]: (storyModeStep: number) =>
    R.assoc("storyModeStep", storyModeStep || 0),
  [ActionTypeEnum.MalariaSetInitialDialogOpen]: (initialDialogOpen: boolean) =>
    R.assoc("initialDialogOpen", initialDialogOpen),
  [ActionTypeEnum.SetFiltersOpen]: (filtersOpen: boolean) =>
    R.assoc("filtersOpen", filtersOpen),
  [ActionTypeEnum.SetFiltersMode]: (filtersMode: string) =>
    R.assoc("filtersMode", filtersMode || "filters"),
  [ActionTypeEnum.SetSelection]: (selection: SiteSelection) =>
    R.assoc("selection", selection || null),
  [ActionTypeEnum.SetMobileOptionsOpen]: (mobileOptionsOpen: boolean) =>
    R.assoc("mobileOptionsOpen", mobileOptionsOpen),
  [ActionTypeEnum.UpdateZoom]: (zoom: number) => R.assoc("zoom", zoom),
  [ActionTypeEnum.SetZoom]: (zoom: number) => R.assoc("setZoom", zoom),
  [ActionTypeEnum.UpdateBounds]: (bounds: Array<Array<number>>) =>
    R.assoc("bounds", bounds),
  [ActionTypeEnum.SetBounds]: (bounds: Array<Array<number>>) =>
    R.assoc("setBounds", bounds)
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
export const selectFiltersMode = createSelector(
  selectMalariaState,
  R.prop("filtersMode")
);
export const selectStoryModeStep = createSelector(
  selectMalariaState,
  R.prop("storyModeStep")
);
export const selectSelection = createSelector(
  selectMalariaState,
  R.prop("selection")
);
export const selectAreMobileOptionsOpen = createSelector(
  selectMalariaState,
  R.prop("mobileOptionsOpen")
);
export const selectZoom = createSelector(selectMalariaState, R.prop("zoom"));
export const selectSetZoom = createSelector(
  selectMalariaState,
  R.prop("setZoom")
);
export const selectBounds = createSelector(
  selectMalariaState,
  R.prop("bounds")
);
export const selectSetBounds = createSelector(
  selectMalariaState,
  R.prop("setBounds")
);
