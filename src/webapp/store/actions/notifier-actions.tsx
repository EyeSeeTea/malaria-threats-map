import { createAction } from "typesafe-actions";
import { ActionTypeEnum } from "../actions";

export const addNotificationAction = createAction(ActionTypeEnum.AddNotification, action => {
    return (notification: string) => action(notification);
});

export const dismissNotificationAction = createAction(ActionTypeEnum.DismissNotification, action => {
    return (id: number) => action(id);
});
