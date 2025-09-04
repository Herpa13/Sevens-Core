import React, { useState, useCallback, useEffect } from 'react';
import type { PricingRule, AppData, PriceCalculationMethod } from '../types';
import { FormField } from '../components/common/FormField';
import { TextInput } from '../components/common/TextInput';
import { Select } from '../components/common/Select';
import { CollapsibleSection } from '../components/common/CollapsibleSection';
import { MultiSelect } from '../components/common/MultiSelect';
import { isEqual } from 'lodash-es';
import { Icon } from '../components/common/Icon';

interface PricingRuleDetailViewProps {
  initialData: PricingRule;
  onSave: (data: PricingRule) => void;
  onDelete: (id: number | 'new') => void;
  onCancel: () => void;
  appData: AppData;
  setIsDirty: (isDirty: boolean) => void;
  setSaveHandler: (handler: ((onSuccess?: () => void) => void) | null) => void;
}

const CALCULATION_METHODS: { value: PriceCalculationMethod, label: string, requiresValue: boolean }[] = [
    { value: 'USE_PVPR', label: 'Usar PVPR Base', requiresValue: false },
    { value: 'FIXED_PRICE', label: 'Precio Fijo', requiresValue: true },
    { value: 'DISCOUNT_FROM_PVPR_PERCENTAGE', label: 'Descuento % sobre PVPR', requiresValue: true },
    { value: 'DISCOUNT_FROM_PVPR_AMOUNT', label: 'Descuento Fijo sobre PVPR', requiresValue: true },
    { value: 'MARKUP_FROM_COST', label: 'Margen sobre Coste', requiresValue: true },
];

export const PricingRuleDetailView: React.FC<PricingRuleDetailViewProps> = ({ initialData, onSave, onDelete, onCancel, appData, setIsDirty, setSaveHandler }) => {
    const [data, setData] = useState<PricingRule>(initialData);

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
        setSaveHandler(() => handleSaveClick);
        return () => setSaveHandler(null);
    }, [handleSaveClick, setSaveHandler]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const target = e.target as HTMLInputElement;

        if (name === 'isActive') {
            setData(prev => ({ ...prev, isActive: target.checked }));
        } else {
            setData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleScopeChange = (field: 'productIds' | 'platformIds' | 'countryIds', ids: (string | number)[] | null) => {
        setData(prev => ({
            ...prev,
            scope: {
                ...prev.scope,
                [field]: ids as number[] | null,
            }
        }));
    };
    
    const handleCalculationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setData(prev => ({
            ...prev,
            calculation: {
                ...prev.calculation,
                [name]: value
            }
        }));
    };

    const handleDeleteClick = () => onDelete(data.id);
    
    const calculationMethodConfig = CALCULATION_METHODS.find(m => m.value === data.calculation.method);

    return (
        <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-slate-200 mb-6">{data.id === 'new' ? 'Nueva Regla de Precios' : `Editando Regla: ${initialData.name}`}</h2>
            
            <CollapsibleSection title="Información General" defaultOpen>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-center">
                    <FormField label="Nombre de la Regla" htmlFor="name" className="lg:col-span-3">
                        <TextInput id="name" name="name" value={data.name} onChange={handleInputChange} />
                    </FormField>
                    <FormField label="Fecha de Inicio">
                        <TextInput type="date" name="startDate" value={data.startDate || ''} onChange={handleInputChange} />
                    </FormField>
                    <FormField label="Fecha de Fin">
                        <TextInput type="date" name="endDate" value={data.endDate || ''} onChange={handleInputChange} />
                    </FormField>
                    <div className="flex items-center pt-6">
                        <input
                            type="checkbox"
                            id="isActive"
                            name="isActive"
                            checked={data.isActive}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-cyan-500 border-slate-600 rounded bg-slate-700 focus:ring-cyan-500"
                        />
                        <label htmlFor="isActive" className="ml-2 text-sm font-medium text-slate-300">
                            Regla Activa
                        </label>
                    </div>
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Alcance (Scope)" defaultOpen>
                <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField label="Productos Afectados" helpText="Si no seleccionas ninguno, se aplica a TODOS.">
                        <MultiSelect
                            options={appData.products.map(p => ({ id: p.id, name: p.name }))}
                            selectedIds={data.scope.productIds}
                            onSelectionChange={(ids) => handleScopeChange('productIds', ids)}
                            placeholder="Buscar productos..."
                        />
                    </FormField>
                    <FormField label="Plataformas Afectadas" helpText="Si no seleccionas ninguna, se aplica a TODAS.">
                         <MultiSelect
                            options={appData.platforms.map(p => ({ id: p.id, name: p.name }))}
                            selectedIds={data.scope.platformIds}
                            onSelectionChange={(ids) => handleScopeChange('platformIds', ids)}
                            placeholder="Buscar plataformas..."
                        />
                    </FormField>
                    <FormField label="Países Afectados" helpText="Si no seleccionas ninguno, se aplica a TODOS.">
                         <MultiSelect
                            options={appData.countries.map(c => ({ id: c.id, name: c.name }))}
                            selectedIds={data.scope.countryIds}
                            onSelectionChange={(ids) => handleScopeChange('countryIds', ids)}
                            placeholder="Buscar países..."
                        />
                    </FormField>
                </div>
            </CollapsibleSection>
            
            <CollapsibleSection title="Cálculo" defaultOpen>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                    <FormField label="Método de Cálculo">
                        <Select name="method" value={data.calculation.method} onChange={handleCalculationChange}>
                            {CALCULATION_METHODS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                        </Select>
                    </FormField>
                    {calculationMethodConfig?.requiresValue && (
                         <FormField label="Valor (Número o %)">
                            <TextInput type="number" name="value" value={data.calculation.value || ''} onChange={handleCalculationChange} />
                        </FormField>
                    )}
                </div>
            </CollapsibleSection>

            <div className="mt-8 flex justify-end space-x-4">
                {data.id !== 'new' && <button onClick={handleDeleteClick} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 font-semibold">Eliminar</button>}
                <button onClick={onCancel} className="px-4 py-2 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500 font-semibold">Cancelar</button>
                <button onClick={() => handleSaveClick()} className="px-4 py-2 bg-cyan-500 text-slate-900 rounded-md hover:bg-cyan-600 font-semibold">Guardar Regla</button>
            </div>
        </div>
    );
};
