"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPlaceholders = void 0;
/**
 * Extracts all unique placeholders from a task schema's template tasks.
 * A placeholder is a string within curly braces, e.g., {product_name}.
 * @param schema The TaskSchema to analyze.
 * @returns An array of unique placeholder keys (without braces).
 */
const extractPlaceholders = (schema) => {
    const placeholderSet = new Set();
    const regex = /{([^{}]+)}/g;
    schema.templateTasks.forEach(task => {
        const titleMatches = task.title.match(regex) || [];
        const descMatches = task.description.match(regex) || [];
        [...titleMatches, ...descMatches].forEach(match => {
            // Extract the content within the braces
            const placeholder = match.slice(1, -1).trim();
            // We are not interested in object paths for this, only simple placeholders
            if (!placeholder.includes('.')) {
                placeholderSet.add(placeholder);
            }
        });
    });
    return Array.from(placeholderSet);
};
exports.extractPlaceholders = extractPlaceholders;
