declare interface ApplicationOptions {}

declare interface ApplicationRenderOptions {
    left: number;
    top: number;
    width: number;
    height: number;
    scale: number;
    focus: boolean;
    renderContext: string;
    renderData: any;
}

declare interface ApplicationCloseOptions {}

/**
 * The standard application window that is rendered for a large variety of UI elements in Foundry VTT.
 */
declare abstract class Application {
    /**
     * The application ID is a unique incrementing integer which is used to identify every application window drawn by
     * the VTT
     */
    appId: number;

    constructor(options?: Partial<ApplicationOptions>);

    static get defaultOptions(): ApplicationOptions;

    /**
     * Return a flag for whether the Application instance is currently rendered
     */
    get rendered(): boolean;

    /**
     * An Application window should define its own title definition logic which may be dynamic depending on its data
     */
    get title(): string;

    activateListeners($html: JQuery): void;

    /**
     * Close the application and un-register references to it within UI mappings This function returns a Promise which
     * resolves once the window closing animation concludes
     *
     * @param options Options which affect how the Application is closed
     * @returns A Promise which resolves once the application is closed
     */
    close(options?: ApplicationCloseOptions): Promise<void>;

    /**
     * An application should define the data object used to render its template. This function may either return an
     * Object directly, or a Promise which resolves to an Object If undefined, the default implementation will return an
     * empty object allowing only for rendering of static HTML
     */
    getData(options?: ApplicationOptions): object | Promise<object>;

    /**
     * Render the Application by evaluating its HTML template against the object of data provided by the getData method
     * If the Application is rendered as a pop-out window, wrap the contained HTML in an outer frame with window
     * controls
     *
     * @param force   Add the rendered application to the DOM if it is not already present. If false, the Application
     *                will only be re-rendered if it is already present.
     * @param options Additional rendering options which are applied to customize the way that the Application is
     *                rendered in the DOM.
     * @returns The rendered Application instance
     */
    render(force?: boolean, options?: ApplicationRenderOptions): this;
}
