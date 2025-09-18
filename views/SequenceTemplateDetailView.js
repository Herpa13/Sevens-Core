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
exports.SequenceTemplateDetailView = void 0;
const react_1 = __importStar(require("react"));
const FormField_1 = require("../components/common/FormField");
const TextInput_1 = require("../components/common/TextInput");
const Select_1 = require("../components/common/Select");
const Icon_1 = require("../components/common/Icon");
const lodash_es_1 = require("lodash-es");
const CATEGORIES = ['Introducciones', 'Demostraciones', 'Cierres', 'Genérico'];
const SequenceTemplateDetailView = ({ initialData, onSave, onDelete, onCancel, onNavigate, setIsDirty, setSaveHandler }) => {
    const [data, setData] = (0, react_1.useState)(initialData);
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
        const { name, value, type } = e.target;
        const val = type === 'number' ? Number(value) : value;
        setData(prev => ({ ...prev, [name]: val }));
    };
    const handleDeleteClick = () => (typeof data.id === 'number' ? onDelete(data.id) : undefined);
    return (<div className="bg-slate-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-slate-200 mb-6">{data.id === 'new' ? 'Nueva Plantilla de Secuencia' : `Editando Plantilla: ${initialData.name}`}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <FormField_1.FormField label="Nombre de la Plantilla" htmlFor="name">
          <TextInput_1.TextInput id="name" name="name" value={data.name} onChange={handleInputChange}/>
        </FormField_1.FormField>
         <FormField_1.FormField label="Categoría" htmlFor="category">
          <Select_1.Select id="category" name="category" value={data.category} onChange={handleInputChange}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </Select_1.Select>
        </FormField_1.FormField>
         <FormField_1.FormField label="Duración Sugerida (s)" htmlFor="defaultDuration">
            <TextInput_1.TextInput type="number" name="defaultDuration" value={data.defaultDuration} onChange={handleInputChange}/>
        </FormField_1.FormField>
        <FormField_1.FormField label={<div className="flex items-center justify-between">
                <span>Descripción</span>
                <button onClick={() => onNavigate({ type: 'list', entityType: 'knowledgeBaseEntries' })} className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center">
                    <Icon_1.Icon name="book" className="mr-1.5"/> Ver Buenas Prácticas
                </button>
            </div>} htmlFor="description">
          <TextInput_1.TextInput id="description" name="description" value={data.description} onChange={handleInputChange}/>
        </FormField_1.FormField>
      </div>

      <div className="mt-8 flex justify-end space-x-4">
        {data.id !== 'new' && <button onClick={handleDeleteClick} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 font-semibold">Eliminar</button>}
        <button onClick={onCancel} className="px-4 py-2 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500 font-semibold">Cancelar</button>
        <button onClick={() => handleSaveClick()} className="px-4 py-2 bg-cyan-500 text-slate-900 rounded-md hover:bg-cyan-600 font-semibold">Guardar Plantilla</button>
      </div>
    </div>);
};
exports.SequenceTemplateDetailView = SequenceTemplateDetailView;
