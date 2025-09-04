
// FIX: Add useCallback to imports
import React, { useState, useEffect, useCallback } from 'react';
import type { CustomerSupportTicket } from '../types';
import { FormField } from '../components/common/FormField';
import { TextInput } from '../components/common/TextInput';
import { Select } from '../components/common/Select';
import { isEqual } from 'lodash-es';

interface TicketDetailViewProps {
  initialData: CustomerSupportTicket;
  onSave: (data: CustomerSupportTicket) => void;
  // FIX: Update onDelete prop to accept 'number | "new"' to resolve type error from App.tsx.
  onDelete: (id: number | 'new') => void;
  onCancel: () => void;
  setIsDirty: (isDirty: boolean) => void;
  setSaveHandler: (handler: ((onSuccess?: () => void) => void) | null) => void;
}

export const TicketDetailView: React.FC<TicketDetailViewProps> = ({ initialData, onSave, onDelete, onCancel, setIsDirty, setSaveHandler }) => {
  const [data, setData] = useState<CustomerSupportTicket>(initialData);

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
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };
  
  // FIX: Directly call onDelete with the entity ID. The parent handler in App.tsx will manage the logic for 'new' vs. existing entities.
  const handleDeleteClick = () => onDelete(data.id);

  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-slate-200 mb-6">{data.id === 'new' ? 'Nuevo Ticket' : `Editando Ticket de: ${initialData.customerName}`}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Nombre del Cliente" htmlFor="customerName">
          <TextInput id="customerName" name="customerName" value={data.customerName} onChange={handleInputChange} />
        </FormField>
        <FormField label="Canal" htmlFor="channel">
          <Select id="channel" name="channel" value={data.channel} onChange={handleInputChange}>
            <option value="Email">Email</option>
            <option value="Amazon">Amazon</option>
            <option value="Web">Web</option>
            <option value="Redes Sociales">Redes Sociales</option>
          </Select>
        </FormField>
        <FormField label="Estado" htmlFor="status">
          <Select id="status" name="status" value={data.status} onChange={handleInputChange}>
            <option value="Abierto">Abierto</option>
            <option value="Respondido">Respondido</option>
            <option value="Cerrado">Cerrado</option>
          </Select>
        </FormField>
        <FormField label="Fecha de Entrada" htmlFor="entryDate">
          <TextInput type="date" id="entryDate" name="entryDate" value={data.entryDate} onChange={handleInputChange} />
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