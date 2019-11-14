import { createAction } from "typesafe-actions";
import { ActionTypeEnum } from "../actions";
import { RegionState } from "../types";

export const setAnyAction = createAction(
  ActionTypeEnum.MalariaSetAny,
  action => {
    return (any: any) => action(any);
  }
);

export const setThemeAction = createAction(
  ActionTypeEnum.MalariaSetTheme,
  action => {
    return (theme: string) => action(theme);
  }
);

export interface GAEvent {
  category: string;
  action: string;
}

export const logEventAction = createAction(
  ActionTypeEnum.MalariaLogEvent,
  action => {
    return (event: GAEvent) => action(event);
  }
);

export const setRegionAction = createAction(
  ActionTypeEnum.MalariaSetRegion,
  action => {
    return (region: RegionState) => action(region);
  }
);

export const setFiltersAction = createAction(
  ActionTypeEnum.MalariaSetFilters,
  action => {
    return (filters: number[] | undefined) => action(filters);
  }
);

export const toggleEndemicityLayerAction = createAction(
  ActionTypeEnum.MalariaToogleEndemicityLayer,
  action => {
    return (visible: boolean) => action(visible);
  }
);

export const setCountryModeAction = createAction(
  ActionTypeEnum.MalariaSetCountryMode,
  action => {
    return (countryMode: boolean) => action(countryMode);
  }
);

export const setStoryModeAction = createAction(
  ActionTypeEnum.MalariaSetStoryMode,
  action => {
    return (storyMode: boolean) => action(storyMode);
  }
);

export const setInitialDialogOpen = createAction(
  ActionTypeEnum.MalariaSetInitialDialogOpen,
  action => {
    return (initialDialogOpen: boolean) => action(initialDialogOpen);
  }
);

export const setFiltersOpen = createAction(
  ActionTypeEnum.SetFiltersOpen,
  action => {
    return (filtersOpen: boolean) => action(filtersOpen);
  }
);

export const setFiltersMode = createAction(
  ActionTypeEnum.SetFiltersMode,
  action => {
    return (filtersMode: string) => action(filtersMode);
  }
);
