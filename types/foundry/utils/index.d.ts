/**
 * A reusable storage concept which blends the functionality of an Array with the efficient key-based lookup of a Map.
 * This concept is reused throughout Foundry VTT where a collection of uniquely identified elements is required.
 */
declare class Collection<V extends unknown, K extends string = string> extends Map<K, V> {
    constructor(entries: [K, V][]);
    get contents(): V[];
}

interface MergeObjectOptions {
    /**
     * Control whether to insert new top-level objects into the resulting structure which do not previously exist
     * in the original object.
     */
    insertKeys?: boolean;
    /**
     * Control whether to insert new nested values into child objects in the resulting structure which did not
     * previously exist in the original object. */
    insertValues?: boolean;
    /**
     * Control whether to replace existing values in the source, or only merge values which do not already exist
     * in the original object.
     */
    overwrite?: boolean;
    /**
     * Control whether to merge inner-objects recursively (if true), or whether to simply replace inner objects
     * with a provided new value.
     */
    recursive?: boolean;
    /**
     * Control whether to apply updates to the original object in-place (if true), otherwise the original object is
     * duplicated and the copy is merged.
     */
    inplace?: boolean;
    /**
     * Control whether strict type checking requires that the value of a key in the other object must match the
     * data type in the original data to be merged.
     */
    enforceTypes?: boolean;
    /**
     * Control whether to perform deletions on the original object if deletion keys are present in the other object.
     */
    performDeletions?: boolean;
}

declare namespace foundry {
    namespace utils {
        /**
         * Wrap a callback in a debounced timeout.
         * Delay execution of the callback function until the function has not been called for delay milliseconds
         * @param callback A function to execute once the debounced threshold has been passed
         * @param delay An amount of time in milliseconds to delay
         * @return A wrapped function which can be called to debounce execution
         */
        function debounce<T extends unknown[]>(callback: (...args: T) => unknown, delay: number): (...args: T) => void;

        function mergeObject<T extends object, U extends object = T>(
            original: T,
            other?: U | undefined,
            options?: MergeObjectOptions,
            _d?: number,
        ): T & U;
    }
}
