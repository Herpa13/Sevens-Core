import type { TaskSchema } from '../types';

/**
 * Extracts all unique placeholders from a task schema's template tasks.
 * A placeholder is a string within curly braces, e.g., {product_name}.
 * @param schema The TaskSchema to analyze.
 * @returns An array of unique placeholder keys (without braces).
 */
export const extractPlaceholders = (schema: TaskSchema): string[] => {
    const placeholderSet = new Set<string>();
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
