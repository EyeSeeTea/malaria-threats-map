import { createAction } from "typesafe-actions";
import { ActionTypeEnum } from "../actions";

export const addNotificationAction = createAction(ActionTypeEnum.AddNotification)<string>();

export const dismissNotificationAction = createAction(ActionTypeEnum.DismissNotification)<number>();
