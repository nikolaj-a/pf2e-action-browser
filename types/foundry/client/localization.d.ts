/**
 * A helper class which assists with localization and string translation.
 */
declare class Localization {
    /**
     * Localize a string including variable formatting for input arguments. Provide a string ID which defines the
     * localized template. Variables can be included in the template enclosed in braces and will be substituted using
     * those named keys.
     *
     * @param stringId The string ID to translate
     * @param data Provided input data
     * @returns The translated and formatted string
     */
    format(stringId: string, data?: object): string;

    /**
     * Return whether a certain string has a known translation defined.
     *
     * @param stringId The string key being translated
     * @param fallback Allow fallback translations to count? Defaults to true
     */
    has(stringId: string, fallback?: boolean): boolean;

    /**
     * Localize a string by drawing a translation from the available translations dictionary, if available. If a
     * translation is not available, the original string is returned.
     *
     * @param stringId The string ID to translate
     * @returns The translated string
     */
    localize(stringId: string): string;
}
