
// FIX: Add useCallback to imports
import React, { useState, useEffect, useCallback } from 'react';
import type { Country, Note, AppData, NoteAttachment } from '../types';
import { FormField } from '../components/common/FormField';
import { TextInput } from '../components/common/TextInput';
import { TextArea } from '../components/common/TextArea';
import { isEqual } from 'lodash-es';
import { CollapsibleSection } from '../components/common/CollapsibleSection';
import { NotesSection } from '../components/common/NotesSection';

interface CountryDetailViewProps {
  initialData: Country;
  onSave: (data: Country) => void;
  // FIX: Allow `onDelete` to accept 'new' for unsaved entities, aligning with the parent component's handler.
  onDelete: (id: number | 'new') => void;
  onCancel: () => void;
  setIsDirty: (isDirty: boolean) => void;
  setSaveHandler: (handler: ((onSuccess?: () => void) => void) | null) => void;
  appData: AppData;
  onNoteAdd: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'authorName'>) => void;
  onNoteUpdate: (note: Note) => void;
  onNoteDelete: (noteId: number | 'new') => void;
}

export const CountryDetailView: React.FC<CountryDetailViewProps> = ({ initialData, onSave, onDelete, onCancel, setIsDirty, setSaveHandler, appData, onNoteAdd, onNoteUpdate, onNoteDelete }) => {
  const [data, setData] = useState<Country>(initialData);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  // FIX: Directly call onDelete with the entity ID. The parent handler in App.tsx will manage the logic for 'new' vs. existing entities.
  const handleDeleteClick = () => onDelete(data.id);
  
  const countryNotes = typeof data.id === 'number' ? appData.notes.filter(n => n.entityType === 'countries' && n.entityId === data.id) : [];

  const handleAddNote = (noteText: string, attachments: File[]) => {
    if (typeof data.id !== 'number') return;
    const newAttachments: NoteAttachment[] = attachments.map(f => ({ id: `temp-${Date.now()}`, name: f.name, url: URL.createObjectURL(f) }));
    onNoteAdd({
      entityType: 'countries',
      entityId: data.id,
      text: noteText,
      attachments: newAttachments,
    });
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-slate-200 mb-6">{data.id === 'new' ? 'Nuevo País' : `Editando: ${initialData.name}`}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Nombre del País" htmlFor="name">
          <TextInput id="name" name="name" value={data.name} onChange={handleInputChange} />
        </FormField>
        <FormField label="Código ISO" htmlFor="iso">
          <TextInput id="iso" name="iso" value={data.iso} onChange={handleInputChange} />
        </FormField>
      </div>
       <FormField label="Proceso de Notificación" htmlFor="notificationProcess">
          <TextArea id="notificationProcess" name="notificationProcess" value={data.notificationProcess || ''} onChange={handleInputChange} />
        </FormField>
         <FormField label="Documentos Requeridos" htmlFor="requiredDocuments">
          <TextArea id="requiredDocuments" name="requiredDocuments" value={data.requiredDocuments || ''} onChange={handleInputChange} />
        </FormField>
      
      <CollapsibleSection title="Notas de Colaboración">
         <div className="p-4">
            {typeof data.id === 'number' ? (
                <NotesSection
                    notes={countryNotes}
                    onAddNote={handleAddNote}
                    onUpdateNote={onNoteUpdate}
                    onDeleteNote={onNoteDelete}
                />
            ) : (
                <p className="text-slate-500 text-center py-4">Guarda el país para poder añadir notas.</p>
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