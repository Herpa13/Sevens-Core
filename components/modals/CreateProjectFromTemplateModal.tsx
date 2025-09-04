import React, { useState, useMemo, useEffect } from 'react';
import type { AppData, VideoCompositionTemplate, Product } from '../../types';
import { FormField } from '../common/FormField';
import { Select } from '../common/Select';
import { Icon } from '../common/Icon';
import { TextInput } from '../common/TextInput';

interface CreateProjectFromTemplateModalProps {
  appData: AppData;
  onClose: () => void;
  onCreate: (compositionTemplateId: number | undefined, productId: number | undefined, projectName: string) => void;
  initialBlank?: boolean;
}

export const CreateProjectFromTemplateModal: React.FC<CreateProjectFromTemplateModalProps> = ({ appData, onClose, onCreate, initialBlank = false }) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | ''>('');
  const [selectedProductId, setSelectedProductId] = useState<number | ''>('');
  const [projectName, setProjectName] = useState('');

  useEffect(() => {
    if (initialBlank) {
        const blankTemplate = appData.videoCompositionTemplates.find(t => t.name === 'Sin Plantilla (Vídeo Genérico)');
        if (blankTemplate) {
            setSelectedTemplateId(blankTemplate.id as number);
        }
        setSelectedProductId('');
    }
  }, [initialBlank, appData.videoCompositionTemplates]);


  const selectedTemplate = useMemo(() => {
    return appData.videoCompositionTemplates.find(t => t.id === selectedTemplateId);
  }, [selectedTemplateId, appData.videoCompositionTemplates]);

  const handleCreateClick = () => {
    if (projectName) {
      onCreate(
        selectedTemplateId === '' ? undefined : selectedTemplateId, 
        selectedProductId === '' ? undefined : selectedProductId, 
        projectName
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl border border-slate-700 max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-slate-700 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-200">Crear Nuevo Proyecto de Vídeo</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><Icon name="times" /></button>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto">
          <FormField label="Paso 1: Seleccionar Plantilla de Vídeo">
            <Select value={selectedTemplateId} onChange={(e) => setSelectedTemplateId(e.target.value ? Number(e.target.value) : '')}>
              <option value="">-- Sin Plantilla (Empezar en Blanco) --</option>
              {appData.videoCompositionTemplates.map(template => (
                <option key={template.id} value={template.id}>{template.name}</option>
              ))}
            </Select>
            {selectedTemplate && (
                <p className="text-xs text-slate-400 mt-2 p-2 bg-slate-700/50 rounded-md">{selectedTemplate.description}</p>
            )}
          </FormField>
          
          <FormField label="Paso 2: Seleccionar Producto (Opcional)">
             <Select value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value ? Number(e.target.value) : '')}>
              <option value="">-- Sin Producto (Vídeo de Marca) --</option>
              {appData.products.map(product => (
                <option key={product.id} value={product.id}>{product.name}</option>
              ))}
            </Select>
          </FormField>
          
           <FormField label="Paso 3: Dar un Nombre al Proyecto">
            <TextInput value={projectName} onChange={e => setProjectName(e.target.value)} placeholder="Ej: Lanzamiento Vitamina C - TikTok Q3"/>
          </FormField>

        </div>
        <div className="p-4 border-t border-slate-700 flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500">
            Cancelar
          </button>
          <button 
            onClick={handleCreateClick} 
            disabled={!projectName}
            className="px-4 py-2 bg-cyan-500 text-slate-900 font-semibold rounded-md hover:bg-cyan-600 disabled:opacity-50"
          >
            <Icon name="plus" className="mr-2" />
            Crear Proyecto
          </button>
        </div>
      </div>
    </div>
  );
};