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
exports.SaveSequenceToLibraryModal = void 0;
const react_1 = __importStar(require("react"));
const FormField_1 = require("../common/FormField");
const TextInput_1 = require("../common/TextInput");
const TextArea_1 = require("../common/TextArea");
const KeywordManager_1 = require("../common/KeywordManager");
const Icon_1 = require("../common/Icon");
const SaveSequenceToLibraryModal = ({ sequence, onClose, onSave }) => {
    const [assetData, setAssetData] = (0, react_1.useState)({
        name: '',
        description: '',
        tags: [],
        duration: sequence.duration,
        imageUrl: sequence.image.sourceUrl || '',
        videoUrl: sequence.video.sourceUrl || '',
        voiceoverScript: sequence.voiceoverScript,
    });
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAssetData(prev => ({ ...prev, [name]: value }));
    };
    const handleSaveClick = () => {
        if (assetData.name.trim()) {
            onSave(assetData);
        }
        else {
            alert("El nombre del activo es obligatorio.");
        }
    };
    return (<div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl border border-slate-700 max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-slate-700 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-200">Guardar Secuencia en la Biblioteca de Medios</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><Icon_1.Icon name="times"/></button>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto">
            <p className="text-sm text-slate-400">Estás a punto de guardar esta secuencia como un activo reutilizable. Dale un nombre y etiquetas para encontrarla fácilmente más tarde.</p>
          <FormField_1.FormField label="Nombre del Activo" htmlFor="name">
            <TextInput_1.TextInput id="name" name="name" value={assetData.name} onChange={handleInputChange} placeholder="Ej: Vitamina C - Bote girando"/>
          </FormField_1.FormField>
          <FormField_1.FormField label="Descripción" htmlFor="description">
            <TextArea_1.TextArea id="description" name="description" value={assetData.description || ''} onChange={handleInputChange} rows={3}/>
          </FormField_1.FormField>
          <FormField_1.FormField label="Etiquetas (Tags)">
            <KeywordManager_1.KeywordManager keywords={assetData.tags} onChange={tags => setAssetData(prev => ({ ...prev, tags }))}/>
          </FormField_1.FormField>
        </div>
        <div className="p-4 border-t border-slate-700 flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500">
            Cancelar
          </button>
          <button onClick={handleSaveClick} disabled={!assetData.name.trim()} className="px-4 py-2 bg-indigo-500 text-white font-semibold rounded-md hover:bg-indigo-600 disabled:opacity-50">
            <Icon_1.Icon name="save" className="mr-2"/>
            Guardar Activo
          </button>
        </div>
      </div>
    </div>);
};
exports.SaveSequenceToLibraryModal = SaveSequenceToLibraryModal;
