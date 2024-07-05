declare interface NotifyOptions {
    permanent: boolean;
    localize: boolean;
    console: boolean;
}

declare class Notifications extends Application {
    /**
     * Display a notification with the "warning" type
     *
     * @param message The content of the notification message
     * @param options Notification options passed to the notify function
     * @returns The ID of the notification (positive integer)
     */
    warn(message: string, options?: NotifyOptions): number;
}

declare namespace ui {
    const notifications: Notifications;
}
