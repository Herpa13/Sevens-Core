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
exports.CountryDetailView = void 0;
// FIX: Add useCallback to imports
const react_1 = __importStar(require("react"));
const FormField_1 = require("../components/common/FormField");
const TextInput_1 = require("../components/common/TextInput");
const TextArea_1 = require("../components/common/TextArea");
const lodash_es_1 = require("lodash-es");
const CollapsibleSection_1 = require("../components/common/CollapsibleSection");
const NotesSection_1 = require("../components/common/NotesSection");
const CountryDetailView = ({ initialData, onSave, onDelete, onCancel, setIsDirty, setSaveHandler, appData, onNoteAdd, onNoteUpdate, onNoteDelete }) => {
    const [data, setData] = (0, react_1.useState)(initialData);
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
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    };
    // FIX: Directly call onDelete with the entity ID. The parent handler in App.tsx will manage the logic for 'new' vs. existing entities.
    const handleDeleteClick = () => onDelete(data.id);
    const countryNotes = typeof data.id === 'number' ? appData.notes.filter(n => n.entityType === 'countries' && n.entityId === data.id) : [];
    const handleAddNote = (noteText, attachments) => {
        if (typeof data.id !== 'number')
            return;
        const newAttachments = attachments.map(f => ({ id: `temp-${Date.now()}`, name: f.name, url: URL.createObjectURL(f) }));
        onNoteAdd({
            entityType: 'countries',
            entityId: data.id,
            text: noteText,
            attachments: newAttachments,
        });
    };
    return (<div className="bg-slate-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-slate-200 mb-6">{data.id === 'new' ? 'Nuevo País' : `Editando: ${initialData.name}`}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField_1.FormField label="Nombre del País" htmlFor="name">
          <TextInput_1.TextInput id="name" name="name" value={data.name} onChange={handleInputChange}/>
        </FormField_1.FormField>
        <FormField_1.FormField label="Código ISO" htmlFor="iso">
          <TextInput_1.TextInput id="iso" name="iso" value={data.iso} onChange={handleInputChange}/>
        </FormField_1.FormField>
      </div>
       <FormField_1.FormField label="Proceso de Notificación" htmlFor="notificationProcess">
          <TextArea_1.TextArea id="notificationProcess" name="notificationProcess" value={data.notificationProcess || ''} onChange={handleInputChange}/>
        </FormField_1.FormField>
         <FormField_1.FormField label="Documentos Requeridos" htmlFor="requiredDocuments">
          <TextArea_1.TextArea id="requiredDocuments" name="requiredDocuments" value={data.requiredDocuments || ''} onChange={handleInputChange}/>
        </FormField_1.FormField>
      
      <CollapsibleSection_1.CollapsibleSection title="Notas de Colaboración">
         <div className="p-4">
            {typeof data.id === 'number' ? (<NotesSection_1.NotesSection notes={countryNotes} onAddNote={handleAddNote} onUpdateNote={onNoteUpdate} onDeleteNote={onNoteDelete}/>) : (<p className="text-slate-500 text-center py-4">Guarda el país para poder añadir notas.</p>)}
         </div>
      </CollapsibleSection_1.CollapsibleSection>

      <div className="mt-8 flex justify-end space-x-4">
        {data.id !== 'new' && <button onClick={handleDeleteClick} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 font-semibold">Eliminar</button>}
        <button onClick={onCancel} className="px-4 py-2 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500 font-semibold">Cancelar</button>
        <button onClick={() => handleSaveClick()} className="px-4 py-2 bg-cyan-500 text-slate-900 rounded-md hover:bg-cyan-600 font-semibold">Guardar</button>
      </div>
    </div>);
};
exports.CountryDetailView = CountryDetailView;
