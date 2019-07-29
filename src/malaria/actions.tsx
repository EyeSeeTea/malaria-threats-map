import { createAction } from "typesafe-actions";
import { ActionTypeEnum } from "../store/actions";

export const setTitleAction = createAction(
  ActionTypeEnum.MalariaSetTitle,
  action => {
    return (title: string) => action(title);
  }
);

export const toggleEndemicityLayerAction = createAction(
  ActionTypeEnum.MalariaToogleEndemicityLayer,
  action => {
    return (visible: boolean) => action(visible);
  }
);
