import React, { useState, FC } from 'react';
import type { MediaAsset, ProjectSequence } from '../../types';
import { FormField } from '../common/FormField';
import { TextInput } from '../common/TextInput';
import { TextArea } from '../common/TextArea';
import { KeywordManager } from '../common/KeywordManager';
import { Icon } from '../common/Icon';

interface SaveSequenceToLibraryModalProps {
  sequence: ProjectSequence;
  onClose: () => void;
  onSave: (assetData: Omit<MediaAsset, 'id'>) => void;
}

export const SaveSequenceToLibraryModal: FC<SaveSequenceToLibraryModalProps> = ({ sequence, onClose, onSave }) => {
  const [assetData, setAssetData] = useState<Omit<MediaAsset, 'id'>>({
    name: '',
    description: '',
    tags: [],
    duration: sequence.duration,
    imageUrl: sequence.image.sourceUrl || '',
    videoUrl: sequence.video.sourceUrl || '',
    voiceoverScript: sequence.voiceoverScript,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAssetData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveClick = () => {
    if (assetData.name.trim()) {
      onSave(assetData);
    } else {
      alert("El nombre del activo es obligatorio.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl border border-slate-700 max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-slate-700 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-200">Guardar Secuencia en la Biblioteca de Medios</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><Icon name="times" /></button>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto">
            <p className="text-sm text-slate-400">Estás a punto de guardar esta secuencia como un activo reutilizable. Dale un nombre y etiquetas para encontrarla fácilmente más tarde.</p>
          <FormField label="Nombre del Activo" htmlFor="name">
            <TextInput id="name" name="name" value={assetData.name} onChange={handleInputChange} placeholder="Ej: Vitamina C - Bote girando" />
          </FormField>
          <FormField label="Descripción" htmlFor="description">
            <TextArea id="description" name="description" value={assetData.description || ''} onChange={handleInputChange} rows={3}/>
          </FormField>
          <FormField label="Etiquetas (Tags)">
            <KeywordManager keywords={assetData.tags} onChange={tags => setAssetData(prev => ({...prev, tags}))} />
          </FormField>
        </div>
        <div className="p-4 border-t border-slate-700 flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500">
            Cancelar
          </button>
          <button 
            onClick={handleSaveClick} 
            disabled={!assetData.name.trim()}
            className="px-4 py-2 bg-indigo-500 text-white font-semibold rounded-md hover:bg-indigo-600 disabled:opacity-50"
          >
            <Icon name="save" className="mr-2" />
            Guardar Activo
          </button>
        </div>
      </div>
    </div>
  );
};