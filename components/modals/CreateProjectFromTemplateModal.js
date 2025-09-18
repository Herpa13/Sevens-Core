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
exports.CreateProjectFromTemplateModal = void 0;
const react_1 = __importStar(require("react"));
const FormField_1 = require("../common/FormField");
const Select_1 = require("../common/Select");
const Icon_1 = require("../common/Icon");
const TextInput_1 = require("../common/TextInput");
const CreateProjectFromTemplateModal = ({ appData, onClose, onCreate, initialBlank = false }) => {
    const [selectedTemplateId, setSelectedTemplateId] = (0, react_1.useState)('');
    const [selectedProductId, setSelectedProductId] = (0, react_1.useState)('');
    const [projectName, setProjectName] = (0, react_1.useState)('');
    (0, react_1.useEffect)(() => {
        if (initialBlank) {
            const blankTemplate = appData.videoCompositionTemplates.find(t => t.name === 'Sin Plantilla (Vídeo Genérico)');
            if (blankTemplate) {
                setSelectedTemplateId(blankTemplate.id);
            }
            setSelectedProductId('');
        }
    }, [initialBlank, appData.videoCompositionTemplates]);
    const selectedTemplate = (0, react_1.useMemo)(() => {
        return appData.videoCompositionTemplates.find(t => t.id === selectedTemplateId);
    }, [selectedTemplateId, appData.videoCompositionTemplates]);
    const handleCreateClick = () => {
        if (projectName) {
            onCreate(selectedTemplateId === '' ? undefined : selectedTemplateId, selectedProductId === '' ? undefined : selectedProductId, projectName);
        }
    };
    return (<div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl border border-slate-700 max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-slate-700 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-200">Crear Nuevo Proyecto de Vídeo</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><Icon_1.Icon name="times"/></button>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto">
          <FormField_1.FormField label="Paso 1: Seleccionar Plantilla de Vídeo">
            <Select_1.Select value={selectedTemplateId} onChange={(e) => setSelectedTemplateId(e.target.value ? Number(e.target.value) : '')}>
              <option value="">-- Sin Plantilla (Empezar en Blanco) --</option>
              {appData.videoCompositionTemplates.map(template => (<option key={template.id} value={template.id}>{template.name}</option>))}
            </Select_1.Select>
            {selectedTemplate && (<p className="text-xs text-slate-400 mt-2 p-2 bg-slate-700/50 rounded-md">{selectedTemplate.description}</p>)}
          </FormField_1.FormField>
          
          <FormField_1.FormField label="Paso 2: Seleccionar Producto (Opcional)">
             <Select_1.Select value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value ? Number(e.target.value) : '')}>
              <option value="">-- Sin Producto (Vídeo de Marca) --</option>
              {appData.products.map(product => (<option key={product.id} value={product.id}>{product.name}</option>))}
            </Select_1.Select>
          </FormField_1.FormField>
          
           <FormField_1.FormField label="Paso 3: Dar un Nombre al Proyecto">
            <TextInput_1.TextInput value={projectName} onChange={e => setProjectName(e.target.value)} placeholder="Ej: Lanzamiento Vitamina C - TikTok Q3"/>
          </FormField_1.FormField>

        </div>
        <div className="p-4 border-t border-slate-700 flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500">
            Cancelar
          </button>
          <button onClick={handleCreateClick} disabled={!projectName} className="px-4 py-2 bg-cyan-500 text-slate-900 font-semibold rounded-md hover:bg-cyan-600 disabled:opacity-50">
            <Icon_1.Icon name="plus" className="mr-2"/>
            Crear Proyecto
          </button>
        </div>
      </div>
    </div>);
};
exports.CreateProjectFromTemplateModal = CreateProjectFromTemplateModal;
