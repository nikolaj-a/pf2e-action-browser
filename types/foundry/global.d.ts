/**
 * Load and cache a set of templates by providing an Array of paths.
 *
 * @param paths An array of template file paths to load, or an object of Handlebars partial IDs to paths.
 */
declare function loadTemplates(paths: string[]): Promise<void>;
