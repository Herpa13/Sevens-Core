
// FIX: Add useCallback to imports
import React, { useState, useEffect, useCallback } from 'react';
import type { Envase, Note, NoteAttachment, AppData } from '../types';
import { FormField } from '../components/common/FormField';
import { TextInput } from '../components/common/TextInput';
import { Select } from '../components/common/Select';
import { Icon } from '../components/common/Icon';
import { isEqual } from 'lodash-es';
import { CollapsibleSection } from '../components/common/CollapsibleSection';
import { NotesSection } from '../components/common/NotesSection';

interface EnvaseDetailViewProps {
  initialData: Envase;
  onSave: (data: Envase) => void;
  // FIX: Update onDelete prop to accept 'number | "new"' to resolve type error from App.tsx.
  onDelete: (id: number | 'new') => void;
  onCancel: () => void;
  setIsDirty: (isDirty: boolean) => void;
  setSaveHandler: (handler: ((onSuccess?: () => void) => void) | null) => void;
  appData: AppData;
  onNoteAdd: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'authorName'>) => void;
  onNoteUpdate: (note: Note) => void;
  onNoteDelete: (noteId: number | 'new') => void;
}

export const EnvaseDetailView: React.FC<EnvaseDetailViewProps> = ({ initialData, onSave, onDelete, onCancel, setIsDirty, setSaveHandler, appData, onNoteAdd, onNoteUpdate, onNoteDelete }) => {
  const [data, setData] = useState<Envase>(initialData);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData.fotoUrl || null);

  const handleSaveClick = useCallback((onSuccess?: () => void) => {
    onSave(data);
    if (onSuccess) {
      onSuccess();
    }
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'number' ? (value === '' ? undefined : Number(value)) : value;
    setData(prev => ({ ...prev, [name]: val }));
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const previewUrl = URL.createObjectURL(file);
          setImagePreview(previewUrl);
          setData(prev => ({...prev, fotoUrl: previewUrl}));
      }
  };
  
  const handleRemoveImage = () => {
      setImagePreview(null);
      setData(prev => ({...prev, fotoUrl: undefined}));
  };

  // FIX: Directly call onDelete with the entity ID. The parent handler in App.tsx will manage the logic for 'new' vs. existing entities.
  const handleDeleteClick = () => onDelete(data.id);
  
  const envaseNotes = typeof data.id === 'number' ? appData.notes.filter(n => n.entityType === 'envases' && n.entityId === data.id) : [];

  const handleAddNote = (noteText: string, attachments: File[]) => {
    if (typeof data.id !== 'number') return;
    const newAttachments: NoteAttachment[] = attachments.map(f => ({ id: `temp-${Date.now()}`, name: f.name, url: URL.createObjectURL(f) }));
    onNoteAdd({
      entityType: 'envases',
      entityId: data.id,
      text: noteText,
      attachments: newAttachments,
    });
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-slate-200 mb-6">{data.id === 'new' ? 'Nuevo Envase' : `Editando: ${initialData.name}`}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Nombre del Envase" htmlFor="name">
          <TextInput id="name" name="name" value={data.name} onChange={handleInputChange} />
        </FormField>
        <FormField label="Tipo" htmlFor="tipo">
          <Select id="tipo" name="tipo" value={data.tipo || ''} onChange={handleInputChange}>
            <option value="">Seleccionar tipo</option>
            <option value="Bote">Bote</option>
            <option value="Doypack">Doypack</option>
            <option value="Blister">Blister</option>
            <option value="Caja">Caja</option>
          </Select>
        </FormField>
        <FormField label="Anchura (cm)" htmlFor="width">
            <TextInput type="number" id="width" name="width" value={data.width || ''} onChange={handleInputChange} />
        </FormField>
        <FormField label="Longitud (cm)" htmlFor="length">
            <TextInput type="number" id="length" name="length" value={data.length || ''} onChange={handleInputChange} />
        </FormField>
        <FormField label="Altura (cm)" htmlFor="height">
            <TextInput type="number" id="height" name="height" value={data.height || ''} onChange={handleInputChange} />
        </FormField>
        <FormField label="Peso (g)" htmlFor="peso">
          <TextInput type="number" id="peso" name="peso" value={data.peso || ''} onChange={handleInputChange} />
        </FormField>
        <FormField label="Capacidad" htmlFor="capacidad">
          <TextInput id="capacidad" name="capacidad" value={data.capacidad || ''} onChange={handleInputChange} />
        </FormField>
        <FormField label="Foto" htmlFor="fotoUrl">
          <div className="mt-1">
              <div className="w-full h-48 bg-slate-700/50 rounded-md flex items-center justify-center overflow-hidden border border-slate-600">
                  {imagePreview ? (
                  <img src={imagePreview} alt="Vista previa del envase" className="h-full w-full object-contain" />
                  ) : (
                  <div className="text-center">
                      <Icon name="image" className="text-4xl text-slate-500" />
                      <p className="text-xs text-slate-400 mt-1">Sin imagen</p>
                  </div>
                  )}
              </div>
              <div className="flex items-center space-x-2 mt-2">
                  <label className="px-3 py-1.5 bg-slate-700 border border-slate-600 rounded-md shadow-sm text-sm font-medium text-slate-300 hover:bg-slate-600 cursor-pointer">
                      <span>Cambiar</span>
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                  </label>
                  {imagePreview && (
                  <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="px-3 py-1.5 bg-red-500/20 border border-transparent rounded-md text-sm font-medium text-red-300 hover:bg-red-500/30"
                  >
                      Quitar
                  </button>
                  )}
              </div>
          </div>
        </FormField>
      </div>

       <CollapsibleSection title="Notas de Colaboración">
         <div className="p-4">
            {typeof data.id === 'number' ? (
                <NotesSection
                    notes={envaseNotes}
                    onAddNote={handleAddNote}
                    onUpdateNote={onNoteUpdate}
                    onDeleteNote={onNoteDelete}
                />
            ) : (
                <p className="text-slate-500 text-center py-4">Guarda el envase para poder añadir notas.</p>
            )}
         </div>
      </CollapsibleSection>

      <div className="mt-8 flex justify-end space-x-4">
        {data.id !== 'new' && <button onClick={handleDeleteClick} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 font-semibold">Eliminar</button>}
        <button onClick={onCancel} className="px-4 py-2 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500 font-semibold">Cancelar</button>
        <button onClick={() => handleSaveClick()} className="px-4 py-2 bg-cyan-500 text-slate-900 rounded-md hover:bg-cyan-600 font-semibold">Guardar</button>
      </div>
    </div>
  );
};