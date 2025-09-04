import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { AmazonFlashDeal, AppData, Price } from '../types';
import { FormField } from '../components/common/FormField';
import { TextInput } from '../components/common/TextInput';
import { Select } from '../components/common/Select';
import { Icon } from '../components/common/Icon';
import { isEqual } from 'lodash-es';

interface AmazonFlashDealDetailViewProps {
  initialData: AmazonFlashDeal;
  onSave: (data: AmazonFlashDeal) => void;
  // FIX: Update onDelete prop to accept 'number | "new"' to resolve type error from App.tsx.
  onDelete: (id: number | 'new') => void;
  onCancel: () => void;
  appData: AppData;
  setIsDirty: (isDirty: boolean) => void;
  setSaveHandler: (handler: ((onSuccess?: () => void) => void) | null) => void;
}

export const AmazonFlashDealDetailView: React.FC<AmazonFlashDealDetailViewProps> = ({ initialData, onSave, onDelete, onCancel, appData, setIsDirty, setSaveHandler }) => {
  const [data, setData] = useState<AmazonFlashDeal>(initialData);

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
    let finalValue: any = value;
    if (type === 'number') {
        finalValue = value === '' ? undefined : Number(value);
    }
    if(type === 'datetime-local') {
        finalValue = new Date(value).toISOString();
    }
    setData(prev => ({ ...prev, [name]: finalValue }));
  };

  const overlappingCoupon = useMemo<Price | undefined>(() => {
    if (!data.productId || !data.platformId || !data.startDate || !data.endDate) {
        return undefined;
    }
    const dealStart = new Date(data.startDate);
    const dealEnd = new Date(data.endDate);

    return appData.prices.find(price => 
        price.productId === data.productId &&
        price.platformId === data.platformId &&
        price.couponPercentage && price.couponPercentage > 0
        // This is a simplified check. A real app would check date ranges.
        // For now, we just check if any coupon exists.
    );
  }, [data.productId, data.platformId, data.startDate, data.endDate, appData.prices]);

  const handleDeleteClick = () => onDelete(data.id);
  
  const toDateTimeLocal = (isoString: string) => {
      const date = new Date(isoString);
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      return date.toISOString().slice(0, 16);
  }

  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-slate-200 mb-6">{data.id === 'new' ? 'Nueva Oferta Flash' : `Editando Oferta: ${initialData.name}`}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Nombre de la Campaña" htmlFor="name" className="md:col-span-2">
          <TextInput id="name" name="name" value={data.name} onChange={handleInputChange} />
        </FormField>
        
        <FormField label="Producto">
            <Select name="productId" value={data.productId} onChange={handleInputChange}>
                <option value="">Seleccionar producto...</option>
                {appData.products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </Select>
        </FormField>
         <FormField label="Plataforma">
            <Select name="platformId" value={data.platformId} onChange={handleInputChange}>
                <option value="">Seleccionar plataforma...</option>
                {appData.platforms.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </Select>
        </FormField>
         <FormField label="ASIN">
            <TextInput name="asin" value={data.asin} onChange={handleInputChange} />
        </FormField>
        <FormField label="Estado">
            <Select name="status" value={data.status} onChange={handleInputChange}>
                <option value="Borrador">Borrador</option>
                <option value="Programada">Programada</option>
                <option value="Activa">Activa</option>
                <option value="Finalizada">Finalizada</option>
                <option value="Cancelada">Cancelada</option>
            </Select>
        </FormField>
        <FormField label="Fecha y Hora de Inicio">
            <TextInput type="datetime-local" name="startDate" value={toDateTimeLocal(data.startDate)} onChange={handleInputChange} />
        </FormField>
        <FormField label="Fecha y Hora de Fin">
            <TextInput type="datetime-local" name="endDate" value={toDateTimeLocal(data.endDate)} onChange={handleInputChange} />
        </FormField>
        <FormField label="Precio de Oferta">
            <TextInput type="number" name="dealPrice" value={data.dealPrice} onChange={handleInputChange} step="0.01" />
        </FormField>
         <FormField label="Moneda">
            <TextInput name="currency" value={data.currency} onChange={handleInputChange} />
        </FormField>
        <FormField label="Límite de Stock (Opcional)">
            <TextInput type="number" name="stockLimit" value={data.stockLimit || ''} onChange={handleInputChange} />
        </FormField>
      </div>

      {overlappingCoupon && (
          <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-sm text-yellow-300">
            <Icon name="exclamation-triangle" className="mr-2" />
            <strong>¡Atención!</strong> Ya existe un cupón del <strong>{overlappingCoupon.couponPercentage}%</strong> para este producto en esta plataforma. El precio final para el cliente se calculará sobre el precio de la oferta.
          </div>
      )}

      <div className="mt-8 flex justify-end space-x-4">
        {data.id !== 'new' && <button onClick={handleDeleteClick} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 font-semibold">Eliminar</button>}
        <button onClick={onCancel} className="px-4 py-2 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500 font-semibold">Cancelar</button>
        <button onClick={() => handleSaveClick()} className="px-4 py-2 bg-cyan-500 text-slate-900 rounded-md hover:bg-cyan-600 font-semibold">Guardar Oferta</button>
      </div>
    </div>
  );
};