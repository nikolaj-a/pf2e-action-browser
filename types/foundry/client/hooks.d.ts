declare interface HooksOnOptions {
    /**
     * Only trigger the hooked function once
     */
    once: boolean;
}

declare interface HooksOnceOptions {}

declare class Hooks {
    /**
     * Unregister a callback handler for a particular hook event
     *
     * @param hook The unique name of the hooked event
     * @param fn   The function, or ID number for the function, that should be turned off
     */
    static off(hook: string, fn: number | Function): void;

    /**
     * Register a callback handler which should be triggered when a hook is triggered.
     *
     * @param hook         The unique name of the hooked event
     * @param fn           The callback function which should be triggered when the hook event occurs
     * @param options      Options which customize hook registration
     * @param options.once Only trigger the hooked function once
     */
    static on(hook: "ready", fn: () => void, options?: HooksOnOptions): void; // A hook event that fires when the game is fully ready.
    static on(hook: "getSceneControlButtons", fn: (controls: SceneControl[]) => void, options?: HooksOnOptions): void; // A hook event that fires when the Scene controls are initialized.
    static on(hook: string, fn: (...args: any) => void, options?: HooksOnOptions): void;

    static once(hook: "init", fn: () => void, options?: HooksOnceOptions): void; // A hook event that fires as Foundry is initializing, right before any initialization tasks have begun.
    static once(hook: string, fn: () => void, options?: HooksOnceOptions): void;
}
