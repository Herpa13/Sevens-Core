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
exports.ImportModal = void 0;
const react_1 = __importStar(require("react"));
const FormField_1 = require("../common/FormField");
const Select_1 = require("../common/Select");
const Icon_1 = require("../common/Icon");
const ImportModal = ({ appData, onClose, onImport }) => {
    const [selectedTemplateId, setSelectedTemplateId] = (0, react_1.useState)('');
    const [selectedFile, setSelectedFile] = (0, react_1.useState)(null);
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };
    const handleImportClick = () => {
        if (selectedTemplateId && selectedFile) {
            onImport(selectedTemplateId, selectedFile);
        }
    };
    const selectedTemplate = appData.importExportTemplates.find(t => t.id === selectedTemplateId);
    const acceptFormat = selectedTemplate?.templateType === 'amazonContent' ? '.csv' : '.csv,.zip';
    return (<div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-lg border border-slate-700">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-200">Nueva Importación</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><Icon_1.Icon name="times"/></button>
        </div>
        <div className="p-6 space-y-4">
          <FormField_1.FormField label="Paso 1: Seleccionar Plantilla">
            <Select_1.Select value={selectedTemplateId} onChange={(e) => setSelectedTemplateId(Number(e.target.value))}>
              <option value="">Seleccionar una plantilla...</option>
              {appData.importExportTemplates.map(template => (<option key={template.id} value={template.id}>{template.name}</option>))}
            </Select_1.Select>
          </FormField_1.FormField>
          <FormField_1.FormField label="Paso 2: Subir Fichero">
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-600 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Icon_1.Icon name="upload" className="mx-auto h-12 w-12 text-slate-500"/>
                <div className="flex text-sm text-slate-400">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-slate-700 rounded-md font-medium text-cyan-400 hover:text-cyan-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-slate-800 focus-within:ring-cyan-500 px-1">
                    <span>Subir un fichero</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept={acceptFormat}/>
                  </label>
                  <p className="pl-1">o arrastrar y soltar</p>
                </div>
                {selectedFile ? (<p className="text-xs text-green-400">{selectedFile.name}</p>) : (<p className="text-xs text-slate-500">{acceptFormat === '.csv' ? 'Solo ficheros CSV' : 'Ficheros CSV o ZIP'}</p>)}
              </div>
            </div>
          </FormField_1.FormField>
        </div>
        <div className="p-4 border-t border-slate-700 flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500">
            Cancelar
          </button>
          <button onClick={handleImportClick} disabled={!selectedTemplateId || !selectedFile} className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 disabled:opacity-50">
            <Icon_1.Icon name="file-import" className="mr-2"/>
            Validar y Previsualizar
          </button>
        </div>
      </div>
    </div>);
};
exports.ImportModal = ImportModal;
