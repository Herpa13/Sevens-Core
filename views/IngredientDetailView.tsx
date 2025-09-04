import React, { useState, FC, useEffect, useCallback } from 'react';
import type { Ingredient, AppData, IngredientCountryDetail, VRN, MeasureUnit, Note, NoteAttachment } from '../types';
import { FormField } from '../components/common/FormField';
import { TextInput } from '../components/common/TextInput';
import { Select } from '../components/common/Select';
import { CollapsibleSection } from '../components/common/CollapsibleSection';
import { Icon } from '../components/common/Icon';
import { CountrySelector } from '../components/common/CountrySelector';
import { TextArea } from '../components/common/TextArea';
import { AuditLogDisplay } from '../components/common/AuditLogDisplay';
import { isEqual } from 'lodash-es';
import { KeywordManager } from '../components/common/KeywordManager';
import { NotesSection } from '../components/common/NotesSection';

interface IngredientDetailViewProps {
  initialData: Ingredient;
  onSave: (data: Ingredient) => void;
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

const TabButton: React.FC<{ title: string; icon: string; isActive: boolean; onClick: () => void; }> = ({ title, icon, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center space-x-2 py-2 px-4 text-sm font-medium rounded-t-lg border-b-2
            ${isActive
                ? 'border-cyan-500 text-cyan-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600'
            }`}
    >
        <Icon name={icon} />
        <span>{title}</span>
    </button>
);

const CountryRegulationEditor: React.FC<{
    country: AppData['countries'][0];
    detail: IngredientCountryDetail | undefined;
    onDetailChange: (countryId: number, field: keyof IngredientCountryDetail, value: any) => void;
}> = ({ country, detail, onDetailChange }) => {

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'number' ? Number(value) : value;
        onDetailChange(country.id as number, name as keyof IngredientCountryDetail, val);
    };

    const handleVrnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'number' ? Number(value) : value;
        const newVrn = { ...(detail?.vrn || { baseQuantity: 0, baseUnit: 'mg', percentage: 100 }), [name]: val };
        onDetailChange(country.id as number, 'vrn', newVrn);
    };

    // FIX: Add missing optional properties 'vrn' and 'sourceInfo' to the fallback object to match the IngredientCountryDetail type.
    const d = detail || { countryId: country.id as number, name: '', status: 'En estudio', permittedClaims: [], labelDisclaimers: [], vrn: undefined, sourceInfo: undefined };

    return (
        <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Nombre en este País" htmlFor={`name-${country.id}`}><TextInput id={`name-${country.id}`} name="name" value={d.name} onChange={handleInputChange} /></FormField>
                <FormField label="Estado Regulatorio" htmlFor={`status-${country.id}`}>
                    <Select id={`status-${country.id}`} name="status" value={d.status} onChange={handleInputChange}>
                        <option value="Permitido">Permitido</option>
                        <option value="Prohibido">Prohibido</option>
                        <option value="Con restricciones">Con restricciones</option>
                        <option value="En estudio">En estudio</option>
                    </Select>
                </FormField>
            </div>
            <CollapsibleSection title="VRN (Valor de Referencia Nutricional)">
                <div className="grid grid-cols-3 gap-4 p-4">
                     <FormField label="Cantidad Base"><TextInput type="number" name="baseQuantity" value={d.vrn?.baseQuantity || ''} onChange={handleVrnChange}/></FormField>
                     <FormField label="Unidad Base"><Select name="baseUnit" value={d.vrn?.baseUnit || ''} onChange={handleVrnChange}><option value="mg">mg</option><option value="g">g</option><option value="µg">µg</option><option value="UI">UI</option></Select></FormField>
                     <FormField label="Porcentaje (%)"><TextInput type="number" name="percentage" value={d.vrn?.percentage || ''} onChange={handleVrnChange}/></FormField>
                </div>
            </CollapsibleSection>
            <FormField label="Alegaciones de Salud Permitidas (Claims)">
                <KeywordManager keywords={d.permittedClaims || []} onChange={k => onDetailChange(country.id as number, 'permittedClaims', k)} />
            </FormField>
            <FormField label="Advertencias para Etiqueta (Disclaimers)">
                 <KeywordManager keywords={d.labelDisclaimers || []} onChange={k => onDetailChange(country.id as number, 'labelDisclaimers', k)} />
            </FormField>
             <FormField label="Fuente / Información Adicional"><TextArea name="sourceInfo" value={d.sourceInfo || ''} onChange={handleInputChange} rows={2}/></FormField>
        </div>
    );
};


// --- START TAB COMPONENTS ---

const MainTab: React.FC<{
    data: Ingredient;
    setData: React.Dispatch<React.SetStateAction<Ingredient>>;
    appData: AppData;
}> = ({ data, setData, appData }) => {

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const handleCountryDetailChange = (countryId: number, field: keyof IngredientCountryDetail, value: any) => {
        setData(prev => {
            const countryDetails = [...prev.countryDetails];
            let detailIndex = countryDetails.findIndex(d => d.countryId === countryId);

            if (detailIndex === -1) {
                countryDetails.push({ countryId, name: '', status: 'En estudio', permittedClaims: [], labelDisclaimers: [] });
                detailIndex = countryDetails.length - 1;
            }
            
            const updatedDetail = { ...countryDetails[detailIndex], [field]: value };
            countryDetails[detailIndex] = updatedDetail;
            
            return { ...prev, countryDetails };
        });
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField label="Nombre Latín / Científico" htmlFor="latinName"><TextInput id="latinName" name="latinName" value={data.latinName} onChange={handleInputChange} /></FormField>
                <FormField label="Tipo" htmlFor="type">
                    <Select id="type" name="type" value={data.type} onChange={handleInputChange}>
                        <option value="">Seleccionar tipo</option>
                        <option value="Componente Activo">Componente Activo</option>
                        <option value="Excipiente">Excipiente</option>
                    </Select>
                </FormField>
                <FormField label="Unidad de Medida por Defecto" htmlFor="measureUnit">
                    <Select id="measureUnit" name="measureUnit" value={data.measureUnit} onChange={handleInputChange}>
                        <option value="">Seleccionar unidad</option>
                        <option value="mg">mg</option>
                        <option value="g">g</option>
                        <option value="µg">µg</option>
                        <option value="UI">UI</option>
                    </Select>
                </FormField>
            </div>
            <CollapsibleSection title="Regulación por País" defaultOpen>
                <div className="p-4 space-y-3">
                   {appData.countries.map(country => (
                       <CollapsibleSection key={country.id} title={country.name}>
                           <CountryRegulationEditor
                                country={country}
                                detail={data.countryDetails.find(d => d.countryId === country.id)}
                                onDetailChange={handleCountryDetailChange}
                           />
                       </CollapsibleSection>
                   ))}
                </div>
            </CollapsibleSection>
        </>
    );
};

const HistoryTab: React.FC<{ data: Ingredient; appData: AppData }> = ({ data, appData }) => {
    if (typeof data.id !== 'number') {
        return <div className="text-center text-slate-500 p-8">Guarda el ingrediente para ver su historial.</div>;
    }
    const logs = appData.logs
      .filter(l => l.entityType === 'ingredients' && l.entityId === data.id)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return <AuditLogDisplay logs={logs} />;
};

const NotesTab: FC<{
    data: Ingredient;
    appData: AppData;
    onNoteAdd: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'authorName'>) => void;
    onNoteUpdate: (note: Note) => void;
    onNoteDelete: (noteId: number | 'new') => void;
}> = ({ data, appData, onNoteAdd, onNoteUpdate, onNoteDelete }) => {
    const ingredientNotes = typeof data.id === 'number'
      ? appData.notes.filter(n => n.entityType === 'ingredients' && n.entityId === data.id)
      : [];

    const handleAddNote = (noteText: string, attachments: File[]) => {
        if (typeof data.id !== 'number') return;
        const newAttachments: NoteAttachment[] = attachments.map(f => ({ id: `temp-${Date.now()}`, name: f.name, url: URL.createObjectURL(f) }));
        onNoteAdd({
            entityType: 'ingredients',
            entityId: data.id,
            text: noteText,
            attachments: newAttachments,
        });
    };

    return (
        <div>
            {typeof data.id === 'number' ? (
                <NotesSection
                    notes={ingredientNotes}
                    onAddNote={handleAddNote}
                    onUpdateNote={onNoteUpdate}
                    onDeleteNote={onNoteDelete}
                />
            ) : (
                <p className="text-slate-500 text-center py-4">Guarda el ingrediente para poder añadir notas.</p>
            )}
        </div>
    );
};


// --- END TAB COMPONENTS ---

export const IngredientDetailView: React.FC<IngredientDetailViewProps> = ({ initialData, onSave, onDelete, onCancel, appData, setIsDirty, setSaveHandler, onNoteAdd, onNoteUpdate, onNoteDelete }) => {
    const [data, setData] = useState<Ingredient>(initialData);
    const [activeTab, setActiveTab] = useState('main');

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


    const handleDeleteClick = () => onDelete(data.id);

    return (
        <div className="bg-slate-800 rounded-lg">
            <div className="p-4 sm:p-6 border-b border-slate-700">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-slate-200">{data.id === 'new' ? 'Nuevo Ingrediente' : `Editando: ${initialData.latinName}`}</h2>
                    <div className="flex space-x-2">
                        {data.id !== 'new' && <button onClick={handleDeleteClick} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 font-semibold">Eliminar</button>}
                        <button onClick={onCancel} className="px-4 py-2 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500 font-semibold">Cancelar</button>
                        <button onClick={() => handleSaveClick()} className="px-4 py-2 bg-cyan-500 text-slate-900 rounded-md hover:bg-cyan-600 font-semibold">Guardar</button>
                    </div>
                </div>
            </div>

            <div className="border-b border-slate-700 bg-slate-800 px-4">
                <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                    <TabButton title="Principal" icon="flask" isActive={activeTab === 'main'} onClick={() => setActiveTab('main')} />
                    <TabButton title="Notas" icon="sticky-note" isActive={activeTab === 'notes'} onClick={() => setActiveTab('notes')} />
                    <TabButton title="Historial" icon="history" isActive={activeTab === 'history'} onClick={() => setActiveTab('history')} />
                </nav>
            </div>

            <div className="p-4 sm:p-6 lg:p-8 bg-slate-900 rounded-b-lg">
                {activeTab === 'main' && <MainTab data={data} setData={setData} appData={appData} />}
                {activeTab === 'notes' && <NotesTab data={data} appData={appData} onNoteAdd={onNoteAdd} onNoteUpdate={onNoteUpdate} onNoteDelete={onNoteDelete} />}
                {activeTab === 'history' && <HistoryTab data={data} appData={appData} />}
            </div>
        </div>
    );
};