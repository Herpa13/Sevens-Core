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
exports.ContentRecipeDetailView = void 0;
const react_1 = __importStar(require("react"));
const FormField_1 = require("../components/common/FormField");
const TextInput_1 = require("../components/common/TextInput");
const Select_1 = require("../components/common/Select");
const Icon_1 = require("../components/common/Icon");
const lodash_es_1 = require("lodash-es");
const AVAILABLE_PARTS = [
    { sourceType: 'General', sourceKey: 'name' },
    { sourceType: 'General', sourceKey: 'format' },
    { sourceType: 'General', sourceKey: 'units' },
    { sourceType: 'General', sourceKey: 'modoUso' },
    { sourceType: 'General', sourceKey: 'beneficiosGenericos' },
    { sourceType: 'Marketing', sourceKey: 'puntosFuertes' },
    { sourceType: 'Marketing', sourceKey: 'miniNarrativa' },
    { sourceType: 'Marketing', sourceKey: 'sugerenciasUso' },
    { sourceType: 'Amazon', sourceKey: 'title' },
    { sourceType: 'Amazon', sourceKey: 'description' },
    ...Array.from({ length: 6 }, (_, i) => ({ sourceType: 'Amazon', sourceKey: `bulletPoints.${i}.text` })),
    { sourceType: 'Composición', sourceKey: 'snapshot' },
];
const DraggablePart = ({ part }) => {
    const handleDragStart = (e) => {
        e.dataTransfer.setData('application/json', JSON.stringify({ type: 'new', part }));
    };
    return (<div draggable onDragStart={handleDragStart} className="p-2 bg-slate-600 rounded-md text-sm text-slate-200 cursor-grab active:cursor-grabbing">
            <Icon_1.Icon name="grip-vertical" className="mr-2 text-slate-400"/>
            {part.sourceType}: <span className="font-semibold">{part.sourceKey}</span>
        </div>);
};
const ContentRecipeDetailView = ({ initialData, onSave, onDelete, onCancel, setIsDirty, setSaveHandler }) => {
    const [data, setData] = (0, react_1.useState)(initialData);
    const [dragOverIndex, setDragOverIndex] = (0, react_1.useState)(null);
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
    const handleDragStart = (e, index) => {
        e.dataTransfer.setData('application/json', JSON.stringify({ type: 'move', index }));
    };
    const handleDragOver = (e, index) => {
        e.preventDefault();
        if (index !== dragOverIndex) {
            setDragOverIndex(index);
        }
    };
    const handleDrop = (e, dropIndex) => {
        e.preventDefault();
        const dragData = JSON.parse(e.dataTransfer.getData('application/json'));
        let newParts = [...data.parts];
        if (dragData.type === 'move') {
            const draggedIndex = dragData.index;
            const [draggedItem] = newParts.splice(draggedIndex, 1);
            const newDropIndex = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex;
            newParts.splice(newDropIndex, 0, draggedItem);
        }
        else if (dragData.type === 'new') {
            const newPart = {
                id: `part-${Date.now()}`,
                type: 'field',
                ...dragData.part,
            };
            newParts.splice(dropIndex, 0, newPart);
        }
        setData(prev => ({ ...prev, parts: newParts }));
        setDragOverIndex(null);
    };
    const removePart = (idToRemove) => {
        setData(prev => ({
            ...prev,
            parts: prev.parts.filter((part) => part.id !== idToRemove)
        }));
    };
    const addStaticPart = () => {
        const newPart = {
            id: `part-${Date.now()}`,
            type: 'static',
            value: ' ' // Default with a space
        };
        setData(prev => ({ ...prev, parts: [...prev.parts, newPart] }));
    };
    const updateStaticPartValue = (id, value) => {
        setData(prev => ({
            ...prev,
            parts: prev.parts.map(part => part.id === id ? { ...part, value } : part)
        }));
    };
    const handleDeleteClick = () => onDelete(data.id);
    return (<div className="bg-slate-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-slate-200 mb-6">{data.id === 'new' ? 'Nueva Receta de Contenido' : `Editando Receta: ${initialData.name}`}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <FormField_1.FormField label="Nombre de la Receta" htmlFor="name">
          <TextInput_1.TextInput id="name" name="name" value={data.name} onChange={handleInputChange}/>
        </FormField_1.FormField>
        <FormField_1.FormField label="Objetivo de la Receta" htmlFor="target">
          <Select_1.Select id="target" name="target" value={data.target} onChange={handleInputChange}>
            <option value="title">Título</option>
            <option value="description">Descripción</option>
          </Select_1.Select>
        </FormField_1.FormField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
            <h3 className="text-lg font-semibold text-slate-300 mb-3">Bloques Disponibles</h3>
            <div className="space-y-2 p-3 bg-slate-900/50 rounded-lg max-h-96 overflow-y-auto">
                {AVAILABLE_PARTS.map((part, index) => (<DraggablePart key={index} part={part}/>))}
            </div>
            <button onClick={addStaticPart} className="mt-4 w-full px-4 py-2 text-sm border border-dashed border-slate-600 text-slate-300 rounded-md hover:bg-slate-700">
                <Icon_1.Icon name="plus" className="mr-2"/> Añadir Texto Estático
            </button>
        </div>
        <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-slate-300 mb-3">Constructor de Receta</h3>
             <div className="p-4 min-h-[200px] border-2 border-dashed rounded-lg border-slate-600 space-y-2">
                {data.parts.map((part, index) => (<react_1.default.Fragment key={part.id}>
                        <div onDrop={(e) => handleDrop(e, index)} onDragOver={(e) => handleDragOver(e, index)} onDragLeave={() => setDragOverIndex(null)} className={`h-2 transition-all rounded ${dragOverIndex === index ? 'h-10 bg-cyan-500/10' : ''}`}></div>
                        <div draggable onDragStart={(e) => handleDragStart(e, index)} className="flex items-center p-2 bg-slate-700 rounded-md space-x-2">
                            <Icon_1.Icon name="grip-vertical" className="text-slate-500 cursor-grab active:cursor-grabbing"/>
                            {part.type === 'field' ? (<span className="text-sm text-slate-200 flex-grow">{part.sourceType}: <strong>{part.sourceKey}</strong></span>) : (<TextInput_1.TextInput value={part.value || ''} onChange={e => updateStaticPartValue(part.id, e.target.value)} className="!py-1 text-sm flex-grow" placeholder="Escribe texto aquí..."/>)}
                            <button onClick={() => removePart(part.id)} className="text-red-400 hover:text-red-300"><Icon_1.Icon name="trash"/></button>
                        </div>
                     </react_1.default.Fragment>))}
                <div onDrop={(e) => handleDrop(e, data.parts.length)} onDragOver={(e) => handleDragOver(e, data.parts.length)} onDragLeave={() => setDragOverIndex(null)} className={`h-2 transition-all rounded ${dragOverIndex === data.parts.length ? 'h-10 bg-cyan-500/10' : ''} ${data.parts.length === 0 ? 'flex-grow' : ''}`}></div>

                {data.parts.length === 0 && (<div className="text-center text-slate-500 flex flex-col items-center justify-center h-full">
                        <Icon_1.Icon name="hand-point-up" className="text-3xl mb-2"/>
                        <p>Arrastra los bloques desde la izquierda o añade texto estático.</p>
                    </div>)}
            </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end space-x-4">
        {data.id !== 'new' && <button onClick={handleDeleteClick} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 font-semibold">Eliminar</button>}
        <button onClick={onCancel} className="px-4 py-2 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500 font-semibold">Cancelar</button>
        <button onClick={() => handleSaveClick()} className="px-4 py-2 bg-cyan-500 text-slate-900 rounded-md hover:bg-cyan-600 font-semibold">Guardar Receta</button>
      </div>
    </div>);
};
exports.ContentRecipeDetailView = ContentRecipeDetailView;
