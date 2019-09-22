import { createAction } from "typesafe-actions";
import { ActionTypeEnum } from "../store/actions";
import { RegionState } from "./reducer";

export const setTitleAction = createAction(
  ActionTypeEnum.MalariaSetTheme,
  action => {
    return (title: string) => action(title);
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
