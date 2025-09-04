import React, { useState, useMemo } from 'react';
import type { TaskSchema } from '../../types';
import { Icon } from '../common/Icon';
import { Select } from '../common/Select';
import { FormField } from '../common/FormField';
import { TextInput } from '../common/TextInput';
import { extractPlaceholders } from '../../utils/schemaUtils';

interface StartProjectModalProps {
  schemas: TaskSchema[];
  onStart: (schema: TaskSchema, initialContext: Record<string, string>) => void;
  onClose: () => void;
}

export const StartProjectModal: React.FC<StartProjectModalProps> = ({ schemas, onStart, onClose }) => {
  const [step, setStep] = useState(1);
  const [selectedSchemaId, setSelectedSchemaId] = useState<number | ''>('');
  const [contextValues, setContextValues] = useState<Record<string, string>>({});

  const selectedSchema = useMemo(() => {
    return schemas.find(s => s.id === selectedSchemaId);
  }, [selectedSchemaId, schemas]);

  const requiredPlaceholders = useMemo(() => {
    if (!selectedSchema) return [];
    return extractPlaceholders(selectedSchema);
  }, [selectedSchema]);

  const handleNext = () => {
    if (selectedSchema) {
      if (requiredPlaceholders.length === 0) {
        // If no placeholders, just start the project directly
        handleStartProject();
      } else {
        // Initialize context values with empty strings
        const initialContext = requiredPlaceholders.reduce((acc, ph) => {
          acc[ph] = '';
          return acc;
        }, {} as Record<string, string>);
        setContextValues(initialContext);
        setStep(2);
      }
    }
  };
  
  const handleContextChange = (placeholder: string, value: string) => {
    setContextValues(prev => ({ ...prev, [placeholder]: value }));
  };

  const handleStartProject = () => {
    if (selectedSchema) {
      onStart(selectedSchema, contextValues);
      onClose();
    }
  };

  const renderStep1 = () => (
    <>
        <FormField label="Paso 1: Seleccionar un Esquema de Proyecto">
            <Select value={selectedSchemaId} onChange={e => setSelectedSchemaId(Number(e.target.value))}>
                <option value="">Seleccionar esquema...</option>
                {schemas.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </Select>
            {selectedSchema && (
                <p className="text-xs text-slate-400 mt-2 p-2 bg-slate-700/50 rounded-md">{selectedSchema.description}</p>
            )}
        </FormField>
    </>
  );

  const renderStep2 = () => (
    <>
        <FormField label="Paso 2: Proporcionar Contexto Inicial">
            <p className="text-xs text-slate-400 mb-3">Este esquema necesita la siguiente información para crear las tareas:</p>
            <div className="space-y-3">
                {requiredPlaceholders.map(ph => (
                    <div key={ph}>
                        <label className="text-sm text-slate-300 capitalize mb-1 block">{ph.replace(/_/g, ' ')}</label>
                        <TextInput
                            value={contextValues[ph] || ''}
                            onChange={e => handleContextChange(ph, e.target.value)}
                        />
                    </div>
                ))}
            </div>
        </FormField>
    </>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl border border-slate-700 max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-slate-700 flex justify-between items-center flex-shrink-0">
          <h3 className="text-lg font-semibold text-slate-200">Iniciar Nuevo Proyecto</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><Icon name="times" /></button>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
        </div>
         <div className="p-4 border-t border-slate-700 flex justify-between items-center flex-shrink-0">
            {step === 2 && (
                <button onClick={() => setStep(1)} className="px-4 py-2 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500">
                    Atrás
                </button>
            )}
            <div className="flex-grow"></div>
            <button onClick={onClose} className="px-4 py-2 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500 mr-2">
                Cancelar
            </button>
            {step === 1 && (
                 <button 
                    onClick={handleNext} 
                    disabled={!selectedSchema}
                    className="px-4 py-2 bg-cyan-500 text-slate-900 font-semibold rounded-md hover:bg-cyan-600 disabled:opacity-50"
                >
                    Siguiente
                </button>
            )}
             {step === 2 && (
                 <button 
                    onClick={handleStartProject}
                    className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600"
                >
                    <Icon name="rocket" className="mr-2"/>
                    Iniciar Proyecto
                </button>
            )}
        </div>
      </div>
    </div>
  );
};