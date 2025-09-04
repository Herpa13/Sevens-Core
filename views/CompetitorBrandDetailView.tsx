// FIX: Add useCallback to imports
import React, { useState, useEffect, useCallback } from 'react';
import type { CompetitorBrand, AppData, Note, NoteAttachment } from '../types';
import { FormField } from '../components/common/FormField';
import { TextInput } from '../components/common/TextInput';
import { Icon } from '../components/common/Icon';
import { CollapsibleSection } from '../components/common/CollapsibleSection';
import { NotesSection } from '../components/common/NotesSection';
import { isEqual } from 'lodash-es';

interface CompetitorBrandDetailViewProps {
  initialData: CompetitorBrand;
  onSave: (data: CompetitorBrand) => void;
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

export const CompetitorBrandDetailView: React.FC<CompetitorBrandDetailViewProps> = ({ initialData, onSave, onDelete, onCancel, appData, onNoteAdd, onNoteUpdate, onNoteDelete, setIsDirty, setSaveHandler }) => {
  const [data, setData] = useState<CompetitorBrand>(initialData);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData.logoUrl || null);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const previewUrl = URL.createObjectURL(file);
          setImagePreview(previewUrl);
          setData(prev => ({...prev, logoUrl: previewUrl}));
      }
  };
  
  const handleRemoveImage = () => {
      setImagePreview(null);
      setData(prev => ({...prev, logoUrl: undefined}));
  };

  const handleDeleteClick = () => onDelete(data.id);
  
  const competitorBrandNotes = typeof data.id === 'number' ? appData.notes.filter(n => n.entityType === 'competitorBrands' && n.entityId === data.id) : [];

  const handleAddNote = (noteText: string, attachments: File[]) => {
    if (typeof data.id !== 'number') return;
    const newAttachments: NoteAttachment[] = attachments.map(f => ({ id: `temp-${Date.now()}`, name: f.name, url: URL.createObjectURL(f) }));
    onNoteAdd({
      entityType: 'competitorBrands',
      entityId: data.id,
      text: noteText,
      attachments: newAttachments,
    });
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-slate-200 mb-6">{data.id === 'new' ? 'Nueva Marca Competidora' : `Editando: ${initialData.name}`}</h2>
      
      <CollapsibleSection title="Información General" defaultOpen>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
                <FormField label="Nombre de la Marca" htmlFor="name">
                    <TextInput id="name" name="name" value={data.name} onChange={handleInputChange} />
                </FormField>
                <FormField label="Tipología de producto" htmlFor="productTypology">
                    <TextInput id="productTypology" name="productTypology" value={data.productTypology || ''} onChange={handleInputChange} placeholder="Ej: Suplementos humanos" />
                </FormField>
            </div>
            <FormField label="Logo" htmlFor="logoUrl">
                <div className="mt-1">
                    <div className="w-full h-48 bg-slate-700/50 rounded-md flex items-center justify-center overflow-hidden border border-slate-600">
                        {imagePreview ? (
                        <img src={imagePreview} alt="Vista previa del logo" className="h-full w-full object-contain" />
                        ) : (
                        <div className="text-center">
                            <Icon name="image" className="text-4xl text-slate-500" />
                            <p className="text-xs text-slate-400 mt-1">Sin logo</p>
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
      </CollapsibleSection>
      
      <CollapsibleSection title="Notas de Colaboración">
         <div className="p-4">
            {typeof data.id === 'number' ? (
                <NotesSection
                    notes={competitorBrandNotes}
                    onAddNote={handleAddNote}
                    onUpdateNote={onNoteUpdate}
                    onDeleteNote={onNoteDelete}
                />
            ) : (
                <p className="text-slate-500 text-center py-4">Guarda la marca para poder añadir notas.</p>
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