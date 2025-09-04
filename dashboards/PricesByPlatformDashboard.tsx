import React, { useState, useMemo, FC, useCallback, useEffect } from 'react';
import type { AppData, Product, Platform, Price } from '../types';
import { Icon } from '../components/common/Icon';
import { CollapsibleSection } from '../components/common/CollapsibleSection';
import { MultiSelect } from '../components/common/MultiSelect';
import { TextInput } from '../components/common/TextInput';
import { calculateFinalCustomerPrice } from '../services/pricingService';

interface PricesByPlatformDashboardProps {
  appData: AppData;
  onSave: (updatedPrices: Price[]) => void;
  setIsDirty: (isDirty: boolean) => void;
  setSaveHandler: (handler: ((onSuccess?: () => void) => void) | null) => void;
}

export const PricesByPlatformDashboard: React.FC<PricesByPlatformDashboardProps> = ({ appData, onSave, setIsDirty, setSaveHandler }) => {
    const [selectedProductIds, setSelectedProductIds] = useState<number[] | null>(null);
    const [editedPrices, setEditedPrices] = useState<Record<number, Partial<Price>>>({});

    const handleSaveClick = useCallback((onSuccess?: () => void) => {
        const toUpdate: Price[] = [];
        Object.entries(editedPrices).forEach(([priceIdStr, edits]) => {
            const priceId = Number(priceIdStr);
            const originalPrice = appData.prices.find(p => p.id === priceId);
            if (originalPrice) {
                // If the amount was edited, it's a manual update
                const updatedPrice = { ...originalPrice, ...edits };
                if (edits.amount !== undefined) {
                    updatedPrice.lastUpdatedBy = 'manual';
                }
                toUpdate.push(updatedPrice);
            }
        });

        if (toUpdate.length > 0) {
            onSave(toUpdate);
        } else if (onSuccess) {
            onSuccess();
            return;
        } else {
            alert("No hay cambios para guardar.");
        }
        
        setEditedPrices({});

        if (onSuccess) {
            onSuccess();
        }
    }, [editedPrices, appData.prices, onSave]);

    useEffect(() => {
        const hasChanges = Object.keys(editedPrices).length > 0;
        setIsDirty(hasChanges);
    }, [editedPrices, setIsDirty]);

    useEffect(() => {
        setSaveHandler(handleSaveClick);
        return () => {
          setSaveHandler(null);
        };
    }, [handleSaveClick, setSaveHandler]);


    const filteredProducts = useMemo(() => {
        if (selectedProductIds === null) return appData.products;
        return appData.products.filter(p => selectedProductIds.includes(p.id as number));
    }, [appData.products, selectedProductIds]);

    const activePlatforms = useMemo(() => 
        appData.platforms.filter(p => p.status === 'Activa').sort((a,b) => a.name.localeCompare(b.name)),
    [appData.platforms]);
    
    const handlePriceDataChange = (priceId: number, field: 'amount' | 'discountPercentage' | 'couponPercentage', value: string) => {
        const numericValue = value === '' ? null : parseFloat(value);
        setEditedPrices(prev => ({
            ...prev,
            [priceId]: {
                ...prev[priceId],
                [field]: numericValue,
            }
        }));
    };

    const handleProductFilterChange = (ids: (string | number)[] | null) => {
        setSelectedProductIds(ids as number[] | null);
    };

    return (
        <div className="bg-slate-800 rounded-lg">
            <div className="p-4 sm:p-6 border-b border-slate-700 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-200">Precios por Plataforma</h1>
                    <p className="text-sm text-slate-400 mt-1">Gestiona precios, descuentos y cupones manuales sobre los precios calculados.</p>
                </div>
                 <button
                    onClick={() => handleSaveClick()}
                    disabled={Object.keys(editedPrices).length === 0}
                    className="px-4 py-2 bg-cyan-500 text-slate-900 font-semibold rounded-md hover:bg-cyan-600 disabled:opacity-50 flex items-center"
                >
                    <Icon name="save" className="mr-2" />
                    Guardar Cambios
                </button>
            </div>
            <div className="p-4 sm:p-6 space-y-4">
                <CollapsibleSection title="Filtros de Visualización">
                    <div className="p-4">
                        <MultiSelect
                            options={appData.products.map(p => ({ id: p.id as number, name: p.name }))}
                            selectedIds={selectedProductIds}
                            onSelectionChange={handleProductFilterChange}
                            placeholder="Filtrar productos..."
                        />
                    </div>
                </CollapsibleSection>
                
                <div className="overflow-x-auto border border-slate-700 rounded-lg">
                    <table className="min-w-full text-sm border-collapse">
                        <thead className="bg-slate-700/50 sticky top-0 z-10">
                            <tr>
                                <th rowSpan={2} className="p-2 text-left font-semibold sticky left-0 bg-slate-700/50 border-r border-b border-slate-700 z-20">Producto</th>
                                {activePlatforms.map(platform => (
                                    <th key={platform.id} colSpan={4} className="p-2 text-center font-semibold whitespace-nowrap border-b border-l border-slate-700">{platform.name}</th>
                                ))}
                            </tr>
                            <tr>
                                {activePlatforms.flatMap(platform => [
                                    <th key={`${platform.id}-pub`} className="p-2 text-center font-semibold whitespace-nowrap border-l border-slate-700 text-xs">Precio Pub.</th>,
                                    <th key={`${platform.id}-dto`} className="p-2 text-center font-semibold whitespace-nowrap border-l border-slate-700 text-xs">Descuento %</th>,
                                    <th key={`${platform.id}-cup`} className="p-2 text-center font-semibold whitespace-nowrap border-l border-slate-700 text-xs">Cupón %</th>,
                                    <th key={`${platform.id}-fin`} className="p-2 text-center font-semibold whitespace-nowrap border-l border-slate-700 text-xs">Precio Final</th>,
                                ])}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                            {filteredProducts.map(product => (
                                <tr key={product.id}>
                                    <td className="p-2 font-medium text-slate-300 sticky left-0 bg-slate-800 whitespace-nowrap border-r border-slate-700 z-10">{product.name}</td>
                                    {activePlatforms.map(platform => {
                                        const price = appData.prices.find(p => p.productId === product.id && p.platformId === platform.id);
                                        
                                        if (!price) {
                                            return <td key={platform.id} colSpan={4} className="p-2 text-center text-slate-500 border-l border-slate-700">N/A</td>
                                        }

                                        const editedPrice = editedPrices[price.id as number];
                                        const isManuallySet = (editedPrice?.amount !== undefined) ? true : price.lastUpdatedBy === 'manual';

                                        const currentAmount = editedPrice?.amount !== undefined ? editedPrice.amount : price.amount;
                                        const discount = editedPrice?.discountPercentage !== undefined ? editedPrice.discountPercentage : price.discountPercentage;
                                        const coupon = editedPrice?.couponPercentage !== undefined ? editedPrice.couponPercentage : price.couponPercentage;
                                        const finalPrice = calculateFinalCustomerPrice(currentAmount as number, discount, coupon);
                                        const isDirty = !!editedPrice;

                                        return (
                                            <React.Fragment key={platform.id}>
                                                <td className="p-1 text-center font-mono border-l border-slate-700">
                                                    <div className="flex items-center justify-center space-x-1">
                                                        {isManuallySet && <Icon name="user-edit" className="text-cyan-400" title="Precio manual"/>}
                                                        <TextInput type="number" step="0.01" value={currentAmount ?? ''} onChange={e => handlePriceDataChange(price.id as number, 'amount', e.target.value)} className={`!py-1 text-center w-24 ${isDirty ? 'border-yellow-400 ring-yellow-400' : ''}`} />
                                                    </div>
                                                </td>
                                                <td className="p-1 text-center border-l border-slate-700">
                                                    <TextInput type="number" step="0.1" value={discount ?? ''} onChange={e => handlePriceDataChange(price.id as number, 'discountPercentage', e.target.value)} className={`!py-1 text-center w-20 ${isDirty ? 'border-yellow-400 ring-yellow-400' : ''}`} placeholder="-"/>
                                                </td>
                                                <td className="p-1 text-center border-l border-slate-700">
                                                    <TextInput type="number" step="0.1" value={coupon ?? ''} onChange={e => handlePriceDataChange(price.id as number, 'couponPercentage', e.target.value)} className={`!py-1 text-center w-20 ${isDirty ? 'border-yellow-400 ring-yellow-400' : ''}`} placeholder="-"/>
                                                </td>
                                                <td className={`p-1 text-center font-mono font-bold border-l border-slate-700 ${isDirty ? 'text-yellow-300' : 'text-slate-200'}`}>{finalPrice.toFixed(2)}€</td>
                                            </React.Fragment>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};