// FIX: Add useCallback and useEffect imports
import React, { useState, useEffect, useCallback } from 'react';
import type { CompetitorProduct, AppData, CompetitorProductSnapshot, Note, NoteAttachment } from '../types';
import { FormField } from '../components/common/FormField';
import { TextInput } from '../components/common/TextInput';
import { Select } from '../components/common/Select';
import { CountrySelector } from '../components/common/CountrySelector';
import { CollapsibleSection } from '../components/common/CollapsibleSection';
import { Icon } from '../components/common/Icon';
import { isEqual } from 'lodash-es';
import { NotesSection } from '../components/common/NotesSection';

interface CompetitorProductDetailViewProps {
  initialData: CompetitorProduct;
  onSave: (data: CompetitorProduct) => void;
  // FIX: Update onDelete prop to accept 'number | "new"' to resolve type error from App.tsx.
  onDelete: (id: number | 'new') => void;
  onCancel: () => void;
  appData: AppData;
  setIsDirty: (isDirty: boolean) => void;
  setSaveHandler: (handler: ((onSuccess?: () => void) => void) | null) => void;
  onNoteAdd: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'authorName'>) => void;
  onNoteUpdate: (note: Note) => void;
  onNoteDelete: (noteId: number | 'new') => void;
}

export const CompetitorProductDetailView: React.FC<CompetitorProductDetailViewProps> = ({ initialData, onSave, onDelete, onCancel, appData, setIsDirty, setSaveHandler, onNoteAdd, onNoteUpdate, onNoteDelete }) => {
  const [data, setData] = useState<CompetitorProduct>(initialData);
  const [activeSnapshotId, setActiveSnapshotId] = useState<number | 'new' | null>(initialData.snapshots[initialData.snapshots.length - 1]?.id || null);
  
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


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'number' && value !== '' ? parseInt(value) : value;
    setData(prev => ({ ...prev, [name]: val === '' ? null : val }));
  };

  const handleDeleteClick = () => onDelete(data.id);

  const handleTakeSnapshot = () => {
    // In a real app, this would trigger a backend process.
    // Here, we simulate it by adding a new snapshot with mock analysis.
    const newSnapshot: CompetitorProductSnapshot = {
        id: -Date.now(),
        competitorProductId: typeof data.id === 'number' ? data.id : undefined,
        createdAt: new Date().toISOString(),
        amazonTitle: `(Nuevo) ${data.name} - ${new Date().toLocaleDateString()}`,
        amazonDescription: 'Descripción capturada en la nueva fecha. La competencia ha añadido más detalles sobre los ingredientes.',
        amazonBulletPoints: ['NUEVO BENEFICIO 1', 'NUEVO BENEFICIO 2', 'NUEVO BENEFICIO 3'],
        amazonPhotos: [{ url: 'https://images.unsplash.com/photo-1575464383418-c33116c0b398?q=80&w=200' }],
        titleAnalysis: 'Análisis IA (Nuevo): Han añadido la palabra "Rápida Absorción" al título. Esto indica una nueva estrategia de marketing.',
        descriptionAnalysis: 'Análisis IA (Nuevo): La descripción ahora es más larga y detalla el proceso de fabricación. Intentan justificar un precio más alto.',
        aPlusAnalysis: 'Análisis IA (Nuevo): Han implementado contenido A+ básico con dos módulos. Sigue siendo una oportunidad para nosotros crear un A+ superior.',
        infographicsAnalysis: 'Análisis IA (Nuevo): Han cambiado la segunda infografía para mostrar un gráfico de "satisfacción del cliente".',
        reviewsAnalysis: 'Análisis IA (Nuevo): Las últimas reseñas son positivas sobre la nueva fórmula, pero mencionan que el precio ha subido.',
    };
    
    setData(prev => ({
        ...prev,
        snapshots: [...prev.snapshots, newSnapshot]
    }));
    setActiveSnapshotId(newSnapshot.id);
  };
  
  const handleAddNote = (noteText: string, attachments: File[]) => {
    if (typeof data.id !== 'number') return;
    const newAttachments: NoteAttachment[] = attachments.map(f => ({ id: `temp-${Date.now()}`, name: f.name, url: URL.createObjectURL(f) }));
    onNoteAdd({
      entityType: 'competitorProducts',
      entityId: data.id,
      text: noteText,
      attachments: newAttachments,
    });
  };

  const activeSnapshot = data.snapshots.find(s => s.id === activeSnapshotId);
  const competitorProductNotes = typeof data.id === 'number' ? appData.notes.filter(n => n.entityType === 'competitorProducts' && n.entityId === data.id) : [];

  return (
    <div className="bg-slate-800 rounded-lg">
        <div className="p-4 sm:p-6 border-b border-slate-700">
            <h2 className="text-2xl font-bold text-slate-200 mb-6">{data.id === 'new' ? 'Nuevo Producto Competidor' : `Análisis: ${initialData.name}`}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField label="Nombre Interno" htmlFor="name"><TextInput id="name" name="name" value={data.name} onChange={handleInputChange} /></FormField>
                <FormField label="ASIN" htmlFor="asin"><TextInput id="asin" name="asin" value={data.asin} onChange={handleInputChange} /></FormField>
                 <FormField label="Marca Competidora" htmlFor="competitorBrandId">
                    <Select id="competitorBrandId" name="competitorBrandId" value={data.competitorBrandId || ''} onChange={handleInputChange}>
                        <option value="">Seleccionar marca</option>
                        {appData.competitorBrands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </Select>
                </FormField>
                <FormField label="País" htmlFor="countryId">
                    <CountrySelector countries={appData.countries} selectedCountryId={data.countryId} onChange={(id) => setData(p => ({...p, countryId: id}))} />
                </FormField>
                <FormField label="Tipología de producto" htmlFor="typology">
                    <TextInput id="typology" name="typology" value={data.typology || ''} onChange={handleInputChange} placeholder="Ej: Suplementos vitamínicos"/>
                </FormField>
                <FormField label="Compite con" htmlFor="competesWith">
                    <TextInput id="competesWith" name="competesWith" value={data.competesWith || ''} onChange={handleInputChange} placeholder="Ej: Productos para el sueño"/>
                </FormField>
            </div>
             <div className="mt-8 flex justify-end space-x-4">
                {data.id !== 'new' && <button onClick={handleDeleteClick} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 font-semibold">Eliminar</button>}
                <button onClick={onCancel} className="px-4 py-2 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500 font-semibold">Cancelar</button>
                <button onClick={() => handleSaveClick()} className="px-4 py-2 bg-cyan-500 text-slate-900 rounded-md hover:bg-cyan-600 font-semibold">Guardar Cambios</button>
            </div>
        </div>

      <div className="p-4 sm:p-6 lg:p-8 bg-slate-900 rounded-b-lg space-y-6">
        <CollapsibleSection title="Notas de Colaboración">
         <div className="p-4">
            {typeof data.id === 'number' ? (
                <NotesSection
                    notes={competitorProductNotes}
                    onAddNote={handleAddNote}
                    onUpdateNote={onNoteUpdate}
                    onDeleteNote={onNoteDelete}
                />
            ) : (
                <p className="text-slate-500 text-center py-4">Guarda el producto para poder añadir notas.</p>
            )}
         </div>
      </CollapsibleSection>
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-slate-200">Snapshots de Contenido</h3>
                <button onClick={handleTakeSnapshot} className="flex items-center px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600">
                    <Icon name="camera-retro" className="mr-2"/>
                    Tomar Snapshot con IA
                </button>
            </div>
        
            {data.snapshots.length > 0 ? (
                <>
                    <div className="border-b border-slate-700 mb-4">
                        <nav className="flex space-x-4 -mb-px overflow-x-auto">
                            {data.snapshots.map(snap => (
                                <button key={snap.id} onClick={() => setActiveSnapshotId(snap.id)}
                                    className={`py-2 px-3 font-medium text-sm rounded-t-lg whitespace-nowrap ${activeSnapshotId === snap.id ? 'border-b-2 border-cyan-500 text-cyan-400' : 'text-slate-400 hover:text-slate-200'}`}>
                                    Snapshot {new Date(snap.createdAt).toLocaleDateString()}
                                </button>
                            ))}
                        </nav>
                    </div>
                    {activeSnapshot && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-1 space-y-4">
                                <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                                    <h4 className="font-bold text-slate-200 mb-2">Contenido Capturado</h4>
                                    <p className="text-sm text-slate-400"><strong>Título:</strong> {activeSnapshot.amazonTitle}</p>
                                    <p className="text-sm text-slate-400 mt-2"><strong>Descripción:</strong> {activeSnapshot.amazonDescription}</p>
                                    <ul className="text-sm text-slate-400 list-disc list-inside mt-2 space-y-1">
                                        <strong>Bulletpoints:</strong>
                                        {activeSnapshot.amazonBulletPoints.map((bp, i) => <li key={i}>{bp}</li>)}
                                    </ul>
                                </div>
                                <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                                    <h4 className="font-bold text-slate-200 mb-2">Fotos del Competidor</h4>
                                    <div className="grid grid-cols-3 gap-2">
                                    {activeSnapshot.amazonPhotos.map((photo, i) => (
                                        <img key={i} src={photo.url} alt={`Foto competidor ${i+1}`} className="w-full h-auto object-cover rounded-md"/>
                                    ))}
                                    </div>
                                </div>
                            </div>
                            <div className="lg:col-span-2 space-y-4">
                                <CollapsibleSection title="Análisis IA: Título">
                                    <p className="text-sm text-slate-300 whitespace-pre-wrap">{activeSnapshot.titleAnalysis}</p>
                                </CollapsibleSection>
                                <CollapsibleSection title="Análisis IA: Descripción">
                                    <p className="text-sm text-slate-300 whitespace-pre-wrap">{activeSnapshot.descriptionAnalysis}</p>
                                </CollapsibleSection>
                                <CollapsibleSection title="Análisis IA: Contenido A+">
                                    <p className="text-sm text-slate-300 whitespace-pre-wrap">{activeSnapshot.aPlusAnalysis}</p>
                                </CollapsibleSection>
                                <CollapsibleSection title="Análisis IA: Infografías">
                                    <p className="text-sm text-slate-300 whitespace-pre-wrap">{activeSnapshot.infographicsAnalysis}</p>
                                </CollapsibleSection>
                                <CollapsibleSection title="Análisis IA: Reseñas">
                                    <p className="text-sm text-slate-300 whitespace-pre-wrap">{activeSnapshot.reviewsAnalysis}</p>
                                </CollapsibleSection>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center p-12 text-slate-500">
                    <Icon name="folder-open" className="text-4xl mb-4" />
                    <p>No hay snapshots para este producto.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};