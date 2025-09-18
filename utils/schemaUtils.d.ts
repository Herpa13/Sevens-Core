import type { TaskSchema } from '../types';
/**
 * Extracts all unique placeholders from a task schema's template tasks.
 * A placeholder is a string within curly braces, e.g., {product_name}.
 * @param schema The TaskSchema to analyze.
 * @returns An array of unique placeholder keys (without braces).
 */
export declare const extractPlaceholders: (schema: TaskSchema) => string[];
