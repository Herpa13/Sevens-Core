// FIX: Add useCallback, useEffect imports
import React, { useState, useEffect, useCallback } from 'react';
import type { DeliveryNote, AppData } from '../types';
import { FormField } from '../components/common/FormField';
import { TextInput } from '../components/common/TextInput';
import { Select } from '../components/common/Select';
import { FileUpload } from '../components/common/FileUpload';
import { isEqual } from 'lodash-es';

interface DeliveryNoteDetailViewProps {
  initialData: DeliveryNote;
  onSave: (data: DeliveryNote) => void;
  // FIX: Update onDelete prop to accept 'number | "new"' to resolve type error from App.tsx.
  onDelete: (id: number | 'new') => void;
  onCancel: () => void;
  appData: AppData;
  setIsDirty: (isDirty: boolean) => void;
  setSaveHandler: (handler: ((onSuccess?: () => void) => void) | null) => void;
}

export const DeliveryNoteDetailView: React.FC<DeliveryNoteDetailViewProps> = ({ initialData, onSave, onDelete, onCancel, appData, setIsDirty, setSaveHandler }) => {
  const [data, setData] = useState<DeliveryNote>(initialData);

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
    const isNumber = type === 'number';
    setData(prev => ({ ...prev, [name]: isNumber ? Number(value) : value }));
  };

  const handleDeleteClick = () => onDelete(data.id);

  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-slate-200 mb-6">{data.id === 'new' ? 'Nuevo Albarán de Entrega' : `Editando Albarán: ${initialData.deliveryNoteNumber}`}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Pedido de Fabricación Asociado" htmlFor="purchaseOrderId">
          <Select id="purchaseOrderId" name="purchaseOrderId" value={data.purchaseOrderId} onChange={handleInputChange}>
            <option value="">Seleccionar pedido</option>
            {appData.purchaseOrders.map(p => <option key={p.id} value={p.id}>{p.orderNumber} - {appData.products.find(prod => prod.id === p.productId)?.name}</option>)}
          </Select>
        </FormField>
        <FormField label="Número de Albarán" htmlFor="deliveryNoteNumber">
          <TextInput id="deliveryNoteNumber" name="deliveryNoteNumber" value={data.deliveryNoteNumber} onChange={handleInputChange} />
        </FormField>
        <FormField label="Unidades Recibidas" htmlFor="unitsReceived">
          <TextInput type="number" id="unitsReceived" name="unitsReceived" value={data.unitsReceived} onChange={handleInputChange} />
        </FormField>
        <FormField label="Fecha de Recepción" htmlFor="receivedDate">
          <TextInput type="date" id="receivedDate" name="receivedDate" value={data.receivedDate} onChange={handleInputChange} />
        </FormField>
        <FormField label="Documento del Albarán" htmlFor="documentUrl" className="md:col-span-2">
            <FileUpload onFileSelect={(file) => {
                if(file) setData(prev => ({...prev, documentUrl: URL.createObjectURL(file)}))
            }} currentFileName={data.documentUrl}/>
        </FormField>
      </div>

      <div className="mt-8 flex justify-end space-x-4">
        {data.id !== 'new' && <button onClick={handleDeleteClick} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 font-semibold">Eliminar</button>}
        <button onClick={onCancel} className="px-4 py-2 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500 font-semibold">Cancelar</button>
        <button onClick={() => handleSaveClick()} className="px-4 py-2 bg-cyan-500 text-slate-900 rounded-md hover:bg-cyan-600 font-semibold">Guardar</button>
      </div>
    </div>
  );
};