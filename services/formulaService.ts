
import { get } from 'lodash-es';
import type { PublicationField, AppData, Price } from '../types';

// --- UTILITY FUNCTIONS ---
const parseArgs = (argsStr: string): string[] => {
    const args: string[] = [];
    let currentArg = '';
    let inQuotes = false;
    let quoteChar = '';

    for (let i = 0; i < argsStr.length; i++) {
        const char = argsStr[i];
        if ((char === '"' || char === "'") && !inQuotes) {
            inQuotes = true;
            quoteChar = char;
        } else if (char === quoteChar && inQuotes) {
            inQuotes = false;
            quoteChar = '';
        } else if (char === ',' && !inQuotes) {
            args.push(currentArg.trim());
            currentArg = '';
        } else {
            currentArg += char;
        }
    }
    args.push(currentArg.trim());
    return args.map(arg => arg.replace(/^['"]|['"]$/g, ''));
};

const evaluateCondition = (condition: string): boolean => {
    const operators = ['==', '!=', '>=', '<=', '>', '<'];
    for (const op of operators) {
        if (condition.includes(op)) {
            const parts = condition.split(op);
             if (parts.length > 1) {
                const left = parts.slice(0, -1).join(op).trim();
                const right = parts.slice(-1)[0].trim();
                
                const leftNum = parseFloat(left);
                const rightNum = parseFloat(right);

                if (!isNaN(leftNum) && !isNaN(rightNum)) {
                    switch (op) {
                        case '==': return leftNum === rightNum;
                        case '!=': return leftNum !== rightNum;
                        case '>=': return leftNum >= rightNum;
                        case '<=': return leftNum <= rightNum;
                        case '>': return leftNum > rightNum;
                        case '<': return leftNum < rightNum;
                    }
                } else {
                    switch (op) {
                        case '==': return left === right;
                        case '!=': return left !== right;
                        default: return false;
                    }
                }
            }
        }
    }
    return !!condition && condition.toLowerCase() !== 'false' && condition !== '0';
};


// --- BUILT-IN FUNCTIONS ---
const FUNCTIONS: Record<string, (...args: any[]) => string> = {
    TRUNCATE: (text: string = '', lengthStr: string = '50') => {
        const length = parseInt(lengthStr, 10);
        if (isNaN(length) || !text) return text || '';
        return text.substring(0, length);
    },
    UPPERCASE: (text: string = '') => (text || '').toUpperCase(),
    REPLACE: (text: string = '', find: string = '', replace: string = '') => {
        if (!text) return '';
        return text.split(find).join(replace);
    },
    STRIP_HTML: (html: string = '') => (html || '').replace(/<[^>]*>/g, ''),
    IF: (condition: string = '', value_if_true: string = '', value_if_false: string = '') => {
        return evaluateCondition(condition) ? value_if_true : value_if_false;
    }
};

/**
 * Resolves a formula string by replacing placeholders and executing functions.
 * @param formula The formula string, e.g., "TRUNCATE({product.name}, 50)"
 * @param context The data context object, e.g., { product: Product }
 * @returns The resolved string value.
 */
export const resolveFormula = (formula: string, context: object): string => {
    // 1. Resolve placeholders like {product.name}
    let resolved = formula.replace(/{([^{}]+)}/g, (match, path) => {
        // Handle special case for price first
        if (path.trim() === 'price.finalAmount') {
            const product = get(context, 'product');
            const platformId = get(context, 'platformId');
            const appData = get(context, 'appData') as AppData;
            if (platformId && product && appData) {
                const price = appData.prices.find((p: Price) => p.productId === (product as any).id && p.platformId === platformId);
                return price ? String(price.amount) : '';
            }
            return '';
        }
        
        const value = get(context, path.trim());
        if (value === undefined || value === null) return '';
        if (Array.isArray(value)) return value.join(', ');
        return String(value);
    });

    // 2. Resolve functions iteratively to handle basic nesting
    const functionRegex = /(\w+)\(([^)]*)\)/g;
    for (let i = 0; i < 5; i++) { // Limit iterations to prevent infinite loops
      let foundFunction = false;
      const tempResolved = resolved.replace(functionRegex, (fullMatch, funcName, argsStr) => {
          // Check if this match is inside another function's arguments, if so, skip it for now
          const openParensBefore = (resolved.substring(0, resolved.indexOf(fullMatch)).match(/\(/g) || []).length;
          const closeParensBefore = (resolved.substring(0, resolved.indexOf(fullMatch)).match(/\)/g) || []).length;
          if (openParensBefore > closeParensBefore) {
              return fullMatch;
          }

          const func = FUNCTIONS[funcName.toUpperCase()];
          if (func) {
              foundFunction = true;
              const args = parseArgs(argsStr);
              try {
                  return func(...args);
              } catch (e) {
                  console.error(`Error executing formula function ${funcName}:`, e);
                  return `[ERROR:${funcName}]`;
              }
          }
          return fullMatch;
      });
      if (!foundFunction) break;
      resolved = tempResolved;
    }

    return resolved;
};

/**
 * Determines the final value of a cell based on the publication field configuration and data row.
 * @param field The PublicationField object from the template.
 * @param context The data context for the current row (e.g., { product: Product, appData: AppData }).
 * @returns The final string value for the cell.
 */
export const resolveCellValue = (field: PublicationField, context: object): string => {
    switch (field.mappingType) {
        case 'static':
            return field.value;
        case 'mapped':
             // Handle special virtual placeholder for price
            if (field.value === '{price.finalAmount}') {
                const product = get(context, 'product');
                const platformId = get(context, 'platformId');
                const appData = get(context, 'appData') as AppData;
                if (platformId && product && appData) {
                    const price = appData.prices.find((p: Price) => p.productId === (product as any).id && p.platformId === platformId);
                    return price ? String(price.amount) : '';
                }
                return '';
            }
            const path = field.value.replace(/[{}]/g, '');
            const value = get(context, path, '');
            if (Array.isArray(value)) return value.join(' | ');
            return String(value);
        case 'formula':
            return resolveFormula(field.value, context);
        default:
            return '';
    }
};
