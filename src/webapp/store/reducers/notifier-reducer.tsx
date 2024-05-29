import { createReducer } from "../reducer-utils";
import { ActionTypeEnum } from "../actions";
import { State } from "../types";
import { createSelector } from "reselect";
import { NotificationsState } from "../../types/Notifications";

const initialState: NotificationsState = Object.freeze({
    notifications: [],
});

export default createReducer<NotificationsState>(initialState, {
    [ActionTypeEnum.AddNotification]: (notification: string) => (state: NotificationsState) => ({
        notifications: [
            ...state.notifications,
            {
                id: new Date().getTime(),
                message: notification,
            },
        ],
    }),
    [ActionTypeEnum.DismissNotification]: (id: number) => (state: NotificationsState) => ({
        notifications: state.notifications.filter(n => n.id !== id),
    }),
});

const selectNotificationsState = (state: State) => state.notifications;

export const selectNotifications = createSelector(selectNotificationsState, state => state.notifications);
