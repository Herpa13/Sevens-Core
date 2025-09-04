
import React, { useState, useEffect, useRef, FC } from 'react';
import { Icon } from './Icon';
import type { AppData, PromptTemplate, LanguageCode } from '../../types';
import { generateContentFromTemplate } from '../../services/geminiService';
import { AIPreviewModal } from '../modals/AIPreviewModal';

interface AIAssistantButtonProps {
    appData: AppData;
    templateCategory: PromptTemplate['category'];
    context: object;
    onResult: (result: string) => void;
    entityType: PromptTemplate['entityType'];
    targetLangCode?: LanguageCode;
}

export const AIAssistantButton: FC<AIAssistantButtonProps> = ({ appData, templateCategory, context, onResult, entityType, targetLangCode }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [previewState, setPreviewState] = useState<PromptTemplate | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const relevantTemplates = appData.promptTemplates.filter(t => 
        t.category === templateCategory && (t.entityType === entityType || t.entityType === 'general')
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    const handleTemplateClick = (template: PromptTemplate) => {
        setIsMenuOpen(false);
        setPreviewState(template);
    };
    
    const handleConfirmGeneration = async () => {
        if (!previewState) return;
        
        setIsLoading(true);
        try {
            const result = await generateContentFromTemplate(previewState, context, appData, targetLangCode);
            onResult(result);
        } catch (error) {
            console.error(error);
            alert((error as Error).message || "An unknown error occurred with the AI assistant.");
        } finally {
            setIsLoading(false);
            setPreviewState(null);
        }
    };
    
    if (relevantTemplates.length === 0) {
        return null;
    }

    return (
        <div ref={wrapperRef} className="relative inline-block">
            <button
                type="button"
                onClick={() => setIsMenuOpen(prev => !prev)}
                disabled={isLoading}
                className="p-2 text-cyan-400 bg-slate-700 rounded-md hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 disabled:opacity-50"
                title="Asistente de IA"
            >
                {isLoading ? (
                    <Icon name="spinner" className="fa-spin" />
                ) : (
                    <Icon name="wand-magic-sparkles" />
                )}
            </button>
            {isMenuOpen && (
                <div className="absolute z-20 right-0 mt-2 w-64 bg-slate-700 border border-slate-600 rounded-md shadow-lg py-1">
                    {relevantTemplates.map(template => (
                        <button
                            key={template.id}
                            onClick={() => handleTemplateClick(template)}
                            className="w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-slate-600 flex items-start"
                        >
                            <Icon name="robot" className="mr-3 mt-1 text-slate-400" />
                            <div>
                                <p className="font-semibold">{template.name}</p>
                                <p className="text-xs text-slate-400">{template.description}</p>
                            </div>
                        </button>
                    ))}
                </div>
            )}
            {previewState && (
                <AIPreviewModal
                    template={previewState}
                    context={context}
                    appData={appData}
                    onClose={() => setPreviewState(null)}
                    onConfirm={handleConfirmGeneration}
                    isLoading={isLoading}
                />
            )}
        </div>
    );
};
    