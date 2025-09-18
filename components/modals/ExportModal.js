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
exports.ExportModal = void 0;
const react_1 = __importStar(require("react"));
const FormField_1 = require("../common/FormField");
const Select_1 = require("../common/Select");
const Icon_1 = require("../common/Icon");
const ExportModal = ({ appData, onClose, onExport }) => {
    const [selectedTemplateId, setSelectedTemplateId] = (0, react_1.useState)('');
    const [selectedIds, setSelectedIds] = (0, react_1.useState)([]);
    const selectedTemplate = (0, react_1.useMemo)(() => {
        return appData.importExportTemplates.find(t => t.id === selectedTemplateId);
    }, [selectedTemplateId, appData.importExportTemplates]);
    const itemsForExport = (0, react_1.useMemo)(() => {
        if (!selectedTemplate)
            return [];
        return appData[selectedTemplate.entity] || [];
    }, [selectedTemplate, appData]);
    const handleToggleId = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };
    const handleSelectAll = () => {
        setSelectedIds(itemsForExport.map(item => item.id));
    };
    const handleDeselectAll = () => {
        setSelectedIds([]);
    };
    const handleExportClick = () => {
        if (selectedTemplateId && selectedIds.length > 0) {
            onExport(selectedTemplateId, selectedIds);
        }
    };
    const getItemName = (item, template) => {
        if (template.entity === 'products')
            return item.name || `SKU: ${item.sku}`;
        if (template.entity === 'batches')
            return item.batchNumber;
        return `ID: ${item.id}`;
    };
    return (<div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl border border-slate-700 max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-200">Nueva Exportación Selectiva</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><Icon_1.Icon name="times"/></button>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto">
          <FormField_1.FormField label="Paso 1: Seleccionar Plantilla de Exportación">
            <Select_1.Select value={selectedTemplateId} onChange={(e) => {
            const newTemplateId = e.target.value ? Number(e.target.value) : '';
            setSelectedTemplateId(newTemplateId);
            setSelectedIds([]); // Reset selection on template change
        }}>
              <option value="">Seleccionar una plantilla...</option>
              {appData.importExportTemplates.map(template => (<option key={template.id} value={template.id}>{template.name}</option>))}
            </Select_1.Select>
          </FormField_1.FormField>
          
          {selectedTemplate && (<FormField_1.FormField label={`Paso 2: Seleccionar Registros a Exportar (${selectedIds.length}/${itemsForExport.length})`}>
                <div className="flex justify-end space-x-2 mb-2">
                    <button onClick={handleSelectAll} className="px-3 py-1 text-xs bg-slate-600 rounded-md hover:bg-slate-500">Marcar Todos</button>
                    <button onClick={handleDeselectAll} className="px-3 py-1 text-xs bg-slate-600 rounded-md hover:bg-slate-500">Desmarcar Todos</button>
                </div>
                <div className="p-2 border border-slate-700 rounded-md max-h-64 overflow-y-auto bg-slate-900/50">
                    {itemsForExport.map(item => (<label key={item.id} className="flex items-center p-2 rounded-md hover:bg-slate-700 cursor-pointer">
                           <input type="checkbox" className="h-4 w-4 text-cyan-500 border-slate-600 rounded bg-slate-800 focus:ring-cyan-500 focus:ring-offset-slate-900" checked={selectedIds.includes(item.id)} onChange={() => handleToggleId(item.id)}/>
                           <span className="ml-3 text-sm text-slate-300">{getItemName(item, selectedTemplate)}</span>
                        </label>))}
                </div>
            </FormField_1.FormField>)}
        </div>
        <div className="p-4 border-t border-slate-700 flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500">
            Cancelar
          </button>
          <button onClick={handleExportClick} disabled={!selectedTemplateId || selectedIds.length === 0} className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 disabled:opacity-50">
            <Icon_1.Icon name="file-export" className="mr-2"/>
            Exportar ({selectedIds.length}) Registros
          </button>
        </div>
      </div>
    </div>);
};
exports.ExportModal = ExportModal;
