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
