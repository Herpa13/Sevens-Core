import { GoogleGenAI } from "@google/genai";
import type { AppData, PromptTemplate, LanguageCode } from '../types';
export declare const ai: GoogleGenAI;
/**
 * Orchestrates generating content from a template, handling context enrichment.
 * @param template The PromptTemplate object.
 * @param context The context data object for placeholder replacement.
 * @param appData The full application data, used for enriching context.
 * @returns The generated text from the AI.
 */
export declare const generateContentFromTemplate: (template: PromptTemplate, context: object, appData: AppData, targetLangCode?: LanguageCode) => Promise<string>;
