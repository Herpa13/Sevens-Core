"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Layer2ContentTab = void 0;
const react_1 = __importStar(require("react"));
const FormField_1 = require("../components/common/FormField");
const Select_1 = require("../components/common/Select");
const TextArea_1 = require("../components/common/TextArea");
const Icon_1 = require("../components/common/Icon");
const CollapsibleSection_1 = require("../components/common/CollapsibleSection");
const geminiService_1 = require("../services/geminiService");
const ContentBuilder = ({ title, target, contentBlock, setContentBlock, product, appData }) => {
    const [isRevising, setIsRevising] = (0, react_1.useState)(false);
    const [selectedRevisionTemplate, setSelectedRevisionTemplate] = (0, react_1.useState)('');
    const getPartValue = (part) => {
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
                if (!amazonContent)
                    return '';
                const currentVersion = amazonContent.versions.find(v => v.versionId === amazonContent.currentVersionId);
                if (!currentVersion)
                    return '';
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
    };
    const handleRecipeChange = (recipeId) => {
        if (recipeId === '') {
            const newSpanishContent = { ...contentBlock.spanishContent, rawConcatenated: '', aiRevised: '' };
            setContentBlock({ ...contentBlock, recipeId: undefined, spanishContent: newSpanishContent });
            return;
        }
        const recipe = appData.contentRecipes.find(r => r.id === recipeId);
        if (recipe) {
            const rawConcatenated = recipe.parts.map(part => getPartValue(part)).join(' ');
            setContentBlock({ ...contentBlock, recipeId, spanishContent: { ...contentBlock.spanishContent, rawConcatenated, aiRevised: '' } });
        }
    };
    const reviseWithAI = async () => {
        if (!contentBlock.spanishContent.rawConcatenated || !selectedRevisionTemplate)
            return;
        const template = appData.promptTemplates.find(t => t.id === selectedRevisionTemplate);
        if (!template) {
            alert('Plantilla de IA no encontrada.');
            return;
        }
        setIsRevising(true);
        try {
            const filledPrompt = template.template.replace('{texto_bruto}', contentBlock.spanishContent.rawConcatenated);
            const response = await geminiService_1.ai.models.generateContent({ model: 'gemini-2.5-flash', contents: filledPrompt });
            setContentBlock({
                ...contentBlock,
                spanishContent: {
                    ...contentBlock.spanishContent,
                    aiRevised: response.text.trim()
                }
            });
        }
        catch (e) {
            console.error(e);
            alert("Ocurrió un error durante la revisión.");
        }
        finally {
            setIsRevising(false);
        }
    };
    return (<div className="bg-slate-800/60 p-4 rounded-lg border border-slate-700">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">{title}</h3>
            <CollapsibleSection_1.CollapsibleSection title="Paso 1: Construcción y Revisión (Español)" defaultOpen>
                <div className="p-4 space-y-4">
                    <FormField_1.FormField label="Receta de Contenido">
                        <Select_1.Select value={contentBlock.recipeId || ''} onChange={e => handleRecipeChange(Number(e.target.value) || '')}>
                            <option value="">-- Manual --</option>
                            {appData.contentRecipes.filter(r => r.target === target).map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </Select_1.Select>
                    </FormField_1.FormField>
                    <FormField_1.FormField label="Contenido Bruto (Concatenado)">
                        <TextArea_1.TextArea value={contentBlock.spanishContent.rawConcatenated} readOnly rows={4} className="bg-slate-700/50"/>
                    </FormField_1.FormField>
                    <div className="flex items-end space-x-2">
                        <FormField_1.FormField label="Revisión con IA" className="flex-grow">
                            <Select_1.Select value={selectedRevisionTemplate} onChange={e => setSelectedRevisionTemplate(Number(e.target.value) || '')}>
                                <option value="">Seleccionar plantilla de revisión...</option>
                                {appData.promptTemplates.filter(t => t.category === 'Revisión').map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </Select_1.Select>
                        </FormField_1.FormField>
                        <button onClick={reviseWithAI} disabled={isRevising || !selectedRevisionTemplate || !contentBlock.spanishContent.rawConcatenated} className="px-4 py-2 bg-cyan-500 text-slate-900 font-semibold rounded-md hover:bg-cyan-600 disabled:opacity-50 h-10">
                            <Icon_1.Icon name={isRevising ? 'spinner' : 'wand-magic-sparkles'} className={isRevising ? 'fa-spin' : ''}/>
                        </button>
                    </div>
                     {contentBlock.spanishContent.aiRevised && (<FormField_1.FormField label="Versión Revisada por IA">
                             <TextArea_1.TextArea value={contentBlock.spanishContent.aiRevised} readOnly rows={4} className="bg-slate-700/50"/>
                        </FormField_1.FormField>)}
                     <FormField_1.FormField label="Versión Final (Editable)">
                        <TextArea_1.TextArea value={contentBlock.spanishContent.finalVersion} onChange={e => setContentBlock({ ...contentBlock, spanishContent: { ...contentBlock.spanishContent, finalVersion: e.target.value } })} rows={4}/>
                    </FormField_1.FormField>
                </div>
            </CollapsibleSection_1.CollapsibleSection>
        </div>);
};
const Layer2ContentTab = ({ product, appData, onContentChange }) => {
    const content = (0, react_1.useMemo)(() => product.layer2Content || {
        title: { spanishContent: { rawConcatenated: '', finalVersion: '' }, translations: [] },
        description: { spanishContent: { rawConcatenated: '', finalVersion: '' }, translations: [] }
    }, [product.layer2Content]);
    const handleBlockChange = (target, block) => {
        onContentChange({ ...content, [target]: block });
    };
    return (<div className="space-y-6">
            <ContentBuilder title="Constructor de Título" target="title" contentBlock={content.title} setContentBlock={(block) => handleBlockChange('title', block)} product={product} appData={appData}/>
            <ContentBuilder title="Constructor de Descripción" target="description" contentBlock={content.description} setContentBlock={(block) => handleBlockChange('description', block)} product={product} appData={appData}/>
        </div>);
};
exports.Layer2ContentTab = Layer2ContentTab;
