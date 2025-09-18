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
exports.PromptTemplateDetailView = void 0;
const react_1 = __importStar(require("react"));
const FormField_1 = require("../components/common/FormField");
const TextInput_1 = require("../components/common/TextInput");
const Select_1 = require("../components/common/Select");
const TextArea_1 = require("../components/common/TextArea");
const DataTreeView_1 = require("../components/common/DataTreeView");
const lodash_es_1 = require("lodash-es");
const STATIC_PLACEHOLDERS = [
    { name: '{texto_bruto}', description: 'El texto de origen para revisar o traducir.' },
    { name: '{idioma_destino}', description: 'El nombre del idioma al que se va a traducir (ej. "Francés").' },
    { name: '{global_rules}', description: 'Inserta las reglas de traducción globales definidas en los Ajustes de IA.' },
    { name: '{glossary}', description: 'Inserta el glosario de términos para el idioma de destino.' },
];
const PROMPTABLE_ENTITIES = [
    { value: 'general', label: 'General (Sin entidad específica)' },
    { value: 'products', label: 'Productos' },
    { value: 'etiquetas', label: 'Etiquetas' },
    { value: 'ingredients', label: 'Ingredientes' },
    { value: 'productNotifications', label: 'Notificaciones de Producto' },
    { value: 'competitorProducts', label: 'Productos de Competencia' },
];
const PromptTemplateDetailView = ({ initialData, onSave, onDelete, onCancel, appData, setIsDirty, setSaveHandler }) => {
    const [data, setData] = (0, react_1.useState)(initialData);
    const textareaRef = (0, react_1.useRef)(null);
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
    const handleInsertPlaceholder = (placeholder) => {
        const textarea = textareaRef.current;
        if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const text = textarea.value;
            const newText = text.substring(0, start) + placeholder + text.substring(end);
            setData(prev => ({ ...prev, template: newText }));
            // Focus and set cursor position after state update
            setTimeout(() => {
                textarea.focus();
                textarea.selectionStart = textarea.selectionEnd = start + placeholder.length;
            }, 0);
        }
    };
    const sampleDataContext = (0, react_1.useMemo)(() => {
        const getSample = (key, index = 0) => appData[key]?.[index] || {};
        switch (data.entityType) {
            case 'products':
                return { product: getSample('products') };
            case 'etiquetas':
                return { etiqueta: getSample('etiquetas') };
            case 'ingredients':
                return { ingredient: getSample('ingredients') };
            case 'productNotifications':
                return { notification: getSample('productNotifications') };
            case 'competitorProducts':
                return { competitor: getSample('competitorProducts'), our_product: getSample('products') };
            case 'general':
            default:
                return null;
        }
    }, [data.entityType, appData]);
    const handleDeleteClick = () => (typeof data.id === 'number' ? onDelete(data.id) : undefined);
    return (<div className="bg-slate-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-slate-200 mb-6">{data.id === 'new' ? 'Nueva Plantilla de IA' : `Editando Plantilla: ${initialData.name}`}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FormField_1.FormField label="Nombre de la Plantilla" htmlFor="name">
          <TextInput_1.TextInput id="name" name="name" value={data.name} onChange={handleInputChange}/>
        </FormField_1.FormField>
        <FormField_1.FormField label="Categoría" htmlFor="category">
          <Select_1.Select id="category" name="category" value={data.category} onChange={handleInputChange}>
            <option value="Revisión">Revisión</option>
            <option value="Traducción">Traducción</option>
            <option value="Generación">Generación</option>
            <option value="Análisis">Análisis</option>
            <option value="Optimización">Optimización</option>
            <option value="Generación de Prompt de Imagen">Generación de Prompt de Imagen</option>
            <option value="Generación de Prompt de Vídeo">Generación de Prompt de Vídeo</option>
          </Select_1.Select>
        </FormField_1.FormField>
        <FormField_1.FormField label="Entidad Principal" htmlFor="entityType">
          <Select_1.Select id="entityType" name="entityType" value={data.entityType} onChange={handleInputChange}>
            {PROMPTABLE_ENTITIES.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </Select_1.Select>
        </FormField_1.FormField>
        <FormField_1.FormField label="Descripción" htmlFor="description" className="lg:col-span-3">
            <TextArea_1.TextArea id="description" name="description" value={data.description} onChange={handleInputChange} rows={2}/>
        </FormField_1.FormField>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <FormField_1.FormField label="Plantilla del Prompt" htmlFor="template">
                <TextArea_1.TextArea ref={textareaRef} id="template" name="template" value={data.template} onChange={handleInputChange} rows={20} className="font-mono text-sm"/>
            </FormField_1.FormField>
        </div>
        <div className="lg:col-span-1">
            <div className="h-full flex flex-col">
                <div className="flex-grow min-h-0">
                    {sampleDataContext ? (<DataTreeView_1.DataTreeView data={sampleDataContext} onSelect={handleInsertPlaceholder} title="Asistente de Placeholders"/>) : (<div className="text-center text-slate-500 p-4 border-2 border-dashed border-slate-600 rounded-lg h-full flex items-center justify-center">Selecciona una entidad para ver sus placeholders.</div>)}
                </div>
                 <div className="mt-4 bg-slate-700/50 p-3 rounded-lg border border-slate-600">
                    <h4 className="font-semibold text-slate-300 text-sm mb-2">Placeholders Estáticos</h4>
                     <ul className="space-y-2">
                        {STATIC_PLACEHOLDERS.map(ph => (<li key={ph.name} onClick={() => handleInsertPlaceholder(ph.name)} className="cursor-pointer p-1 rounded-md hover:bg-slate-700">
                                <code className="text-sm font-bold text-cyan-400 bg-slate-800 px-1 py-0.5 rounded">{ph.name}</code>
                                <p className="text-xs text-slate-400">{ph.description}</p>
                            </li>))}
                    </ul>
                </div>
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
exports.PromptTemplateDetailView = PromptTemplateDetailView;
