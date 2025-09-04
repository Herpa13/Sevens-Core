// FIX: Add useCallback to imports
import React, { useState, useEffect, useCallback } from 'react';
// FIX: Correctly import Entity and EntityType from the types module
import type { Batch, AppData, BatchDocument, TaskSchema, Task, EntityType, Entity, Note, NoteAttachment } from '../types';
import { FormField } from '../components/common/FormField';
import { TextInput } from '../components/common/TextInput';
import { Select } from '../components/common/Select';
import { Icon } from '../components/common/Icon';
import { CollapsibleSection } from '../components/common/CollapsibleSection';
import { FileUpload } from '../components/common/FileUpload';
import { ApplySchemaModal } from '../components/modals/ApplySchemaModal';
import { isEqual } from 'lodash-es';
import { NotesSection } from '../components/common/NotesSection';

interface BatchDetailViewProps {
  initialData: Batch;
  onSave: (data: Batch) => void;
  // FIX: Update onDelete prop to accept 'number | "new"' to resolve type error from App.tsx.
  onDelete: (id: number | 'new') => void;
  onCancel: () => void;
  appData: AppData;
  onApplySchema: (schema: TaskSchema, linkedEntity: { id: number, type: 'batches', name: string }) => void;
  onSelectItem: (entityType: EntityType, item: Entity) => void;
  setIsDirty: (isDirty: boolean) => void;
  setSaveHandler: (handler: ((onSuccess?: () => void) => void) | null) => void;
  onNoteAdd: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'authorName'>) => void;
  onNoteUpdate: (note: Note) => void;
  onNoteDelete: (noteId: number | 'new') => void;
}

export const BatchDetailView: React.FC<BatchDetailViewProps> = ({ initialData, onSave, onDelete, onCancel, appData, onApplySchema, onSelectItem, setIsDirty, setSaveHandler, onNoteAdd, onNoteUpdate, onNoteDelete }) => {
  const [data, setData] = useState<Batch>(initialData);
  const [isSchemaModalOpen, setIsSchemaModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('main');

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
    const isNumber = type === 'number' || ['labelId', 'productId', 'purchaseOrderId'].includes(name);
    const finalValue = isNumber ? (value ? Number(value) : undefined) : value;

    if (name === 'purchaseOrderId') {
        const order = appData.purchaseOrders.find(p => p.id === finalValue);
        setData(prev => ({
            ...prev,
            purchaseOrderId: finalValue as number,
            productId: order ? order.productId : 0, // Automatically set product
        }));
    } else {
        setData(prev => ({ ...prev, [name]: finalValue }));
    }
  };
  
  const handleFileChange = (file: File | null, field: 'technicalDataSheet' | 'manufacturingCertificate') => {
      if (file) {
          const newDoc: BatchDocument = {
              name: file.name,
              url: URL.createObjectURL(file) // Placeholder for real upload
          };
          setData(prev => ({ ...prev, [field]: newDoc }));
      }
  };
  
  const handleFileRemove = (field: 'technicalDataSheet' | 'manufacturingCertificate') => {
      setData(prev => ({ ...prev, [field]: undefined }));
  };

  const handleDeleteClick = () => onDelete(data.id);
  
  const handleApplySchemaClick = (schema: TaskSchema) => {
    onApplySchema(schema, { id: data.id as number, type: 'batches', name: data.batchNumber });
    setIsSchemaModalOpen(false);
  };

  const handleAddNote = (noteText: string, attachments: File[]) => {
    if (typeof data.id !== 'number') return;
    const newAttachments: NoteAttachment[] = attachments.map(f => ({ id: `temp-${Date.now()}`, name: f.name, url: URL.createObjectURL(f) }));
    onNoteAdd({
      entityType: 'batches',
      entityId: data.id,
      text: noteText,
      attachments: newAttachments,
    });
  };

  const associatedOrder = appData.purchaseOrders.find(p => p.id === data.purchaseOrderId);
  const availableLabels = appData.etiquetas.filter(e => e.productId === data.productId);
// Fix: Property 'triggerEntityType' does not exist on type 'TaskSchema'. Changed to 'trigger.entityType'.
  const relevantSchemas = appData.taskSchemas.filter(s => s.trigger.entityType === 'batches');
  const linkedTasks = appData.tasks.filter(t => t.linkedEntity.entityType === 'batches' && t.linkedEntity.entityId === data.id);
  const batchNotes = typeof data.id === 'number' ? appData.notes.filter(n => n.entityType === 'batches' && n.entityId === data.id) : [];


  const TabButton: React.FC<{ title: string, icon: string, isActive: boolean, onClick: () => void }> = ({ title, icon, isActive, onClick }) => (
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

  return (
    <div className="bg-slate-800 rounded-lg">
      {isSchemaModalOpen && (
          <ApplySchemaModal
              schemas={relevantSchemas}
              onApply={handleApplySchemaClick}
              onClose={() => setIsSchemaModalOpen(false)}
              entityName={data.batchNumber}
          />
      )}
      <div className="p-4 sm:p-6 border-b border-slate-700 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-200">{data.id === 'new' ? 'Nuevo Lote' : `Editando Lote: ${initialData.batchNumber}`}</h2>
        <div className="flex items-center space-x-2">
            {data.id !== 'new' && relevantSchemas.length > 0 && (
                <button
                    onClick={() => setIsSchemaModalOpen(true)}
                    className="flex items-center px-4 py-2 bg-indigo-500 text-white font-semibold rounded-md hover:bg-indigo-600"
                >
                    <Icon name="project-diagram" className="mr-2" />
                    Aplicar Esquema de Trabajo
                </button>
            )}
            {data.id !== 'new' && <button onClick={handleDeleteClick} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 font-semibold">Eliminar</button>}
            <button onClick={onCancel} className="px-4 py-2 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500 font-semibold">Cancelar</button>
            <button onClick={() => handleSaveClick()} className="px-4 py-2 bg-cyan-500 text-slate-900 rounded-md hover:bg-cyan-600 font-semibold">Guardar</button>
        </div>
      </div>

       <div className="border-b border-slate-700 bg-slate-800 px-4">
        <nav className="-mb-px flex space-x-4" aria-label="Tabs">
          <TabButton title="Principal" icon="file-alt" isActive={activeTab === 'main'} onClick={() => setActiveTab('main')} />
          <TabButton title="Notas" icon="sticky-note" isActive={activeTab === 'notes'} onClick={() => setActiveTab('notes')} />
        </nav>
      </div>

      <div className="p-6 bg-slate-900 rounded-b-lg">
        {activeTab === 'main' && (
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Pedido de Fabricación Asociado" htmlFor="purchaseOrderId">
                        <Select id="purchaseOrderId" name="purchaseOrderId" value={data.purchaseOrderId} onChange={handleInputChange}>
                            <option value="">Seleccionar pedido</option>
                            {appData.purchaseOrders.map(po => {
                                const product = appData.products.find(p => p.id === po.productId);
                                return <option key={po.id} value={po.id}>{po.orderNumber} ({product?.name})</option>;
                            })}
                        </Select>
                    </FormField>
                    <FormField label="Número de Lote" htmlFor="batchNumber">
                        <TextInput id="batchNumber" name="batchNumber" value={data.batchNumber} onChange={handleInputChange} />
                    </FormField>
                    <FormField label="Estado" htmlFor="status">
                        <Select id="status" name="status" value={data.status} onChange={handleInputChange}>
                            <option value="En producción">En producción</option>
                            <option value="En tránsito">En tránsito</option>
                            <option value="Disponible">Disponible</option>
                            <option value="Agotado">Agotado</option>
                        </Select>
                    </FormField>
                    <FormField label="Producto (del Pedido)">
                        <TextInput
                            readOnly
                            value={appData.products.find(p => p.id === data.productId)?.name || 'Selecciona un pedido'}
                        />
                    </FormField>
                    <FormField label="Fecha de Fabricación" htmlFor="manufacturingDate">
                        <TextInput type="date" id="manufacturingDate" name="manufacturingDate" value={data.manufacturingDate} onChange={handleInputChange} />
                    </FormField>
                    <FormField label="Fecha de Caducidad" htmlFor="expiryDate">
                        <TextInput type="date" id="expiryDate" name="expiryDate" value={data.expiryDate || ''} onChange={handleInputChange} />
                    </FormField>
                </div>
                <CollapsibleSection title="Unidades y Costes">
                    <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField label="Unidades Fabricadas" htmlFor="unitsManufactured">
                            <TextInput type="number" id="unitsManufactured" name="unitsManufactured" value={data.unitsManufactured} onChange={handleInputChange} />
                        </FormField>
                        <FormField label="Unidades Disponibles" htmlFor="unitsAvailable">
                            <TextInput type="number" id="unitsAvailable" name="unitsAvailable" value={data.unitsAvailable} onChange={handleInputChange} />
                        </FormField>
                        <FormField label="Coste por Unidad (del Pedido)">
                            <TextInput readOnly value={associatedOrder?.costPerUnit.toFixed(2) || 'N/A'} />
                        </FormField>
                    </div>
                </CollapsibleSection>
                <CollapsibleSection title="Documentos y Etiqueta">
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField label="Ficha Técnica">
                            {data.technicalDataSheet ? (
                                <div className="flex items-center justify-between bg-slate-700/50 p-2 rounded-md">
                                    <a href={data.technicalDataSheet.url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">{data.technicalDataSheet.name}</a>
                                    <button onClick={() => handleFileRemove('technicalDataSheet')} className="text-red-400 hover:text-red-300"><Icon name="trash" /></button>
                                </div>
                            ) : <FileUpload onFileSelect={(file) => handleFileChange(file, 'technicalDataSheet')} />}
                        </FormField>
                        <FormField label="Certificado de Fabricación">
                            {data.manufacturingCertificate ? (
                                 <div className="flex items-center justify-between bg-slate-700/50 p-2 rounded-md">
                                    <a href={data.manufacturingCertificate.url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">{data.manufacturingCertificate.name}</a>
                                    <button onClick={() => handleFileRemove('manufacturingCertificate')} className="text-red-400 hover:text-red-300"><Icon name="trash" /></button>
                                </div>
                            ) : <FileUpload onFileSelect={(file) => handleFileChange(file, 'manufacturingCertificate')} />}
                        </FormField>
                         <FormField label="Etiqueta Asociada" htmlFor="labelId" className="md:col-span-2">
                            <Select id="labelId" name="labelId" value={data.labelId || ''} onChange={handleInputChange}>
                                <option value="">Ninguna etiqueta</option>
                                {availableLabels.map(l => <option key={l.id} value={l.id}>{l.identifier}</option>)}
                            </Select>
                        </FormField>
                    </div>
                </CollapsibleSection>
                <CollapsibleSection title="Tareas Vinculadas">
                    <div className="p-4">
                        {linkedTasks.length > 0 ? (
                            <ul className="space-y-2">
                                {linkedTasks.map(task => (
                                    <li key={task.id} onClick={() => onSelectItem('tasks', task)} className="bg-slate-700/50 p-2 rounded-md cursor-pointer hover:bg-slate-700">
                                        <p className="font-semibold text-slate-200">{task.name}</p>
                                        <p className="text-sm text-slate-400">{task.status}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-slate-500 text-center">No hay tareas vinculadas a este lote.</p>
                        )}
                    </div>
                </CollapsibleSection>
            </div>
        )}
        {activeTab === 'notes' && (
            <NotesSection
                notes={batchNotes}
                onAddNote={handleAddNote}
                onUpdateNote={onNoteUpdate}
                onDeleteNote={onNoteDelete}
            />
        )}
      </div>
    </div>
  );
};