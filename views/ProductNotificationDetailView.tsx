// FIX: Add useCallback to imports
import React, { useState, useEffect, useCallback } from 'react';
import type { ProductNotification, AppData, DocumentAttachment } from '../types';
import { FormField } from '../components/common/FormField';
import { TextInput } from '../components/common/TextInput';
import { Select } from '../components/common/Select';
import { TextArea } from '../components/common/TextArea';
import { CountrySelector } from '../components/common/CountrySelector';
import { CollapsibleSection } from '../components/common/CollapsibleSection';
import { DocumentManager } from '../components/common/DocumentManager';
import { AuditLogDisplay } from '../components/common/AuditLogDisplay';
import { Icon } from '../components/common/Icon';
import { isEqual } from 'lodash-es';


interface ProductNotificationDetailViewProps {
  initialData: ProductNotification;
  onSave: (data: ProductNotification) => void;
  // FIX: Update onDelete prop to accept 'number | "new"' to resolve type error from App.tsx.
  onDelete: (id: number | 'new') => void;
  onCancel: () => void;
  appData: AppData;
  setIsDirty: (isDirty: boolean) => void;
  // FIX: Add setSaveHandler prop
  setSaveHandler: (handler: ((onSuccess?: () => void) => void) | null) => void;
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


export const ProductNotificationDetailView: React.FC<ProductNotificationDetailViewProps> = ({ initialData, onSave, onDelete, onCancel, appData, setIsDirty, setSaveHandler }) => {
  const [data, setData] = useState<ProductNotification>(initialData);
  const [activeTab, setActiveTab] = useState('main');

  // FIX: Wrap handleSaveClick in useCallback
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

  // FIX: Add useEffect for setSaveHandler
  useEffect(() => {
    setSaveHandler(() => handleSaveClick());
    return () => setSaveHandler(null);
  }, [handleSaveClick, setSaveHandler]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setData(prev => ({ ...prev, [name]: type === 'number' ? (value === '' ? undefined : Number(value)) : value }));
  };

  // FIX: Directly call onDelete with the entity ID. The parent handler in App.tsx will manage the logic for 'new' vs. existing entities.
  const handleDeleteClick = () => onDelete(data.id);
  
  const getEntityName = () => {
    const productName = appData.products.find(p => p.id === data.productId)?.name || `Producto ID ${data.productId}`;
    const countryName = appData.countries.find(c => c.id === data.countryId)?.name || `País ID ${data.countryId}`;
    return `${productName} - ${countryName}`;
  }

  const MainTab = () => (
    <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Producto" htmlFor="productId">
            <Select id="productId" name="productId" value={data.productId} onChange={handleInputChange}>
                <option value="">Seleccionar producto</option>
                {appData.products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </Select>
            </FormField>
            <FormField label="País" htmlFor="countryId">
                <CountrySelector countries={appData.countries} selectedCountryId={data.countryId} onChange={(id) => setData(p => ({...p, countryId: id}))} />
            </FormField>
            <FormField label="Estado" htmlFor="status">
            <Select id="status" name="status" value={data.status} onChange={handleInputChange}>
                <option value="Pendiente">Pendiente</option>
                <option value="En proceso">En proceso</option>
                <option value="Notificado">Notificado</option>
                <option value="No necesario">No necesario</option>
                <option value="Espera de decision">Espera de decisión</option>
                <option value="No Notificable">No Notificable</option>
                <option value="Pendiente nueva notificación">Pendiente nueva notificación</option>
            </Select>
            </FormField>
            <FormField label="Notificado por" htmlFor="notifiedBy">
            <Select id="notifiedBy" name="notifiedBy" value={data.notifiedBy} onChange={handleInputChange}>
                <option value="">Seleccionar</option>
                <option value="Interno">Interno</option>
                <option value="Agencia Externa">Agencia Externa</option>
            </Select>
            </FormField>
            {data.notifiedBy === 'Agencia Externa' && (
                <FormField label="Nombre Agencia" htmlFor="agencyName">
                    <TextInput id="agencyName" name="agencyName" value={data.agencyName || ''} onChange={handleInputChange} />
                </FormField>
            )}
            <FormField label="Tasa Gobierno (€)" htmlFor="costGovernmentFee">
                <TextInput type="number" step="0.01" id="costGovernmentFee" name="costGovernmentFee" value={data.costGovernmentFee || ''} onChange={handleInputChange} />
            </FormField>
            {data.notifiedBy === 'Agencia Externa' && (
                <FormField label="Coste Agencia (€)" htmlFor="costAgencyFee">
                    <TextInput type="number" step="0.01" id="costAgencyFee" name="costAgencyFee" value={data.costAgencyFee || ''} onChange={handleInputChange} />
                </FormField>
            )}
        </div>
        <FormField label="Checklist / Comentarios" htmlFor="checklist">
                <TextArea id="checklist" name="checklist" value={data.checklist || ''} onChange={handleInputChange} />
            </FormField>
            
            <CollapsibleSection title="Archivos Adjuntos" defaultOpen>
                <div className="p-4">
                    <DocumentManager 
                        documents={(data.attachedFiles as DocumentAttachment[]) || []}
                        onDocumentsChange={docs => setData(prev => ({ ...prev, attachedFiles: docs as any[]}))}
                    />
                </div>
            </CollapsibleSection>
    </>
  );

  const HistoryTab = () => {
    if (typeof data.id !== 'number') {
        return <div className="text-center text-slate-500 p-8">Guarda la notificación para ver su historial.</div>;
    }
    const logs = appData.logs
      .filter(l => l.entityType === 'productNotifications' && l.entityId === data.id)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return <AuditLogDisplay logs={logs} />;
  }

  return (
    <div className="bg-slate-800 rounded-lg">
      <div className="p-4 sm:p-6 border-b border-slate-700 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-200">{data.id === 'new' ? 'Nueva Notificación' : `Editando Notificación: ${getEntityName()}`}</h2>
         <div className="flex space-x-2">
            {data.id !== 'new' && <button onClick={handleDeleteClick} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 font-semibold">Eliminar</button>}
            <button onClick={onCancel} className="px-4 py-2 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500 font-semibold">Cancelar</button>
            <button onClick={handleSaveClick} className="px-4 py-2 bg-cyan-500 text-slate-900 rounded-md hover:bg-cyan-600 font-semibold">Guardar</button>
        </div>
      </div>

       <div className="border-b border-slate-700 bg-slate-800 px-4">
        <nav className="-mb-px flex space-x-4" aria-label="Tabs">
            <TabButton title="Principal" icon="file-alt" isActive={activeTab === 'main'} onClick={() => setActiveTab('main')} />
            <TabButton title="Historial" icon="history" isActive={activeTab === 'history'} onClick={() => setActiveTab('history')} />
        </nav>
      </div>

      <div className="p-4 sm:p-6 lg:p-8 bg-slate-900 rounded-b-lg">
        <div className={activeTab === 'main' ? 'block' : 'hidden'}>
          <MainTab />
        </div>
        <div className={activeTab === 'history' ? 'block' : 'hidden'}>
          <HistoryTab />
        </div>
      </div>
    </div>
  );
};