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
exports.EnvaseDetailView = void 0;
// FIX: Add useCallback to imports
const react_1 = __importStar(require("react"));
const FormField_1 = require("../components/common/FormField");
const TextInput_1 = require("../components/common/TextInput");
const Select_1 = require("../components/common/Select");
const Icon_1 = require("../components/common/Icon");
const lodash_es_1 = require("lodash-es");
const CollapsibleSection_1 = require("../components/common/CollapsibleSection");
const NotesSection_1 = require("../components/common/NotesSection");
const EnvaseDetailView = ({ initialData, onSave, onDelete, onCancel, setIsDirty, setSaveHandler, appData, onNoteAdd, onNoteUpdate, onNoteDelete }) => {
    const [data, setData] = (0, react_1.useState)(initialData);
    const [imagePreview, setImagePreview] = (0, react_1.useState)(initialData.fotoUrl || null);
    const handleSaveClick = (0, react_1.useCallback)((onSuccess) => {
        onSave(data);
        if (onSuccess) {
            onSuccess();
        }
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
        const val = type === 'number' ? (value === '' ? undefined : Number(value)) : value;
        setData(prev => ({ ...prev, [name]: val }));
    };
    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
            setData(prev => ({ ...prev, fotoUrl: previewUrl }));
        }
    };
    const handleRemoveImage = () => {
        setImagePreview(null);
        setData(prev => ({ ...prev, fotoUrl: undefined }));
    };
    // FIX: Directly call onDelete with the entity ID. The parent handler in App.tsx will manage the logic for 'new' vs. existing entities.
    const handleDeleteClick = () => onDelete(data.id);
    const envaseNotes = typeof data.id === 'number' ? appData.notes.filter(n => n.entityType === 'envases' && n.entityId === data.id) : [];
    const handleAddNote = (noteText, attachments) => {
        if (typeof data.id !== 'number')
            return;
        const newAttachments = attachments.map(f => ({ id: `temp-${Date.now()}`, name: f.name, url: URL.createObjectURL(f) }));
        onNoteAdd({
            entityType: 'envases',
            entityId: data.id,
            text: noteText,
            attachments: newAttachments,
        });
    };
    return (<div className="bg-slate-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-slate-200 mb-6">{data.id === 'new' ? 'Nuevo Envase' : `Editando: ${initialData.name}`}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField_1.FormField label="Nombre del Envase" htmlFor="name">
          <TextInput_1.TextInput id="name" name="name" value={data.name} onChange={handleInputChange}/>
        </FormField_1.FormField>
        <FormField_1.FormField label="Tipo" htmlFor="tipo">
          <Select_1.Select id="tipo" name="tipo" value={data.tipo || ''} onChange={handleInputChange}>
            <option value="">Seleccionar tipo</option>
            <option value="Bote">Bote</option>
            <option value="Doypack">Doypack</option>
            <option value="Blister">Blister</option>
            <option value="Caja">Caja</option>
          </Select_1.Select>
        </FormField_1.FormField>
        <FormField_1.FormField label="Anchura (cm)" htmlFor="width">
            <TextInput_1.TextInput type="number" id="width" name="width" value={data.width || ''} onChange={handleInputChange}/>
        </FormField_1.FormField>
        <FormField_1.FormField label="Longitud (cm)" htmlFor="length">
            <TextInput_1.TextInput type="number" id="length" name="length" value={data.length || ''} onChange={handleInputChange}/>
        </FormField_1.FormField>
        <FormField_1.FormField label="Altura (cm)" htmlFor="height">
            <TextInput_1.TextInput type="number" id="height" name="height" value={data.height || ''} onChange={handleInputChange}/>
        </FormField_1.FormField>
        <FormField_1.FormField label="Peso (g)" htmlFor="peso">
          <TextInput_1.TextInput type="number" id="peso" name="peso" value={data.peso || ''} onChange={handleInputChange}/>
        </FormField_1.FormField>
        <FormField_1.FormField label="Capacidad" htmlFor="capacidad">
          <TextInput_1.TextInput id="capacidad" name="capacidad" value={data.capacidad || ''} onChange={handleInputChange}/>
        </FormField_1.FormField>
        <FormField_1.FormField label="Foto" htmlFor="fotoUrl">
          <div className="mt-1">
              <div className="w-full h-48 bg-slate-700/50 rounded-md flex items-center justify-center overflow-hidden border border-slate-600">
                  {imagePreview ? (<img src={imagePreview} alt="Vista previa del envase" className="h-full w-full object-contain"/>) : (<div className="text-center">
                      <Icon_1.Icon name="image" className="text-4xl text-slate-500"/>
                      <p className="text-xs text-slate-400 mt-1">Sin imagen</p>
                  </div>)}
              </div>
              <div className="flex items-center space-x-2 mt-2">
                  <label className="px-3 py-1.5 bg-slate-700 border border-slate-600 rounded-md shadow-sm text-sm font-medium text-slate-300 hover:bg-slate-600 cursor-pointer">
                      <span>Cambiar</span>
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageChange}/>
                  </label>
                  {imagePreview && (<button type="button" onClick={handleRemoveImage} className="px-3 py-1.5 bg-red-500/20 border border-transparent rounded-md text-sm font-medium text-red-300 hover:bg-red-500/30">
                      Quitar
                  </button>)}
              </div>
          </div>
        </FormField_1.FormField>
      </div>

       <CollapsibleSection_1.CollapsibleSection title="Notas de Colaboración">
         <div className="p-4">
            {typeof data.id === 'number' ? (<NotesSection_1.NotesSection notes={envaseNotes} onAddNote={handleAddNote} onUpdateNote={onNoteUpdate} onDeleteNote={onNoteDelete}/>) : (<p className="text-slate-500 text-center py-4">Guarda el envase para poder añadir notas.</p>)}
         </div>
      </CollapsibleSection_1.CollapsibleSection>

      <div className="mt-8 flex justify-end space-x-4">
        {data.id !== 'new' && <button onClick={handleDeleteClick} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 font-semibold">Eliminar</button>}
        <button onClick={onCancel} className="px-4 py-2 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500 font-semibold">Cancelar</button>
        <button onClick={() => handleSaveClick()} className="px-4 py-2 bg-cyan-500 text-slate-900 rounded-md hover:bg-cyan-600 font-semibold">Guardar</button>
      </div>
    </div>);
};
exports.EnvaseDetailView = EnvaseDetailView;
