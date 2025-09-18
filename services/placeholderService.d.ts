/**
 * Resolves placeholders in a template string using a context object.
 * Supports dot-notation for nested properties and special handling for versioned Amazon content.
 *
 * @param template The string containing placeholders like {product.name} or {product.amazonContents.ES.title}.
 * @param context The object containing data to fill placeholders.
 * @returns The template string with all placeholders replaced by their values.
 */
export declare const resolvePrompt: (template: string, context: object) => string;
