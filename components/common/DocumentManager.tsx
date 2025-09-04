
import React, { useState } from 'react';
import type { DocumentAttachment } from '../../types';
import { FormField } from './FormField';
import { TextInput } from './TextInput';
import { Icon } from './Icon';

interface DocumentManagerProps {
  documents: DocumentAttachment[];
  onDocumentsChange: (documents: DocumentAttachment[]) => void;
  title?: string;
}

export const DocumentManager: React.FC<DocumentManagerProps> = ({ documents, onDocumentsChange, title = "Archivos Adjuntos" }) => {
  const [newDocument, setNewDocument] = useState({ name: '', url: '', comment: '' });

  const handleAddDocument = () => {
    if (!newDocument.name || !newDocument.url) {
      alert("El nombre y la URL del documento son obligatorios.");
      return;
    }
    const newDoc: DocumentAttachment = {
      ...newDocument,
      id: `temp-${Date.now()}`,
    };
    onDocumentsChange([...documents, newDoc]);
    setNewDocument({ name: '', url: '', comment: '' }); // Reset form
  };

  const handleRemoveDocument = (idToRemove: string | number) => {
    onDocumentsChange(documents.filter(doc => doc.id !== idToRemove));
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-slate-200 mb-3">{title}</h3>
      <div className="space-y-3">
        {documents && documents.length > 0 ? (
          documents.map(doc => (
            <div key={doc.id} className="flex items-center justify-between bg-slate-700/50 p-3 rounded-md">
              <div className="flex-grow mr-4">
                <a href={doc.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-cyan-400 hover:underline break-all flex items-center">
                  <Icon name="link" className="mr-2" />
                  {doc.name}
                </a>
                {doc.comment && <p className="text-sm text-slate-400 mt-1 pl-5">{doc.comment}</p>}
              </div>
              <button onClick={() => handleRemoveDocument(doc.id)} className="text-red-400 hover:text-red-300 p-1 flex-shrink-0">
                <Icon name="trash" />
              </button>
            </div>
          ))
        ) : <p className="text-slate-500 text-center py-4">No hay documentos adjuntos.</p>}
      </div>

      <div className="pt-4 mt-4 border-t border-slate-700">
        <h4 className="font-semibold text-slate-300 mb-2">Añadir Nuevo Documento</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <FormField label="Nombre Documento" className="mb-0">
            <TextInput name="name" value={newDocument.name} onChange={e => setNewDocument(p => ({ ...p, name: e.target.value }))} />
          </FormField>
          <FormField label="URL Documento" className="mb-0">
            <TextInput name="url" value={newDocument.url} onChange={e => setNewDocument(p => ({ ...p, url: e.target.value }))} placeholder="https://" />
          </FormField>
          <FormField label="Comentario" className="mb-0">
            <TextInput name="comment" value={newDocument.comment || ''} onChange={e => setNewDocument(p => ({ ...p, comment: e.target.value }))} />
          </FormField>
        </div>
        <div className="flex justify-end mt-3">
             <button onClick={handleAddDocument} disabled={!newDocument.name || !newDocument.url} className="px-4 py-2 bg-cyan-500 text-slate-900 font-semibold rounded-md hover:bg-cyan-600 h-10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center">
                <Icon name="plus" className="mr-2"/>
                Añadir Documento
            </button>
        </div>
      </div>
    </div>
  );
};
