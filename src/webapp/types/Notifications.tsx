export interface NotificationMessage {
    id: number;
    message: string;
}

export interface NotificationsState {
    notifications: NotificationMessage[];
}
