declare class ClientDocument {}

declare interface EnrichmentOptions {
    /**
     * Include unrevealed secret tags in the final HTML? If false, unrevealed secret blocks will be removed.
     */
    secrets: boolean;
    /**
     * Replace dynamic document links?
     */
    documents: boolean;
    /**
     * Replace hyperlink content?
     */
    links: boolean;
    /**
     * Replace inline dice rolls?
     */
    rolls: boolean;
    /**
     * Replace embedded content?
     */
    embeds: boolean;
    /**
     * The data object providing context for inline rolls, or a function that produces it.
     */
    rollData: any;
    /**
     * A document to resolve relative UUIDs against.
     */
    relativeTo: ClientDocument;
}

declare class TextEditor {
    /**
     * Enrich HTML content by replacing or augmenting components of it
     *
     * @param content The original HTML content (as a string)
     * @param options Additional options which configure how HTML is enriched
     * @returns The enriched HTML content
     */
    static enrichHTML(content: string, options?: EnrichmentOptions): Promise<string>;
}
