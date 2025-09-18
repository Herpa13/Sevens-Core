"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveCellValue = exports.resolveFormula = void 0;
const lodash_es_1 = require("lodash-es");
// --- UTILITY FUNCTIONS ---
const parseArgs = (argsStr) => {
    const args = [];
    let currentArg = '';
    let inQuotes = false;
    let quoteChar = '';
    for (let i = 0; i < argsStr.length; i++) {
        const char = argsStr[i];
        if ((char === '"' || char === "'") && !inQuotes) {
            inQuotes = true;
            quoteChar = char;
        }
        else if (char === quoteChar && inQuotes) {
            inQuotes = false;
            quoteChar = '';
        }
        else if (char === ',' && !inQuotes) {
            args.push(currentArg.trim());
            currentArg = '';
        }
        else {
            currentArg += char;
        }
    }
    args.push(currentArg.trim());
    return args.map(arg => arg.replace(/^['"]|['"]$/g, ''));
};
const evaluateCondition = (condition) => {
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
                }
                else {
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
const FUNCTIONS = {
    TRUNCATE: (text = '', lengthStr = '50') => {
        const length = parseInt(lengthStr, 10);
        if (isNaN(length) || !text)
            return text || '';
        return text.substring(0, length);
    },
    UPPERCASE: (text = '') => (text || '').toUpperCase(),
    REPLACE: (text = '', find = '', replace = '') => {
        if (!text)
            return '';
        return text.split(find).join(replace);
    },
    STRIP_HTML: (html = '') => (html || '').replace(/<[^>]*>/g, ''),
    IF: (condition = '', value_if_true = '', value_if_false = '') => {
        return evaluateCondition(condition) ? value_if_true : value_if_false;
    }
};
/**
 * Resolves a formula string by replacing placeholders and executing functions.
 * @param formula The formula string, e.g., "TRUNCATE({product.name}, 50)"
 * @param context The data context object, e.g., { product: Product }
 * @returns The resolved string value.
 */
const resolveFormula = (formula, context) => {
    // 1. Resolve placeholders like {product.name}
    let resolved = formula.replace(/{([^{}]+)}/g, (match, path) => {
        // Handle special case for price first
        if (path.trim() === 'price.finalAmount') {
            const product = (0, lodash_es_1.get)(context, 'product');
            const platformId = (0, lodash_es_1.get)(context, 'platformId');
            const appData = (0, lodash_es_1.get)(context, 'appData');
            if (platformId && product && appData) {
                const price = appData.prices.find((p) => p.productId === product.id && p.platformId === platformId);
                return price ? String(price.amount) : '';
            }
            return '';
        }
        const value = (0, lodash_es_1.get)(context, path.trim());
        if (value === undefined || value === null)
            return '';
        if (Array.isArray(value))
            return value.join(', ');
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
                }
                catch (e) {
                    console.error(`Error executing formula function ${funcName}:`, e);
                    return `[ERROR:${funcName}]`;
                }
            }
            return fullMatch;
        });
        if (!foundFunction)
            break;
        resolved = tempResolved;
    }
    return resolved;
};
exports.resolveFormula = resolveFormula;
/**
 * Determines the final value of a cell based on the publication field configuration and data row.
 * @param field The PublicationField object from the template.
 * @param context The data context for the current row (e.g., { product: Product, appData: AppData }).
 * @returns The final string value for the cell.
 */
const resolveCellValue = (field, context) => {
    switch (field.mappingType) {
        case 'static':
            return field.value;
        case 'mapped':
            // Handle special virtual placeholder for price
            if (field.value === '{price.finalAmount}') {
                const product = (0, lodash_es_1.get)(context, 'product');
                const platformId = (0, lodash_es_1.get)(context, 'platformId');
                const appData = (0, lodash_es_1.get)(context, 'appData');
                if (platformId && product && appData) {
                    const price = appData.prices.find((p) => p.productId === product.id && p.platformId === platformId);
                    return price ? String(price.amount) : '';
                }
                return '';
            }
            const path = field.value.replace(/[{}]/g, '');
            const value = (0, lodash_es_1.get)(context, path, '');
            if (Array.isArray(value))
                return value.join(' | ');
            return String(value);
        case 'formula':
            return (0, exports.resolveFormula)(field.value, context);
        default:
            return '';
    }
};
exports.resolveCellValue = resolveCellValue;
