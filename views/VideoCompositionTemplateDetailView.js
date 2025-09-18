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
exports.VideoCompositionTemplateDetailView = void 0;
const react_1 = __importStar(require("react"));
const FormField_1 = require("../components/common/FormField");
const TextInput_1 = require("../components/common/TextInput");
const TextArea_1 = require("../components/common/TextArea");
const Icon_1 = require("../components/common/Icon");
const lodash_es_1 = require("lodash-es");
const DraggableSequenceTemplate = ({ template, onDragStart }) => (<div draggable onDragStart={(e) => onDragStart(e, template.id)} className="p-3 bg-slate-800/60 rounded-lg border border-slate-700 cursor-grab active:cursor-grabbing">
        <h5 className="font-bold text-cyan-400 text-sm">{template.name}</h5>
        <p className="text-xs text-slate-400">{template.description}</p>
    </div>);
const DroppedSequenceTemplate = ({ template, onRemove, onDragStart, onDrop }) => {
    return (<div draggable onDragStart={onDragStart} onDrop={onDrop} onDragOver={(e) => e.preventDefault()} className="flex items-center justify-between p-2 bg-slate-700 rounded-md">
            <div className="flex items-center">
                <Icon_1.Icon name="grip-vertical" className="mr-3 text-slate-500 cursor-grab active:cursor-grabbing"/>
                <div>
                    <span className="text-sm font-semibold text-slate-200">{template.name}</span>
                    <span className="text-xs text-slate-400 ml-2">({template.category})</span>
                </div>
            </div>
            <button onClick={onRemove} className="text-red-400 hover:text-red-300"><Icon_1.Icon name="trash"/></button>
        </div>);
};
const VideoCompositionTemplateDetailView = ({ initialData, onSave, onDelete, onCancel, appData, setIsDirty, setSaveHandler }) => {
    const [data, setData] = (0, react_1.useState)(initialData);
    const [dragOver, setDragOver] = (0, react_1.useState)(false);
    const [draggedItemId, setDraggedItemId] = (0, react_1.useState)(null);
    const handleSaveClick = (0, react_1.useCallback)((onSuccess) => {
        onSave(data);
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
    const compositionSequences = (0, react_1.useMemo)(() => {
        return data.sequenceTemplateIds
            .map(id => appData.sequenceTemplates.find(t => t.id === id))
            .filter((t) => t !== undefined);
    }, [data.sequenceTemplateIds, appData.sequenceTemplates]);
    const onDragStartSource = (e, templateId) => {
        e.dataTransfer.setData("application/json", JSON.stringify({ id: templateId, from: 'source' }));
    };
    const onDragStartCanvas = (e, templateId) => {
        e.dataTransfer.setData("application/json", JSON.stringify({ id: templateId, from: 'canvas' }));
        setDraggedItemId(templateId);
    };
    const onDrop = (e) => {
        e.preventDefault();
        const dropData = JSON.parse(e.dataTransfer.getData("application/json"));
        if (dropData.from === 'source') {
            setData(prev => ({ ...prev, sequenceTemplateIds: [...prev.sequenceTemplateIds, dropData.id] }));
        }
        setDragOver(false);
    };
    const onDropOnItem = (e, targetId) => {
        e.preventDefault();
        e.stopPropagation();
        const dropData = JSON.parse(e.dataTransfer.getData("application/json"));
        if (dropData.from === 'canvas' && draggedItemId && draggedItemId !== targetId) {
            const sequenceIds = [...data.sequenceTemplateIds];
            const draggedIndex = sequenceIds.indexOf(draggedItemId);
            const targetIndex = sequenceIds.indexOf(targetId);
            const [draggedItem] = sequenceIds.splice(draggedIndex, 1);
            sequenceIds.splice(targetIndex, 0, draggedItem);
            setData(prev => ({ ...prev, sequenceTemplateIds: sequenceIds }));
        }
        setDraggedItemId(null);
    };
    const removeSequence = (idToRemove) => {
        setData(prev => ({
            ...prev,
            sequenceTemplateIds: prev.sequenceTemplateIds.filter(id => id !== idToRemove)
        }));
    };
    const handleDeleteClick = () => (typeof data.id === 'number' ? onDelete(data.id) : undefined);
    return (<div className="bg-slate-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-slate-200 mb-6">{data.id === 'new' ? 'Nueva Plantilla de Vídeo' : `Editando Plantilla: ${initialData.name}`}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <FormField_1.FormField label="Nombre de la Plantilla" htmlFor="name">
          <TextInput_1.TextInput id="name" name="name" value={data.name} onChange={handleInputChange}/>
        </FormField_1.FormField>
        <FormField_1.FormField label="Descripción" htmlFor="description">
          <TextArea_1.TextArea id="description" name="description" value={data.description} onChange={handleInputChange} rows={2}/>
        </FormField_1.FormField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
            <h3 className="text-lg font-semibold text-slate-300 mb-3">Biblioteca de Secuencias</h3>
            <div className="space-y-2 p-3 bg-slate-900/50 rounded-lg max-h-96 overflow-y-auto">
                {appData.sequenceTemplates.map(template => (<DraggableSequenceTemplate key={template.id} template={template} onDragStart={onDragStartSource}/>))}
            </div>
        </div>
        <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-slate-300 mb-3">Estructura del Vídeo</h3>
             <div onDrop={onDrop} onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} className={`p-4 min-h-[300px] border-2 border-dashed rounded-lg transition-colors ${dragOver ? 'border-cyan-500 bg-slate-700/50' : 'border-slate-600'}`}>
                {compositionSequences.length === 0 ? (<div className="text-center text-slate-500 flex flex-col items-center justify-center h-full">
                        <Icon_1.Icon name="hand-point-up" className="text-3xl mb-2"/>
                        <p>Arrastra las secuencias desde la biblioteca hasta aquí para construir tu vídeo.</p>
                    </div>) : (<div className="space-y-2">
                        {compositionSequences.map((template, index) => (<DroppedSequenceTemplate key={`${template.id}-${index}`} template={template} onRemove={() => removeSequence(template.id)} onDragStart={(e) => onDragStartCanvas(e, template.id)} onDrop={(e) => onDropOnItem(e, template.id)}/>))}
                    </div>)}
            </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end space-x-4">
        {data.id !== 'new' && <button onClick={handleDeleteClick} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 font-semibold">Eliminar</button>}
        <button onClick={onCancel} className="px-4 py-2 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500 font-semibold">Cancelar</button>
        <button onClick={() => handleSaveClick()} className="px-4 py-2 bg-cyan-500 text-slate-900 rounded-md hover:bg-cyan-600 font-semibold">Guardar Plantilla</button>
      </div>
    </div>);
};
exports.VideoCompositionTemplateDetailView = VideoCompositionTemplateDetailView;
