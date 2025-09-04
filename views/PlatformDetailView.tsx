
// FIX: Add useCallback to imports
import React, { useState, useEffect, useCallback } from 'react';
import type { Platform, AppData, Note, DocumentAttachment, NoteAttachment } from '../types';
import { FormField } from '../components/common/FormField';
import { TextInput } from '../components/common/TextInput';
import { Select } from '../components/common/Select';
import { CountrySelector } from '../components/common/CountrySelector';
import { CollapsibleSection } from '../components/common/CollapsibleSection';
import { NotesSection } from '../components/common/NotesSection';
import { TextArea } from '../components/common/TextArea';
import { DocumentManager } from '../components/common/DocumentManager';
import { isEqual } from 'lodash-es';

interface PlatformDetailViewProps {
  initialData: Platform;
  onSave: (data: Platform) => void;
  // FIX: Update onDelete prop to accept 'number | "new"' to resolve type error from App.tsx.
  onDelete: (id: number | 'new') => void;
  onCancel: () => void;
  appData: AppData;
  onNoteAdd: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'authorName'>) => void;
  onNoteUpdate: (note: Note) => void;
  onNoteDelete: (noteId: number | 'new') => void;
  setIsDirty: (isDirty: boolean) => void;
  setSaveHandler: (handler: ((onSuccess?: () => void) => void) | null) => void;
}

export const PlatformDetailView: React.FC<PlatformDetailViewProps> = ({ initialData, onSave, onDelete, onCancel, appData, onNoteAdd, onNoteUpdate, onNoteDelete, setIsDirty, setSaveHandler }) => {
  const [data, setData] = useState<Platform>(initialData);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCountryChange = (countryId: number) => {
    setData(prev => ({ ...prev, countryId }));
  };

  // FIX: Directly call onDelete with the entity ID. The parent handler in App.tsx will manage the logic for 'new' vs. existing entities.
  const handleDeleteClick = () => onDelete(data.id);

  const platformNotes = typeof data.id === 'number' ? appData.notes.filter(n => n.entityType === 'platforms' && n.entityId === data.id) : [];

  const handleAddNote = (noteText: string, attachments: File[]) => {
    if (typeof data.id !== 'number') return;
    const newAttachments: NoteAttachment[] = attachments.map(f => ({ id: `temp-${Date.now()}`, name: f.name, url: URL.createObjectURL(f) }));
    onNoteAdd({
      entityType: 'platforms',
      entityId: data.id,
      text: noteText,
      attachments: newAttachments,
    });
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-slate-200 mb-6">{data.id === 'new' ? 'Nueva Plataforma' : `Editando: ${initialData.name}`}</h2>
      
      <CollapsibleSection title="Información General" defaultOpen>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
            <FormField label="Nombre" htmlFor="name">
                <TextInput id="name" name="name" value={data.name} onChange={handleInputChange} />
            </FormField>
            <FormField label="País" htmlFor="countryId">
                <CountrySelector countries={appData.countries} selectedCountryId={data.countryId} onChange={handleCountryChange} />
            </FormField>
            <FormField label="Tipo" htmlFor="type">
            <Select id="type" name="type" value={data.type} onChange={handleInputChange}>
                <option value="">Seleccionar tipo</option>
                <option value="Marketplace">Marketplace</option>
                <option value="Reventa">Reventa</option>
                <option value="Web propia">Web propia</option>
            </Select>
            </FormField>
            <FormField label="Estado" htmlFor="status">
            <Select id="status" name="status" value={data.status} onChange={handleInputChange}>
                <option value="En estudio">En estudio</option>
                <option value="En apertura">En apertura</option>
                <option value="Activa">Activa</option>
                <option value="Cerrada">Cerrada</option>
            </Select>
            </FormField>
             <FormField label="URL de la Plataforma" htmlFor="url" className="md:col-span-2">
                <TextInput id="url" name="url" value={data.url || ''} onChange={handleInputChange} placeholder="https://www.example.com/" />
            </FormField>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Sistema de Pedidos">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
            <FormField label="URL Sistema de Gestión" htmlFor="orderSystemUrl">
                <TextInput id="orderSystemUrl" name="orderSystemUrl" value={data.orderSystemUrl || ''} onChange={handleInputChange} />
            </FormField>
             <FormField label="Detalles Adicionales" htmlFor="orderSystemDetails" className="md:col-span-2">
                <TextArea id="orderSystemDetails" name="orderSystemDetails" value={data.orderSystemDetails || ''} onChange={handleInputChange} rows={3} />
            </FormField>
            <FormField label="Usuario" htmlFor="orderSystemUser">
                <TextInput id="orderSystemUser" name="orderSystemUser" value={data.orderSystemUser || ''} onChange={handleInputChange} />
            </FormField>
            <FormField label="Contraseña" htmlFor="orderSystemPassword">
                <TextInput type="password" id="orderSystemPassword" name="orderSystemPassword" value={data.orderSystemPassword || ''} onChange={handleInputChange} />
            </FormField>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Documentos Adjuntos">
        <div className="p-4">
            <DocumentManager
                documents={data.attachedDocuments || []}
                onDocumentsChange={(docs) => setData(prev => ({...prev, attachedDocuments: docs}))}
            />
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Notas de Colaboración">
         <div className="p-4">
            {typeof data.id === 'number' ? (
                <NotesSection
                    notes={platformNotes}
                    onAddNote={handleAddNote}
                    onUpdateNote={onNoteUpdate}
                    onDeleteNote={onNoteDelete}
                />
            ) : (
                <p className="text-slate-500 text-center py-4">Guarda la plataforma para poder añadir notas.</p>
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