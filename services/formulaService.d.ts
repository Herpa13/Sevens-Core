import type { PublicationField } from '../types';
/**
 * Resolves a formula string by replacing placeholders and executing functions.
 * @param formula The formula string, e.g., "TRUNCATE({product.name}, 50)"
 * @param context The data context object, e.g., { product: Product }
 * @returns The resolved string value.
 */
export declare const resolveFormula: (formula: string, context: object) => string;
/**
 * Determines the final value of a cell based on the publication field configuration and data row.
 * @param field The PublicationField object from the template.
 * @param context The data context for the current row (e.g., { product: Product, appData: AppData }).
 * @returns The final string value for the cell.
 */
export declare const resolveCellValue: (field: PublicationField, context: object) => string;
