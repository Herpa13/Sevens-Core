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
exports.VideoProjectDetailView = void 0;
const react_1 = __importStar(require("react"));
const FormField_1 = require("../components/common/FormField");
const TextInput_1 = require("../components/common/TextInput");
const TextArea_1 = require("../components/common/TextArea");
const Select_1 = require("../components/common/Select");
const Icon_1 = require("../components/common/Icon");
const CollapsibleSection_1 = require("../components/common/CollapsibleSection");
const KeywordManager_1 = require("../components/common/KeywordManager");
const geminiService_1 = require("../services/geminiService");
const SelectPromptTemplateModal_1 = require("../components/modals/SelectPromptTemplateModal");
const AddSequenceModal_1 = require("../components/modals/AddSequenceModal");
const SaveSequenceToLibraryModal_1 = require("../components/modals/SaveSequenceToLibraryModal");
const CountrySelector_1 = require("../components/common/CountrySelector");
const languages_1 = require("../data/languages");
const lodash_es_1 = require("lodash-es");
const NotesSection_1 = require("../components/common/NotesSection");
const MiniFieldDisplay = ({ label, value }) => {
    if (!value || (Array.isArray(value) && value.length === 0)) {
        return null;
    }
    const textValue = Array.isArray(value) ? value.join('\n') : value;
    const copyToClipboard = () => {
        navigator.clipboard.writeText(textValue).catch(err => console.error("Failed to copy text:", err));
    };
    return (<div className="group relative py-1.5 border-b border-slate-600/50 last:border-b-0">
            <h5 className="text-xs font-bold uppercase text-slate-400 mb-1">{label}</h5>
            {Array.isArray(value) ? (<ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                    {value.map((item, index) => <li key={index}>{item}</li>)}
                </ul>) : (<p className="text-sm text-slate-300 whitespace-pre-wrap">{value}</p>)}
            <button onClick={copyToClipboard} className="absolute top-1 right-0 text-cyan-400 hover:text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity p-1" title={`Copiar ${label}`}>
                <Icon_1.Icon name="copy"/>
            </button>
        </div>);
};
const LinkedProductInspector = ({ product, countryId, appData }) => {
    const regulatoryInfo = (0, react_1.useMemo)(() => {
        if (!product || !countryId || !product.composition) {
            return { claims: [], disclaimers: [] };
        }
        const allClaims = new Set();
        const allDisclaimers = new Set();
        product.composition.forEach(item => {
            const ingredient = appData.ingredients.find(i => i.id === item.ingredientId);
            const countryDetail = ingredient?.countryDetails.find(cd => cd.countryId === countryId);
            countryDetail?.permittedClaims.forEach(claim => allClaims.add(claim));
            countryDetail?.labelDisclaimers.forEach(disclaimer => allDisclaimers.add(disclaimer));
        });
        return { claims: Array.from(allClaims), disclaimers: Array.from(allDisclaimers) };
    }, [product, countryId, appData.ingredients]);
    if (!product) {
        return null;
    }
    return (<div className="mt-4 pt-4 border-t border-slate-600">
             <h3 className="text-base font-bold text-slate-200 mb-2">
                Resumen del Producto: <span className="text-cyan-400">{product.name}</span>
             </h3>
             <div className="space-y-1">
                <CollapsibleSection_1.CollapsibleSection title="Mensaje Clave">
                    <div className="p-1 space-y-1">
                        <MiniFieldDisplay label="Público Objetivo" value={product.publicoObjetivo}/>
                        <MiniFieldDisplay label="Key Selling Points" value={product.keySellingPoints}/>
                        <MiniFieldDisplay label="Mini Narrativa" value={product.miniNarrativa}/>
                    </div>
                </CollapsibleSection_1.CollapsibleSection>

                <CollapsibleSection_1.CollapsibleSection title="Contenido de Soporte">
                     <div className="p-1 space-y-1">
                        <MiniFieldDisplay label="Beneficios Genéricos" value={product.beneficiosGenericos}/>
                        <MiniFieldDisplay label="Sugerencias de Uso" value={product.sugerenciasUso}/>
                    </div>
                </CollapsibleSection_1.CollapsibleSection>
                
                <CollapsibleSection_1.CollapsibleSection title="Regulatorio (Auto)">
                    <div className="p-1 space-y-1">
                        <MiniFieldDisplay label="Alegaciones Permitidas" value={regulatoryInfo.claims}/>
                        <MiniFieldDisplay label="Advertencias de Etiqueta" value={regulatoryInfo.disclaimers}/>
                    </div>
                </CollapsibleSection_1.CollapsibleSection>
             </div>
        </div>);
};
const SequenceCard = ({ sequence, index, onUpdate, appData, onSaveToLibrary }) => {
    const [isGenerating, setIsGenerating] = (0, react_1.useState)(false);
    const [promptModalState, setPromptModalState] = (0, react_1.useState)({ open: false, type: null, category: null });
    const handleFieldChange = (field, value) => {
        onUpdate(sequence.id, { [field]: value });
    };
    const handleNestedChange = (area, field, value) => {
        onUpdate(sequence.id, { [area]: { ...sequence[area], [field]: value } });
    };
    const handleGeneratePrompt = async (templateId) => {
        const { type } = promptModalState;
        if (!type)
            return;
        const sourceText = sequence[type].userDescription;
        if (!sourceText) {
            alert('Por favor, escribe primero una descripción.');
            return;
        }
        const template = appData.promptTemplates.find(t => t.id === templateId);
        if (!template) {
            alert(`No se encontró la plantilla de IA.`);
            return;
        }
        setPromptModalState({ open: false, type: null, category: null });
        setIsGenerating(true);
        try {
            const context = { user_description: sourceText };
            const result = await (0, geminiService_1.generateContentFromTemplate)(template, context, appData);
            handleNestedChange(type, 'finalPrompt', result);
        }
        catch (error) {
            console.error("Error generating prompt:", error);
            alert("Hubo un error al generar el prompt con IA.");
        }
        finally {
            setIsGenerating(false);
        }
    };
    const isFromArchive = !!sequence.mediaAssetId;
    const canSaveToLibrary = !!sequence.image.sourceUrl && !!sequence.video.sourceUrl;
    return (<>
            {promptModalState.open && promptModalState.category && (<SelectPromptTemplateModal_1.SelectPromptTemplateModal appData={appData} category={promptModalState.category} onClose={() => setPromptModalState({ open: false, type: null, category: null })} onSelect={handleGeneratePrompt}/>)}
            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField_1.FormField label="1. Guion (Voz en Off)">
                        <TextArea_1.TextArea value={sequence.voiceoverScript} onChange={(e) => handleFieldChange('voiceoverScript', e.target.value)} rows={4}/>
                    </FormField_1.FormField>
                    <FormField_1.FormField label="2. Duración (s)">
                        <TextInput_1.TextInput type="number" value={sequence.duration} onChange={(e) => handleFieldChange('duration', Number(e.target.value))}/>
                    </FormField_1.FormField>
                    
                    {!isFromArchive ? (<>
                            <div className="md:col-span-2 space-y-3 p-3 border border-slate-700 rounded-md">
                                <FormField_1.FormField label="3. Tu idea para la imagen de partida">
                                    <TextArea_1.TextArea value={sequence.image.userDescription} onChange={(e) => handleNestedChange('image', 'userDescription', e.target.value)} rows={2}/>
                                </FormField_1.FormField>
                                <div className="flex items-start space-x-2">
                                    <FormField_1.FormField label="4. Prompt Final para Imagen (Generado por IA)" className="flex-grow">
                                        <TextArea_1.TextArea value={sequence.image.finalPrompt} onChange={(e) => handleNestedChange('image', 'finalPrompt', e.target.value)} rows={3} className="font-mono text-xs"/>
                                    </FormField_1.FormField>
                                    <button onClick={() => setPromptModalState({ open: true, type: 'image', category: 'Generación de Prompt de Imagen' })} disabled={isGenerating} className="px-3 py-2 bg-cyan-500 text-slate-900 font-semibold rounded-md hover:bg-cyan-600 disabled:opacity-50 mt-5">
                                    <Icon_1.Icon name={isGenerating ? 'spinner' : 'wand-magic-sparkles'} className={isGenerating ? 'fa-spin' : ''}/>
                                    </button>
                                </div>
                            </div>

                            <div className="md:col-span-2 space-y-3 p-3 border border-slate-700 rounded-md">
                                <FormField_1.FormField label="5. Tu idea para la animación">
                                    <TextArea_1.TextArea value={sequence.video.userDescription} onChange={(e) => handleNestedChange('video', 'userDescription', e.target.value)} rows={2}/>
                                </FormField_1.FormField>
                                <div className="flex items-start space-x-2">
                                    <FormField_1.FormField label="6. Prompt Final para Animación (Generado por IA)" className="flex-grow">
                                        <TextArea_1.TextArea value={sequence.video.finalPrompt} onChange={(e) => handleNestedChange('video', 'finalPrompt', e.target.value)} rows={3} className="font-mono text-xs"/>
                                    </FormField_1.FormField>
                                    <button onClick={() => setPromptModalState({ open: true, type: 'video', category: 'Generación de Prompt de Vídeo' })} disabled={isGenerating} className="px-3 py-2 bg-cyan-500 text-slate-900 font-semibold rounded-md hover:bg-cyan-600 disabled:opacity-50 mt-5">
                                        <Icon_1.Icon name={isGenerating ? 'spinner' : 'wand-magic-sparkles'} className={isGenerating ? 'fa-spin' : ''}/>
                                    </button>
                                </div>
                            </div>
                        </>) : null}

                    <div className="md:col-span-2 space-y-3 p-3 border border-slate-700 rounded-md">
                        <h5 className="text-sm font-semibold text-slate-300">7. URLs de Medios Finales</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField_1.FormField label="URL Imagen Final">
                                <TextInput_1.TextInput value={sequence.image.sourceUrl || ''} onChange={(e) => handleNestedChange('image', 'sourceUrl', e.target.value)} placeholder="Pegar URL de la imagen..." readOnly={isFromArchive}/>
                            </FormField_1.FormField>
                             <FormField_1.FormField label="URL Vídeo Final">
                                <TextInput_1.TextInput value={sequence.video.sourceUrl || ''} onChange={(e) => handleNestedChange('video', 'sourceUrl', e.target.value)} placeholder="Pegar URL del vídeo..." readOnly={isFromArchive}/>
                            </FormField_1.FormField>
                        </div>
                    </div>
                </div>
            </div>
        </>);
};
const VideoProjectDetailView = ({ initialData, onSave, onDelete, onCancel, appData, onEntitySave, onSelectItem, setIsDirty, setSaveHandler, onNoteAdd, onNoteUpdate, onNoteDelete }) => {
    const [data, setData] = (0, react_1.useState)(initialData);
    const [openSequenceIds, setOpenSequenceIds] = (0, react_1.useState)(initialData.sequences.length > 0 ? [initialData.sequences[0].id] : []);
    const [isAddSequenceModalOpen, setIsAddSequenceModalOpen] = (0, react_1.useState)(false);
    const [isSaveToLibraryModalOpen, setIsSaveToLibraryModalOpen] = (0, react_1.useState)(false);
    const [sequenceToSave, setSequenceToSave] = (0, react_1.useState)(null);
    const [draggedItemId, setDraggedItemId] = (0, react_1.useState)(null);
    const handleSaveClick = (0, react_1.useCallback)((onSuccess) => {
        if (data.status === 'Acabado' && !data.globalSettings.finalVideoUrl?.trim()) {
            alert('Debes introducir la URL del vídeo acabado para marcar el proyecto como "Acabado".');
            return;
        }
        onSave({ ...data, updatedAt: new Date().toISOString() });
        if (onSuccess)
            onSuccess();
    }, [data, onSave]);
    (0, react_1.useEffect)(() => {
        setData(initialData);
    }, [initialData]);
    (0, react_1.useEffect)(() => {
        setIsDirty(!(0, lodash_es_1.isEqual)(initialData, data));
    }, [data, initialData, setIsDirty]);
    (0, react_1.useEffect)(() => {
        setSaveHandler(handleSaveClick);
        return () => setSaveHandler(null);
    }, [handleSaveClick, setSaveHandler]);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    };
    const handleSequenceUpdate = (sequenceId, updatedFields) => {
        setData(p => ({
            ...p,
            sequences: p.sequences.map(s => s.id === sequenceId ? { ...s, ...updatedFields } : s)
        }));
    };
    const reorderSequences = (sequences) => {
        return sequences.map((seq, index) => ({ ...seq, order: index }));
    };
    const addSequence = (newSequenceData) => {
        const sequence = {
            id: `seq-${Date.now()}`,
            order: data.sequences.length,
            transitionToNext: 'Corte',
            duration: 5,
            voiceoverScript: '',
            image: { userDescription: '', finalPrompt: '', sourceUrl: '' },
            video: { userDescription: '', finalPrompt: '', sourceUrl: '' },
            ...newSequenceData
        };
        setData(p => ({ ...p, sequences: reorderSequences([...p.sequences, sequence]) }));
        setIsAddSequenceModalOpen(false);
    };
    const addBlankSequence = () => {
        addSequence({});
    };
    const handleDragStart = (e, sequenceId) => {
        e.dataTransfer.setData('sequenceId', sequenceId);
        setDraggedItemId(sequenceId);
    };
    const handleDrop = (e, targetSequenceId) => {
        e.preventDefault();
        const draggedId = e.dataTransfer.getData('sequenceId');
        if (draggedId && draggedId !== targetSequenceId) {
            let newSequences = [...data.sequences];
            const draggedIndex = newSequences.findIndex(s => s.id === draggedId);
            const targetIndex = newSequences.findIndex(s => s.id === targetSequenceId);
            const [draggedItem] = newSequences.splice(draggedIndex, 1);
            newSequences.splice(targetIndex, 0, draggedItem);
            setData(p => ({ ...p, sequences: reorderSequences(newSequences) }));
        }
        setDraggedItemId(null);
        e.currentTarget.closest('.drop-zone')?.classList.remove('border-cyan-500');
    };
    const handleDragOver = (e) => {
        e.preventDefault();
        e.currentTarget.closest('.drop-zone')?.classList.add('border-cyan-500');
    };
    const handleDragLeave = (e) => {
        e.preventDefault();
        e.currentTarget.closest('.drop-zone')?.classList.remove('border-cyan-500');
    };
    const handleOpenSaveToLibraryModal = (sequence) => {
        setSequenceToSave(sequence);
        setIsSaveToLibraryModalOpen(true);
    };
    const handleSaveSequenceToLibrary = (assetData) => {
        onEntitySave('mediaAssets', { ...assetData, id: 'new' });
        setIsSaveToLibraryModalOpen(false);
        setSequenceToSave(null);
    };
    const product = (0, react_1.useMemo)(() => data.productId ? appData.products.find(p => p.id === data.productId) : null, [data.productId, appData.products]);
    const totalDuration = (0, react_1.useMemo)(() => data.sequences.reduce((acc, seq) => acc + (seq.duration || 0), 0), [data.sequences]);
    const handleScrollToSequence = (sequenceId) => {
        document.getElementById(`sequence-section-${sequenceId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setOpenSequenceIds(prev => prev.includes(sequenceId) ? prev : [...prev, sequenceId]);
    };
    const toggleSequenceOpen = (sequenceId) => {
        setOpenSequenceIds(prev => prev.includes(sequenceId) ? prev.filter(id => id !== sequenceId) : [...prev, sequenceId]);
    };
    const videoProjectNotes = typeof data.id === 'number' ? appData.notes.filter(n => n.entityType === 'videoProjects' && n.entityId === data.id) : [];
    const handleAddNote = (noteText, attachments) => {
        if (typeof data.id !== 'number')
            return;
        const newAttachments = attachments.map(f => ({ id: `temp-${Date.now()}`, name: f.name, url: URL.createObjectURL(f) }));
        onNoteAdd({
            entityType: 'videoProjects',
            entityId: data.id,
            text: noteText,
            attachments: newAttachments,
        });
    };
    return (<div className="bg-slate-800 rounded-lg">
            {isAddSequenceModalOpen && (<AddSequenceModal_1.AddSequenceModal appData={appData} onClose={() => setIsAddSequenceModalOpen(false)} onAdd={addSequence}/>)}
            {isSaveToLibraryModalOpen && sequenceToSave && (<SaveSequenceToLibraryModal_1.SaveSequenceToLibraryModal sequence={sequenceToSave} onClose={() => setIsSaveToLibraryModalOpen(false)} onSave={handleSaveSequenceToLibrary}/>)}
            <div className="p-4 sm:p-6 border-b border-slate-700 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-200">Vídeo: {data.name || 'Nuevo Vídeo'}</h2>
                <div className="flex space-x-2">
                    <button onClick={() => handleSaveClick()} className="px-4 py-2 bg-cyan-500 text-slate-900 rounded-md hover:bg-cyan-600 font-semibold">Guardar Cambios</button>
                    <button onClick={onCancel} className="px-4 py-2 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500 font-semibold">Cerrar</button>
                </div>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                 <div className="lg:col-span-2 space-y-4">
                     <CollapsibleSection_1.CollapsibleSection title="Planificación y Estrategia" defaultOpen>
                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <FormField_1.FormField label="Nombre del Vídeo" htmlFor="name" className="lg:col-span-3">
                                <TextInput_1.TextInput id="name" name="name" value={data.name} onChange={handleInputChange}/>
                            </FormField_1.FormField>
                            <FormField_1.FormField label="Descripción / Objetivo" htmlFor="description" className="lg:col-span-3">
                                <TextArea_1.TextArea id="description" name="description" value={data.description || ''} onChange={handleInputChange} rows={2}/>
                            </FormField_1.FormField>
                             <FormField_1.FormField label="Estado del Proyecto" htmlFor="status">
                                <Select_1.Select name="status" value={data.status} onChange={handleInputChange}>
                                    <option value="Planificación">Planificación</option>
                                    <option value="Storyboard">Storyboard</option>
                                    <option value="Revisión">Revisión</option>
                                    <option value="Acabado">Acabado</option>
                                    <option value="Publicado">Publicado</option>
                                </Select_1.Select>
                            </FormField_1.FormField>
                             <FormField_1.FormField label="Fecha Creación Prevista" htmlFor="plannedCreationDate">
                                <TextInput_1.TextInput type="date" id="plannedCreationDate" name="plannedCreationDate" value={data.plannedCreationDate || ''} onChange={handleInputChange}/>
                            </FormField_1.FormField>
                            <FormField_1.FormField label="Fecha Publicación Prevista" htmlFor="plannedPublicationDate">
                                <TextInput_1.TextInput type="date" id="plannedPublicationDate" name="plannedPublicationDate" value={data.plannedPublicationDate || ''} onChange={handleInputChange}/>
                            </FormField_1.FormField>
                            {data.status === 'Acabado' && (<FormField_1.FormField label="URL del Vídeo Acabado" htmlFor="finalVideoUrl" className="lg:col-span-3">
                                    <TextInput_1.TextInput id="finalVideoUrl" name="finalVideoUrl" value={data.globalSettings.finalVideoUrl || ''} onChange={e => setData(p => ({ ...p, globalSettings: { ...p.globalSettings, finalVideoUrl: e.target.value } }))} placeholder="https://..."/>
                                </FormField_1.FormField>)}
                             <FormField_1.FormField label="Etiquetas (Plataformas, Campañas...)" htmlFor="tags" className="lg:col-span-3">
                               <KeywordManager_1.KeywordManager keywords={data.tags || []} onChange={tags => setData(p => ({ ...p, tags }))}/>
                            </FormField_1.FormField>
                             <FormField_1.FormField label="País Principal" htmlFor="countryId">
                                <CountrySelector_1.CountrySelector countries={appData.countries} selectedCountryId={data.countryId} onChange={(id) => setData(p => ({ ...p, countryId: id }))}/>
                            </FormField_1.FormField>
                            <FormField_1.FormField label="Idioma Principal" htmlFor="languageCode">
                                <Select_1.Select name="languageCode" value={data.languageCode || ''} onChange={handleInputChange}>
                                    <option value="">Seleccionar idioma</option>
                                    {languages_1.LANGUAGES.map(lang => <option key={lang.code} value={lang.code}>{lang.name}</option>)}
                                </Select_1.Select>
                            </FormField_1.FormField>
                        </div>
                    </CollapsibleSection_1.CollapsibleSection>
                    
                    <CollapsibleSection_1.CollapsibleSection title="Notas">
                         <div className="p-4">
                            {typeof data.id === 'number' ? (<NotesSection_1.NotesSection notes={videoProjectNotes} onAddNote={handleAddNote} onUpdateNote={onNoteUpdate} onDeleteNote={onNoteDelete}/>) : (<p className="text-slate-500 text-center py-4">Guarda el proyecto para poder añadir notas.</p>)}
                         </div>
                    </CollapsibleSection_1.CollapsibleSection>

                    <div className="mt-2 space-y-4">
                        {data.sequences.map((seq, index) => (<div key={seq.id} className="drop-zone border-2 border-transparent rounded-lg">
                                <CollapsibleSection_1.CollapsibleSection id={`sequence-section-${seq.id}`} title={<div draggable onDragStart={(e) => handleDragStart(e, seq.id)} onDrop={(e) => handleDrop(e, seq.id)} onDragOver={handleDragOver} onDragLeave={handleDragLeave} className="flex items-center w-full" onClick={(e) => e.stopPropagation()} // Prevent collapse on drag
            >
                                            <Icon_1.Icon name="grip-vertical" className="cursor-grab active:cursor-grabbing text-slate-500 mr-3"/>
                                            <div className="flex-grow flex items-center">
                                                {seq.mediaAssetId && <Icon_1.Icon name="film" className="text-cyan-400 mr-2" title="Desde Archivo"/>}
                                                <span className="font-bold">Secuencia #{index + 1} {seq.mediaAssetId ? '(Archivo)' : ''}:</span>
                                                <span className="font-normal text-slate-400 ml-2 truncate">"{seq.voiceoverScript.substring(0, 40)}..."</span>
                                            </div>
                                             <button onClick={(e) => { e.stopPropagation(); handleOpenSaveToLibraryModal(seq); }} disabled={!seq.image.sourceUrl || !seq.video.sourceUrl} title="Guardar en Biblioteca de Medios" className="p-1.5 text-slate-400 hover:text-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed rounded-md hover:bg-slate-600 mr-2">
                                                <Icon_1.Icon name="save"/>
                                            </button>
                                        </div>} isOpen={openSequenceIds.includes(seq.id)} onToggle={() => toggleSequenceOpen(seq.id)}>
                                    <SequenceCard sequence={seq} index={index} onUpdate={handleSequenceUpdate} appData={appData} onSaveToLibrary={handleOpenSaveToLibraryModal}/>
                                </CollapsibleSection_1.CollapsibleSection>
                            </div>))}
                    </div>

                    <div className="mt-4 flex justify-center space-x-2">
                        <button onClick={() => setIsAddSequenceModalOpen(true)} className="px-4 py-2 border border-dashed border-slate-600 text-slate-300 rounded-md hover:bg-slate-700 text-sm">
                            <Icon_1.Icon name="plus" className="mr-2"/>
                            Añadir Secuencia al Storyboard
                        </button>
                         <button onClick={addBlankSequence} className="px-4 py-2 border border-dashed border-slate-600 text-slate-300 rounded-md hover:bg-slate-700 text-sm">
                            <Icon_1.Icon name="plus-square" className="mr-2"/>
                            Añadir Secuencia en Blanco
                        </button>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="sticky top-6 bg-slate-700/50 p-4 rounded-lg border border-slate-600">
                        <h3 className="text-lg font-bold text-slate-200 mb-1">{data.name}</h3>
                        {data.description && <p className="text-sm text-slate-400 mb-3 italic">{data.description}</p>}
                        
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-300 border-t border-b border-slate-600 py-2 mb-3">
                           <div className="flex items-center" title="Estado"><Icon_1.Icon name="tag" className="mr-1.5 text-slate-400"/> {data.status}</div>
                           {data.plannedCreationDate && <div className="flex items-center" title="Fecha Creación"><Icon_1.Icon name="pencil-ruler" className="mr-1.5 text-slate-400"/> {new Date(data.plannedCreationDate + 'T00:00:00').toLocaleDateString()}</div>}
                           {data.plannedPublicationDate && <div className="flex items-center" title="Fecha Publicación"><Icon_1.Icon name="rocket" className="mr-1.5 text-slate-400"/> {new Date(data.plannedPublicationDate + 'T00:00:00').toLocaleDateString()}</div>}
                           {data.countryId && <div className="flex items-center" title="País"><Icon_1.Icon name="globe" className="mr-1.5 text-slate-400"/> {appData.countries.find(c => c.id === data.countryId)?.name}</div>}
                           {data.languageCode && <div className="flex items-center" title="Idioma"><Icon_1.Icon name="language" className="mr-1.5 text-slate-400"/> {data.languageCode}</div>}
                           <div className="flex flex-wrap items-center gap-1 w-full">
                             {data.tags?.map(tag => <span key={tag} className="bg-slate-600 px-1.5 py-0.5 rounded">{tag}</span>)}
                           </div>
                        </div>

                        {product && (<p className="flex items-center text-sm mb-2">
                                <Icon_1.Icon name="box-open" className="mr-2 text-slate-400"/>
                                <strong>Producto:</strong><span className="ml-2 text-slate-300">{product.name}</span>
                            </p>)}
                        <p className="flex items-center text-sm mb-4">
                            <Icon_1.Icon name="clock" className="mr-2 text-slate-400"/>
                            <strong>Duración Total:</strong><span className="ml-2 text-slate-300">{totalDuration}s</span>
                        </p>
                        
                        <h4 className="font-semibold text-slate-300 border-t border-slate-600 pt-3">Guion Gráfico</h4>
                        <ul className="mt-2 space-y-1 max-h-60 overflow-y-auto">
                            {data.sequences.map((seq, index) => (<li key={seq.id} draggable onDragStart={(e) => handleDragStart(e, seq.id)} onDrop={(e) => handleDrop(e, seq.id)} onDragOver={handleDragOver} onDragLeave={handleDragLeave} className="drop-zone p-1.5 rounded-md hover:bg-slate-700 transition-all border-2 border-transparent">
                                    <div className="flex items-start">
                                        <Icon_1.Icon name="grip-vertical" className="text-slate-500 mr-2 mt-1 cursor-grab active:cursor-grabbing flex-shrink-0"/>
                                        <div className="flex-grow cursor-pointer" onClick={() => handleScrollToSequence(seq.id)}>
                                            <div className="flex items-center text-sm text-cyan-400">
                                                {seq.mediaAssetId && <Icon_1.Icon name="film" className="mr-1.5" title="Desde Archivo"/>}
                                                Secuencia #{index + 1} <span className="font-normal text-slate-400 ml-2">({seq.duration}s)</span>
                                            </div>
                                            <p className="text-xs text-slate-400 mt-0.5 pr-2 whitespace-pre-wrap">
                                                {seq.voiceoverScript ? `"${seq.voiceoverScript}"` : <i className="text-slate-500">Sin guion</i>}
                                            </p>
                                        </div>
                                    </div>
                                </li>))}
                        </ul>
                         <LinkedProductInspector product={product} countryId={data.countryId} appData={appData}/>
                    </div>
                </div>
            </div>
        </div>);
};
exports.VideoProjectDetailView = VideoProjectDetailView;
