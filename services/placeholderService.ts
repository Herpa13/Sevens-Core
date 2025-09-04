import { get } from 'lodash-es';
import type { Product, Country, AppData } from '../types';

/**
 * Resolves placeholders in a template string using a context object.
 * Supports dot-notation for nested properties and special handling for versioned Amazon content.
 * 
 * @param template The string containing placeholders like {product.name} or {product.amazonContents.ES.title}.
 * @param context The object containing data to fill placeholders.
 * @returns The template string with all placeholders replaced by their values.
 */
export const resolvePrompt = (template: string, context: object): string => {
    return template.replace(/{([^{}]+)}/g, (match, path) => {
        const trimmedPath = path.trim();

        // --- START SPECIAL AMAZON CONTENT HANDLING ---
        if (trimmedPath.startsWith('product.amazonContents.')) {
            const product = get(context, 'product') as Product | undefined;
            if (!product) return '';

            const parts = trimmedPath.split('.');
            // product.amazonContents.ES.title -> ['product', 'amazonContents', 'ES', 'title']
            if (parts.length >= 4) {
                const countryIso = parts[2];
                const fieldKey = parts.slice(3).join('.');
                
                const countries = get(context, 'appData.countries') as Country[] | undefined;
                if (!countries) return `[No country data]`;

                const country = countries.find(c => c.iso === countryIso);
                if (!country) return `[Invalid ISO: ${countryIso}]`;
                
                const amazonContentForCountry = product.amazonContents.find(ac => ac.countryId === country.id);
                if (!amazonContentForCountry || !amazonContentForCountry.currentVersionId) return '';

                const activeVersion = amazonContentForCountry.versions.find(v => v.versionId === amazonContentForCountry.currentVersionId);
                if (!activeVersion) return '';

                const value = get(activeVersion.content, fieldKey);
                if (value === undefined || value === null) return '';
                if (Array.isArray(value)) {
                    // Handle bullet points array
                    if (value.length > 0 && typeof value[0] === 'object' && 'text' in value[0]) {
                        return value.map(item => item.text).join(', ');
                    }
                    return value.join(', ');
                }
                return String(value);
            }
        }
        // --- END SPECIAL AMAZON CONTENT HANDLING ---

        const value = get(context, trimmedPath);

        if (value === undefined || value === null) {
            return ''; // Return empty string for unresolved placeholders
        }
        
        if (Array.isArray(value)) {
            if (value.length > 0 && typeof value[0] === 'object') {
                if (trimmedPath === 'product.composition' && context.hasOwnProperty('appData')) {
                     const { ingredients } = (context as any).appData as AppData;
                     return value.map(c => {
                        const ingredient = ingredients.find((i: any) => i.id === c.ingredientId);
                        return `${c.quantity}${ingredient?.measureUnit || 'mg'} de ${ingredient?.latinName || 'Ingrediente desconocido'}`;
                     }).join(', ') || 'Sin composición';
                }
                return JSON.stringify(value, null, 2);
            }
            return value.join(', ');
        }

        return String(value);
    });
};