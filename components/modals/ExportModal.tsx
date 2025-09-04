

import React, { useState, useMemo } from 'react';
import type { AppData, ImportExportTemplate, Entity } from '../../types';
import { FormField } from '../common/FormField';
import { Select } from '../common/Select';
import { Icon } from '../common/Icon';

interface ExportModalProps {
  appData: AppData;
  onClose: () => void;
  onExport: (templateId: number, selectedIds: number[]) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ appData, onClose, onExport }) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | ''>('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const selectedTemplate = useMemo(() => {
    return appData.importExportTemplates.find(t => t.id === selectedTemplateId);
  }, [selectedTemplateId, appData.importExportTemplates]);

  const itemsForExport = useMemo(() => {
    if (!selectedTemplate) return [];
    return (appData[selectedTemplate.entity] as Entity[]) || [];
  }, [selectedTemplate, appData]);

  const handleToggleId = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedIds(itemsForExport.map(item => item.id as number));
  };

  const handleDeselectAll = () => {
    setSelectedIds([]);
  };

  const handleExportClick = () => {
    if (selectedTemplateId && selectedIds.length > 0) {
      onExport(selectedTemplateId, selectedIds);
    }
  };
  
  const getItemName = (item: Entity, template: ImportExportTemplate) => {
      if (template.entity === 'products') return (item as any).name || `SKU: ${(item as any).sku}`;
      if (template.entity === 'batches') return (item as any).batchNumber;
      return `ID: ${item.id}`;
  }


  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl border border-slate-700 max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-200">Nueva Exportación Selectiva</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><Icon name="times" /></button>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto">
          <FormField label="Paso 1: Seleccionar Plantilla de Exportación">
            <Select value={selectedTemplateId} onChange={(e) => {
                const newTemplateId = e.target.value ? Number(e.target.value) : '';
                setSelectedTemplateId(newTemplateId);
                setSelectedIds([]); // Reset selection on template change
            }}>
              <option value="">Seleccionar una plantilla...</option>
              {appData.importExportTemplates.map(template => (
                <option key={template.id} value={template.id}>{template.name}</option>
              ))}
            </Select>
          </FormField>
          
          {selectedTemplate && (
            <FormField label={`Paso 2: Seleccionar Registros a Exportar (${selectedIds.length}/${itemsForExport.length})`}>
                <div className="flex justify-end space-x-2 mb-2">
                    <button onClick={handleSelectAll} className="px-3 py-1 text-xs bg-slate-600 rounded-md hover:bg-slate-500">Marcar Todos</button>
                    <button onClick={handleDeselectAll} className="px-3 py-1 text-xs bg-slate-600 rounded-md hover:bg-slate-500">Desmarcar Todos</button>
                </div>
                <div className="p-2 border border-slate-700 rounded-md max-h-64 overflow-y-auto bg-slate-900/50">
                    {itemsForExport.map(item => (
                        <label key={item.id} className="flex items-center p-2 rounded-md hover:bg-slate-700 cursor-pointer">
                           <input
                                type="checkbox"
                                className="h-4 w-4 text-cyan-500 border-slate-600 rounded bg-slate-800 focus:ring-cyan-500 focus:ring-offset-slate-900"
                                checked={selectedIds.includes(item.id as number)}
                                onChange={() => handleToggleId(item.id as number)}
                            />
                           <span className="ml-3 text-sm text-slate-300">{getItemName(item, selectedTemplate)}</span>
                        </label>
                    ))}
                </div>
            </FormField>
          )}
        </div>
        <div className="p-4 border-t border-slate-700 flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500">
            Cancelar
          </button>
          <button 
            onClick={handleExportClick} 
            disabled={!selectedTemplateId || selectedIds.length === 0}
            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            <Icon name="file-export" className="mr-2" />
            Exportar ({selectedIds.length}) Registros
          </button>
        </div>
      </div>
    </div>
  );
};