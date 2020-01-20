import { createAction } from "typesafe-actions";
import { ActionTypeEnum } from "../actions";
import { RegionState, SiteSelection } from "../types";

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
    return (region: RegionState | null) => action(region);
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

export const setStoryModeStepAction = createAction(
  ActionTypeEnum.MalariaSetStoryModeStep,
  action => {
    return (storyModeStep: number) => action(storyModeStep);
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

export const setSelection = createAction(
  ActionTypeEnum.SetSelection,
  action => {
    return (selection: SiteSelection | null) => action(selection);
  }
);

export const setMobileOptionsOpen = createAction(
  ActionTypeEnum.SetMobileOptionsOpen,
  action => {
    return (mobileOptionsOpen: boolean) => action(mobileOptionsOpen);
  }
);

export const updateZoomAction = createAction(
  ActionTypeEnum.UpdateZoom,
  action => {
    return (zoom: number) => action(zoom);
  }
);

export const setZoomAction = createAction(ActionTypeEnum.SetZoom, action => {
  return (zoom: number) => action(zoom);
});

export const updateBoundsAction = createAction(
  ActionTypeEnum.UpdateBounds,
  action => {
    return (bounds: Array<Array<number>>) => action(bounds);
  }
);

export const setBoundsAction = createAction(
  ActionTypeEnum.SetBounds,
  action => {
    return (bounds: Array<Array<number>>) => action(bounds);
  }
);

export const setTourOpenAction = createAction(
  ActionTypeEnum.SetTourOpen,
  action => {
    return (open: boolean) => action(open);
  }
);

export const setTourStepAction = createAction(
  ActionTypeEnum.SetTourStep,
  action => {
    return (step: number) => action(step);
  }
);

export const setDataDownloadOpenAction = createAction(
  ActionTypeEnum.SetDataDownloadOpen,
  action => {
    return (dataDownloadOpen: boolean) => action(dataDownloadOpen);
  }
);
