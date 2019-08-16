import { createAction } from "typesafe-actions";
import { ActionTypeEnum } from "../store/actions";

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

export const setFiltersAction = createAction(
  ActionTypeEnum.MalariaSetFilters,
  action => {
    return (filters: string[]) => action(filters);
  }
);

export const toggleEndemicityLayerAction = createAction(
  ActionTypeEnum.MalariaToogleEndemicityLayer,
  action => {
    return (visible: boolean) => action(visible);
  }
);
