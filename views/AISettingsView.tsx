
import React, { useState } from 'react';
import type { AISettings } from '../types';
import { FormField } from '../components/common/FormField';
import { TextArea } from '../components/common/TextArea';

interface AISettingsViewProps {
  initialData: AISettings;
  onSave: (data: AISettings) => void;
  onCancel: () => void;
}

export const AISettingsView: React.FC<AISettingsViewProps> = ({ initialData, onSave, onCancel }) => {
  const [data, setData] = useState<AISettings>(initialData);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveClick = () => onSave(data);

  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-slate-200 mb-6">Ajustes Globales de Inteligencia Artificial</h2>
      
      <FormField 
        label="Reglas Globales de Traducción" 
        htmlFor="globalTranslationRules"
        helpText="Estas reglas se aplicarán a TODAS las traducciones realizadas con plantillas de IA que usen el placeholder {global_rules}. Escribe una regla por línea."
      >
        <TextArea 
          id="globalTranslationRules" 
          name="globalTranslationRules" 
          value={data.globalTranslationRules} 
          onChange={handleInputChange}
          rows={10}
          className="font-mono text-sm"
          placeholder="- NUNCA traduzcas el nombre de la marca 'MiMarca'.&#10;- Siempre usa un tono formal para el mercado alemán (DE)."
        />
      </FormField>

      <div className="mt-8 flex justify-end space-x-4">
        <button onClick={onCancel} className="px-4 py-2 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500 font-semibold">Cancelar</button>
        <button onClick={handleSaveClick} className="px-4 py-2 bg-cyan-500 text-slate-900 rounded-md hover:bg-cyan-600 font-semibold">Guardar Ajustes</button>
      </div>
    </div>
  );
};
