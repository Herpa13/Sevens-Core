import React, { useState, useMemo, useCallback, useEffect } from 'react';
import type { VideoCompositionTemplate, AppData, SequenceTemplate } from '../types';
import { FormField } from '../components/common/FormField';
import { TextInput } from '../components/common/TextInput';
import { TextArea } from '../components/common/TextArea';
import { Icon } from '../components/common/Icon';
import { isEqual } from 'lodash-es';

interface VideoCompositionTemplateDetailViewProps {
  initialData: VideoCompositionTemplate;
  onSave: (data: VideoCompositionTemplate) => void;
  onDelete: (id: number) => void;
  onCancel: () => void;
  appData: AppData;
  setIsDirty: (isDirty: boolean) => void;
  setSaveHandler: (handler: ((onSuccess?: () => void) => void) | null) => void;
}

const DraggableSequenceTemplate: React.FC<{
    template: SequenceTemplate;
    onDragStart: (e: React.DragEvent<HTMLDivElement>, templateId: number) => void;
}> = ({ template, onDragStart }) => (
    <div 
        draggable
        onDragStart={(e) => onDragStart(e, template.id as number)}
        className="p-3 bg-slate-800/60 rounded-lg border border-slate-700 cursor-grab active:cursor-grabbing"
    >
        <h5 className="font-bold text-cyan-400 text-sm">{template.name}</h5>
        <p className="text-xs text-slate-400">{template.description}</p>
    </div>
);

const DroppedSequenceTemplate: React.FC<{
    template: SequenceTemplate;
    onRemove: () => void;
    onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
    onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
}> = ({ template, onRemove, onDragStart, onDrop }) => {
    return (
         <div 
            draggable 
            onDragStart={onDragStart}
            onDrop={onDrop}
            onDragOver={(e) => e.preventDefault()}
            className="flex items-center justify-between p-2 bg-slate-700 rounded-md"
        >
            <div className="flex items-center">
                <Icon name="grip-vertical" className="mr-3 text-slate-500 cursor-grab active:cursor-grabbing" />
                <div>
                    <span className="text-sm font-semibold text-slate-200">{template.name}</span>
                    <span className="text-xs text-slate-400 ml-2">({template.category})</span>
                </div>
            </div>
            <button onClick={onRemove} className="text-red-400 hover:text-red-300"><Icon name="trash" /></button>
        </div>
    );
}

export const VideoCompositionTemplateDetailView: React.FC<VideoCompositionTemplateDetailViewProps> = ({ initialData, onSave, onDelete, onCancel, appData, setIsDirty, setSaveHandler }) => {
  const [data, setData] = useState<VideoCompositionTemplate>(initialData);
  const [dragOver, setDragOver] = useState(false);
  const [draggedItemId, setDraggedItemId] = useState<number | string | null>(null);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };
  
  const compositionSequences = useMemo(() => {
    return data.sequenceTemplateIds
        .map(id => appData.sequenceTemplates.find(t => t.id === id))
        .filter((t): t is SequenceTemplate => t !== undefined);
  }, [data.sequenceTemplateIds, appData.sequenceTemplates]);

  const onDragStartSource = (e: React.DragEvent<HTMLDivElement>, templateId: number) => {
    e.dataTransfer.setData("application/json", JSON.stringify({ id: templateId, from: 'source' }));
  };

  const onDragStartCanvas = (e: React.DragEvent<HTMLDivElement>, templateId: number | string) => {
    e.dataTransfer.setData("application/json", JSON.stringify({ id: templateId, from: 'canvas' }));
    setDraggedItemId(templateId);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dropData = JSON.parse(e.dataTransfer.getData("application/json"));
    
    if(dropData.from === 'source') {
        setData(prev => ({...prev, sequenceTemplateIds: [...prev.sequenceTemplateIds, dropData.id]}));
    }
    setDragOver(false);
  };
  
  const onDropOnItem = (e: React.DragEvent<HTMLDivElement>, targetId: number | string) => {
    e.preventDefault();
    e.stopPropagation();
    const dropData = JSON.parse(e.dataTransfer.getData("application/json"));
    
    if (dropData.from === 'canvas' && draggedItemId && draggedItemId !== targetId) {
        const sequenceIds = [...data.sequenceTemplateIds];
        const draggedIndex = sequenceIds.findIndex(id => id === draggedItemId);
        const targetIndex = sequenceIds.findIndex(id => id === targetId);
        
        const [draggedItem] = sequenceIds.splice(draggedIndex, 1);
        sequenceIds.splice(targetIndex, 0, draggedItem);
        
        setData(prev => ({ ...prev, sequenceTemplateIds: sequenceIds }));
    }
    setDraggedItemId(null);
  };
  
  const removeSequence = (idToRemove: number | string) => {
    setData(prev => ({
        ...prev,
        sequenceTemplateIds: prev.sequenceTemplateIds.filter(id => id !== idToRemove)
    }));
  }

  const handleDeleteClick = () => (typeof data.id === 'number' ? onDelete(data.id) : undefined);

  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-slate-200 mb-6">{data.id === 'new' ? 'Nueva Plantilla de Vídeo' : `Editando Plantilla: ${initialData.name}`}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <FormField label="Nombre de la Plantilla" htmlFor="name">
          <TextInput id="name" name="name" value={data.name} onChange={handleInputChange} />
        </FormField>
        <FormField label="Descripción" htmlFor="description">
          <TextArea id="description" name="description" value={data.description} onChange={handleInputChange} rows={2}/>
        </FormField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
            <h3 className="text-lg font-semibold text-slate-300 mb-3">Biblioteca de Secuencias</h3>
            <div className="space-y-2 p-3 bg-slate-900/50 rounded-lg max-h-96 overflow-y-auto">
                {appData.sequenceTemplates.map(template => (
                    <DraggableSequenceTemplate key={template.id} template={template} onDragStart={onDragStartSource} />
                ))}
            </div>
        </div>
        <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-slate-300 mb-3">Estructura del Vídeo</h3>
             <div 
                onDrop={onDrop}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                className={`p-4 min-h-[300px] border-2 border-dashed rounded-lg transition-colors ${dragOver ? 'border-cyan-500 bg-slate-700/50' : 'border-slate-600'}`}
             >
                {compositionSequences.length === 0 ? (
                    <div className="text-center text-slate-500 flex flex-col items-center justify-center h-full">
                        <Icon name="hand-point-up" className="text-3xl mb-2"/>
                        <p>Arrastra las secuencias desde la biblioteca hasta aquí para construir tu vídeo.</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {compositionSequences.map((template, index) => (
                             <DroppedSequenceTemplate 
                                key={`${template.id}-${index}`} 
                                template={template} 
                                onRemove={() => removeSequence(template.id)}
                                onDragStart={(e) => onDragStartCanvas(e, template.id)}
                                onDrop={(e) => onDropOnItem(e, template.id)}
                             />
                        ))}
                    </div>
                )}
            </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end space-x-4">
        {data.id !== 'new' && <button onClick={handleDeleteClick} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 font-semibold">Eliminar</button>}
        <button onClick={onCancel} className="px-4 py-2 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500 font-semibold">Cancelar</button>
        <button onClick={() => handleSaveClick()} className="px-4 py-2 bg-cyan-500 text-slate-900 rounded-md hover:bg-cyan-600 font-semibold">Guardar Plantilla</button>
      </div>
    </div>
  );
};
