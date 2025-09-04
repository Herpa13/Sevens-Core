import React, { useState, useMemo, useEffect, useCallback } from 'react';
import type { AppData, Pvpr } from '../types';
import { Icon } from '../components/common/Icon';
import { TextInput } from '../components/common/TextInput';

interface PvprMatrixDashboardProps {
  appData: AppData;
  onSave: (updatedPvprs: Pvpr[]) => void;
  setIsDirty: (isDirty: boolean) => void;
  setSaveHandler: (handler: ((onSuccess?: () => void) => void) | null) => void;
}

export const PvprMatrixDashboard: React.FC<PvprMatrixDashboardProps> = ({ appData, onSave, setIsDirty, setSaveHandler }) => {
  const { products, countries, pvprs } = appData;
  const [editedPvprs, setEditedPvprs] = useState<Record<string, { amount: number | string, isNew: boolean }>>({});

  const matrixData = useMemo(() => {
    return products.map(product => {
      const row: Record<string, Pvpr | undefined> = {};
      countries.forEach(country => {
        row[country.id as number] = pvprs.find(p => p.productId === product.id && p.countryId === country.id);
      });
      return {
        productId: product.id,
        productName: product.name,
        pvprsByCountry: row,
      };
    });
  }, [products, countries, pvprs]);

  const handlePriceChange = (productId: number, countryId: number, amount: string) => {
    const key = `${productId}-${countryId}`;
    const originalPvpr = pvprs.find(p => p.productId === productId && p.countryId === countryId);
    
    setEditedPvprs(prev => ({
        ...prev,
        [key]: {
            amount: amount,
            isNew: !originalPvpr
        }
    }));
  };

  const hasChanges = Object.keys(editedPvprs).length > 0;

  useEffect(() => {
    setIsDirty(hasChanges);
  }, [hasChanges, setIsDirty]);

  const handleSaveClick = useCallback((onSuccess?: () => void) => {
    const toUpdate: Pvpr[] = [];
    Object.entries(editedPvprs).forEach(([key, value]) => {
        const [productId, countryId] = key.split('-').map(Number);
        const originalPvpr = pvprs.find(p => p.productId === productId && p.countryId === countryId);
        
        if (originalPvpr) {
            // Update existing
            if (originalPvpr.amount !== Number(value.amount)) {
                toUpdate.push({ ...originalPvpr, amount: Number(value.amount) });
            }
        } else {
            // Create new
            if (value.amount !== '') {
                toUpdate.push({
                    id: -Date.now(), // Temporary ID for new items
                    productId,
                    countryId,
                    amount: Number(value.amount),
                    currency: 'EUR' // Default currency
                });
            }
        }
    });

    if (toUpdate.length > 0) {
        onSave(toUpdate);
    } else if (onSuccess) {
        // If called from "Save & Exit", we still need to call onSuccess to navigate.
        onSuccess();
        return;
    } else {
        alert("No hay cambios para guardar.");
    }
    
    setEditedPvprs({});
    
    if (onSuccess) {
        onSuccess();
    }
  }, [editedPvprs, onSave, pvprs]);
  
  useEffect(() => {
      setSaveHandler(handleSaveClick);
      return () => {
          setSaveHandler(null);
      };
  }, [handleSaveClick, setSaveHandler]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-200">Matriz de PVPR</h1>
        <button
          onClick={() => handleSaveClick()}
          disabled={!hasChanges}
          className="px-4 py-2 bg-cyan-500 text-slate-900 font-semibold rounded-md hover:bg-cyan-600 disabled:opacity-50 flex items-center"
        >
          <Icon name="save" className="mr-2" />
          Guardar Cambios
        </button>
      </div>
      <div className="bg-slate-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700 border-collapse">
            <thead className="bg-slate-700/50 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider w-1/4 whitespace-nowrap border-r border-slate-700">
                  Producto
                </th>
                {countries.map(country => (
                  <th key={country.id} className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase tracking-wider whitespace-nowrap">
                    {country.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-slate-800 divide-y divide-slate-700">
              {matrixData.map(row => (
                <tr key={row.productId}>
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-slate-200 border-r border-slate-700">
                    {row.productName}
                  </td>
                  {countries.map(country => {
                    const pvpr = row.pvprsByCountry[country.id as number];
                    const editKey = `${row.productId}-${country.id}`;
                    const editedValue = editedPvprs[editKey];
                    const currentValue = editedValue ? editedValue.amount : pvpr?.amount;
                    const isDirty = editedValue !== undefined;

                    return (
                      <td key={country.id} className="whitespace-nowrap text-center text-sm border-l border-slate-700/50 p-1">
                        <TextInput
                          type="number"
                          step="0.01"
                          value={currentValue ?? ''}
                          onChange={(e) => handlePriceChange(row.productId as number, country.id as number, e.target.value)}
                          className={`!py-1 text-center text-xs bg-slate-900 text-slate-200 ${isDirty ? 'border-yellow-400 ring-yellow-400' : 'border-slate-600'}`}
                          placeholder="-"
                        />
                      </td>
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