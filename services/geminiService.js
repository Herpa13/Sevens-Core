"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateContentFromTemplate = exports.ai = void 0;
const genai_1 = require("@google/genai");
const placeholderService_1 = require("./placeholderService");
// --- GEMINI API INITIALIZATION ---
exports.ai = new genai_1.GoogleGenAI({ apiKey: process.env.API_KEY });
/**
 * Orchestrates generating content from a template, handling context enrichment.
 * @param template The PromptTemplate object.
 * @param context The context data object for placeholder replacement.
 * @param appData The full application data, used for enriching context.
 * @returns The generated text from the AI.
 */
const generateContentFromTemplate = async (template, context, appData, targetLangCode) => {
    // Enrich context for all calls, not just translations
    const enrichedContext = { ...context, appData };
    // For translations, further enrich context with global rules and glossary
    if (template.category === 'Traducción' && targetLangCode) {
        const { aiSettings, translationTerms } = appData;
        enrichedContext.global_rules = aiSettings.globalTranslationRules || 'No hay reglas globales definidas.';
        const glossaryEntries = translationTerms.map(term => {
            const translation = term.translations.find(t => t.lang === targetLangCode);
            return translation ? `${term.spanish}:${translation.value}` : null;
        }).filter(Boolean);
        enrichedContext.glossary = glossaryEntries.length > 0 ? glossaryEntries.join('\n') : 'No hay entradas en el glosario para este idioma.';
    }
    const finalPrompt = (0, placeholderService_1.resolvePrompt)(template.template, enrichedContext);
    try {
        // FIX: Use the recommended 'gemini-2.5-flash' model instead of the deprecated 'gemini-1.5-flash'.
        const response = await exports.ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: finalPrompt,
        });
        // FIX: The .text property is directly on the response object.
        return response.text.trim();
    }
    catch (error) {
        console.error("Error generating content from Gemini:", error);
        throw new Error("La llamada a la API de IA ha fallado.");
    }
};
exports.generateContentFromTemplate = generateContentFromTemplate;
