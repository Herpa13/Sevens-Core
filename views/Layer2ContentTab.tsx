import React, { useState, useMemo, FC } from 'react';
import { Product, AppData, ContentPartReference, LanguageCode, Layer2Content, Layer2ContentBlock, PromptTemplate } from '../types';
import { FormField } from '../components/common/FormField';
import { Select } from '../components/common/Select';
import { TextArea } from '../components/common/TextArea';
import { Icon } from '../components/common/Icon';
import { CollapsibleSection } from '../components/common/CollapsibleSection';
import { ai } from '../services/geminiService';
import { LANGUAGES } from '../data/languages';


interface Layer2ContentTabProps {
  product: Product;
  appData: AppData;
  onContentChange: (content: Layer2Content) => void;
}

const ContentBuilder: FC<{
    title: string;
    target: 'title' | 'description';
    contentBlock: Layer2ContentBlock;
    setContentBlock: (block: Layer2ContentBlock) => void;
    product: Product;
    appData: AppData;
}> = ({ title, target, contentBlock, setContentBlock, product, appData }) => {
    
    const [isRevising, setIsRevising] = useState(false);
    const [selectedRevisionTemplate, setSelectedRevisionTemplate] = useState<number | ''>('');

    const getPartValue = (part: ContentPartReference): string => {
        if (part.type === 'static') {
            return part.value || '';
        }
        
        switch (part.sourceType) {
            case 'General':
            case 'Marketing':
                // @ts-ignore
                const value = product[part.sourceKey];
                return Array.isArray(value) ? value.join(', ') : String(value || '');
            case 'Amazon': {
                const amazonContent = product.amazonContents.find(c => c.countryId === 1); // Get from Spanish content
                if (!amazonContent) return '';
                
                const currentVersion = amazonContent.versions.find(v => v.versionId === amazonContent.currentVersionId);
                if (!currentVersion) return '';

                if (part.sourceKey && part.sourceKey.startsWith('bulletPoints')) {
                    const index = parseInt(part.sourceKey.split('.')[1]);
                    return currentVersion.content.bulletPoints[index]?.text || '';
                }
                
                // @ts-ignore
                const contentValue = (currentVersion.content)[part.sourceKey];
                return contentValue || '';
            }
            case 'Composición':
                 return product.composition?.map(c => {
                    const ingredient = appData.ingredients.find(i => i.id === c.ingredientId);
                    return `${c.quantity}${ingredient?.measureUnit || 'mg'} de ${ingredient?.latinName || 'Ingrediente desconocido'}`;
                 }).join(', ') || 'Sin composición';
            default:
                return '';
        }
    }
    
    const handleRecipeChange = (recipeId: number | '') => {
        if (recipeId === '') {
            const newSpanishContent = { ...contentBlock.spanishContent, rawConcatenated: '', aiRevised: '' };
            setContentBlock({ ...contentBlock, recipeId: undefined, spanishContent: newSpanishContent });
            return;
        }
        const recipe = appData.contentRecipes.find(r => r.id === recipeId);
        if (recipe) {
            const rawConcatenated = recipe.parts.map(part => getPartValue(part)).join(' ');
            setContentBlock({ ...contentBlock, recipeId, spanishContent: {...contentBlock.spanishContent, rawConcatenated, aiRevised: '' } });
        }
    };
    
    const reviseWithAI = async () => {
        if (!contentBlock.spanishContent.rawConcatenated || !selectedRevisionTemplate) return;
        
        const template = appData.promptTemplates.find(t => t.id === selectedRevisionTemplate);
        if (!template) {
            alert('Plantilla de IA no encontrada.');
            return;
        }
        
        setIsRevising(true);
        try {
            const filledPrompt = template.template.replace('{texto_bruto}', contentBlock.spanishContent.rawConcatenated);
            
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: filledPrompt });
            setContentBlock({
                ...contentBlock,
                spanishContent: {
                    ...contentBlock.spanishContent,
                    aiRevised: response.text.trim()
                }
            });
        } catch (e) {
            console.error(e);
            alert("Ocurrió un error durante la revisión.");
        } finally {
            setIsRevising(false);
        }
    };

    return (
        <div className="bg-slate-800/60 p-4 rounded-lg border border-slate-700">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">{title}</h3>
            <CollapsibleSection title="Paso 1: Construcción y Revisión (Español)" defaultOpen>
                <div className="p-4 space-y-4">
                    <FormField label="Receta de Contenido">
                        <Select value={contentBlock.recipeId || ''} onChange={e => handleRecipeChange(Number(e.target.value) || '')}>
                            <option value="">-- Manual --</option>
                            {appData.contentRecipes.filter(r => r.target === target).map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </Select>
                    </FormField>
                    <FormField label="Contenido Bruto (Concatenado)">
                        <TextArea value={contentBlock.spanishContent.rawConcatenated} readOnly rows={4} className="bg-slate-700/50" />
                    </FormField>
                    <div className="flex items-end space-x-2">
                        <FormField label="Revisión con IA" className="flex-grow">
                            <Select value={selectedRevisionTemplate} onChange={e => setSelectedRevisionTemplate(Number(e.target.value) || '')}>
                                <option value="">Seleccionar plantilla de revisión...</option>
                                {appData.promptTemplates.filter(t => t.category === 'Revisión').map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </Select>
                        </FormField>
                        <button onClick={reviseWithAI} disabled={isRevising || !selectedRevisionTemplate || !contentBlock.spanishContent.rawConcatenated} className="px-4 py-2 bg-cyan-500 text-slate-900 font-semibold rounded-md hover:bg-cyan-600 disabled:opacity-50 h-10">
                            <Icon name={isRevising ? 'spinner' : 'wand-magic-sparkles'} className={isRevising ? 'fa-spin' : ''} />
                        </button>
                    </div>
                     {contentBlock.spanishContent.aiRevised && (
                        <FormField label="Versión Revisada por IA">
                             <TextArea value={contentBlock.spanishContent.aiRevised} readOnly rows={4} className="bg-slate-700/50" />
                        </FormField>
                    )}
                     <FormField label="Versión Final (Editable)">
                        <TextArea
                            value={contentBlock.spanishContent.finalVersion}
                            onChange={e => setContentBlock({ ...contentBlock, spanishContent: { ...contentBlock.spanishContent, finalVersion: e.target.value } })}
                            rows={4}
                        />
                    </FormField>
                </div>
            </CollapsibleSection>
        </div>
    );
};

export const Layer2ContentTab: FC<Layer2ContentTabProps> = ({ product, appData, onContentChange }) => {
    const content = useMemo(() => product.layer2Content || {
        title: { spanishContent: { rawConcatenated: '', finalVersion: '' }, translations: [] },
        description: { spanishContent: { rawConcatenated: '', finalVersion: '' }, translations: [] }
    }, [product.layer2Content]);

    const handleBlockChange = (target: 'title' | 'description', block: Layer2ContentBlock) => {
        onContentChange({ ...content, [target]: block });
    };

    return (
        <div className="space-y-6">
            <ContentBuilder
                title="Constructor de Título"
                target="title"
                contentBlock={content.title}
                setContentBlock={(block) => handleBlockChange('title', block)}
                product={product}
                appData={appData}
            />
            <ContentBuilder
                title="Constructor de Descripción"
                target="description"
                contentBlock={content.description}
                setContentBlock={(block) => handleBlockChange('description', block)}
                product={product}
                appData={appData}
            />
        </div>
    );
};
