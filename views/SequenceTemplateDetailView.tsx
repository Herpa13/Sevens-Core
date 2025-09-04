import React, { useState, useCallback, useEffect } from 'react';
import type { SequenceTemplate, SequenceTemplateCategory } from '../types';
import { FormField } from '../components/common/FormField';
import { TextInput } from '../components/common/TextInput';
import { Select } from '../components/common/Select';
import { Icon } from '../components/common/Icon';
import { isEqual } from 'lodash-es';

interface SequenceTemplateDetailViewProps {
  initialData: SequenceTemplate;
  onSave: (data: SequenceTemplate) => void;
  onDelete: (id: number) => void;
  onCancel: () => void;
  onNavigate: (view: any) => void;
  setIsDirty: (isDirty: boolean) => void;
  setSaveHandler: (handler: ((onSuccess?: () => void) => void) | null) => void;
}

const CATEGORIES: SequenceTemplateCategory[] = ['Introducciones', 'Demostraciones', 'Cierres', 'Genérico'];

export const SequenceTemplateDetailView: React.FC<SequenceTemplateDetailViewProps> = ({ initialData, onSave, onDelete, onCancel, onNavigate, setIsDirty, setSaveHandler }) => {
  const [data, setData] = useState<SequenceTemplate>(initialData);

  const handleSaveClick = useCallback((onSuccess?: () => void) => {
    onSave(data);
    if (onSuccess) onSuccess();
  }, [data, onSave]);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  useEffect(() => {
    setIsDirty(!isEqual(initialData, data));
  }, [data, initialData, setIsDirty]);

  useEffect(() => {
    setSaveHandler(handleSaveClick);
    return () => setSaveHandler(null);
  }, [handleSaveClick, setSaveHandler]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'number' ? Number(value) : value;
    setData(prev => ({ ...prev, [name]: val }));
  };

  const handleDeleteClick = () => (typeof data.id === 'number' ? onDelete(data.id) : undefined);

  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-slate-200 mb-6">{data.id === 'new' ? 'Nueva Plantilla de Secuencia' : `Editando Plantilla: ${initialData.name}`}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <FormField label="Nombre de la Plantilla" htmlFor="name">
          <TextInput id="name" name="name" value={data.name} onChange={handleInputChange} />
        </FormField>
         <FormField label="Categoría" htmlFor="category">
          <Select id="category" name="category" value={data.category} onChange={handleInputChange}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </Select>
        </FormField>
         <FormField label="Duración Sugerida (s)" htmlFor="defaultDuration">
            <TextInput type="number" name="defaultDuration" value={data.defaultDuration} onChange={handleInputChange} />
        </FormField>
        <FormField label={
            <div className="flex items-center justify-between">
                <span>Descripción</span>
                <button 
                    onClick={() => onNavigate({ type: 'list', entityType: 'knowledgeBaseEntries'})}
                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center"
                >
                    <Icon name="book" className="mr-1.5"/> Ver Buenas Prácticas
                </button>
            </div>
        } htmlFor="description">
          <TextInput id="description" name="description" value={data.description} onChange={handleInputChange} />
        </FormField>
      </div>

      <div className="mt-8 flex justify-end space-x-4">
        {data.id !== 'new' && <button onClick={handleDeleteClick} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 font-semibold">Eliminar</button>}
        <button onClick={onCancel} className="px-4 py-2 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500 font-semibold">Cancelar</button>
        <button onClick={() => handleSaveClick()} className="px-4 py-2 bg-cyan-500 text-slate-900 rounded-md hover:bg-cyan-600 font-semibold">Guardar Plantilla</button>
      </div>
    </div>
  );
};
