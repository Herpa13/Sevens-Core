import React, { useState, useMemo, FC } from 'react';
import type { AppData, PriceHistoryLog } from '../types';
import { Icon } from '../components/common/Icon';
import { CollapsibleSection } from '../components/common/CollapsibleSection';
import { MultiSelect } from '../components/common/MultiSelect';
import { TextInput } from '../components/common/TextInput';

interface PriceHistoryLogDashboardProps {
  appData: AppData;
}

const FilterPillsSelector: FC<{
    options: { id: number | string; name: string }[];
    selectedIds: (string | number)[] | null;
    onSelectionChange: (ids: (string | number)[] | null) => void;
    placeholder: string;
}> = ({ options, selectedIds, onSelectionChange, placeholder }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredOptions = useMemo(() => {
        return options.filter(option => 
          option.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [options, searchTerm]);

    const handleToggle = (id: number | string) => {
        let currentSelected = selectedIds === null ? options.map(o => o.id) : [...(selectedIds || [])];
        
        if (currentSelected.includes(id)) {
            currentSelected = currentSelected.filter(selectedId => selectedId !== id);
        } else {
            currentSelected.push(id);
        }
        
        if (currentSelected.length === options.length) {
            onSelectionChange(null);
        } else if (currentSelected.length === 0) {
            onSelectionChange([]);
        } else {
            onSelectionChange(currentSelected);
        }
    };

    const handleSelectAll = () => onSelectionChange(null);
    const handleSelectNone = () => onSelectionChange([]);
    
    const isAllSelected = selectedIds === null;
    const selectedCount = isAllSelected ? options.length : (selectedIds || []).length;

    return (
        <div className="space-y-2 p-3 bg-slate-900/50 rounded-lg border border-slate-700">
            <div className="flex justify-between items-center gap-2">
                 <div className="relative flex-grow">
                    <TextInput
                        type="text"
                        placeholder={placeholder}
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="pl-8 text-sm !py-1 w-full"
                    />
                    <Icon name="search" className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
                </div>
                 <div className="flex-shrink-0 flex items-center space-x-2">
                    <span className="text-xs text-slate-400 whitespace-nowrap">{selectedCount} de {options.length}</span>
                    <button onClick={handleSelectAll} className="text-xs font-semibold text-cyan-400 hover:text-cyan-300">Todos</button>
                    <button onClick={handleSelectNone} className="text-xs font-semibold text-cyan-400 hover:text-cyan-300">Ninguno</button>
                </div>
            </div>
            
            <div className="flex space-x-2 overflow-x-auto pb-2 -mx-2 px-2">
                {filteredOptions.map(option => {
                    const isSelected = isAllSelected || (selectedIds && selectedIds.includes(option.id));
                    return (
                        <button
                            key={option.id}
                            onClick={() => handleToggle(option.id)}
                            className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap transition-colors ${
                                isSelected ? 'bg-cyan-500 text-slate-900' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                            }`}
                        >
                            {option.name}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};


const AnalysisPanel: FC<{ appData: AppData }> = ({ appData }) => {
    const [selectedPlatformIds, setSelectedPlatformIds] = useState<(string|number)[] | null>([]);
    const [selectedProductIds, setSelectedProductIds] = useState<(string|number)[] | null>([]);
    
    const filteredLogs = useMemo(() => {
        if (!selectedPlatformIds?.length && !selectedProductIds?.length) return [];
        return appData.priceHistoryLogs.filter(log => {
            const platformMatch = !selectedPlatformIds?.length || selectedPlatformIds.includes(log.platformId);
            const productMatch = !selectedProductIds?.length || selectedProductIds.includes(log.productId);
            return platformMatch && productMatch;
        }).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [appData.priceHistoryLogs, selectedPlatformIds, selectedProductIds]);
    
    const groupedByDate = useMemo(() => {
        const groups: Record<string, PriceHistoryLog[]> = {};
        filteredLogs.forEach(log => {
            const date = new Date(log.timestamp).toLocaleDateString();
            if (!groups[date]) groups[date] = [];
            groups[date].push(log);
        });
        return groups;
    }, [filteredLogs]);

    return (
         <CollapsibleSection title="Panel de Análisis de Cambios de Precio" defaultOpen>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FilterPillsSelector
                    options={appData.platforms.map(p => ({ id: p.id, name: p.name }))}
                    selectedIds={selectedPlatformIds}
                    onSelectionChange={setSelectedPlatformIds}
                    placeholder="Buscar plataformas..."
                />
                 <FilterPillsSelector
                    options={appData.products.map(p => ({ id: p.id, name: p.name }))}
                    selectedIds={selectedProductIds}
                    onSelectionChange={setSelectedProductIds}
                    placeholder="Buscar productos..."
                />
            </div>
            <div className="p-4 max-h-96 overflow-y-auto">
                {Object.entries(groupedByDate).map(([date, logs]) => (
                    <div key={date} className="mb-4">
                        <h4 className="font-bold text-slate-300 text-sm mb-2">{date}</h4>
                        <div className="space-y-2">
                        {logs.map(log => {
                             const product = appData.products.find(p => p.id === log.productId);
                             const platform = appData.platforms.find(p => p.id === log.platformId);
                            return (
                                <div key={log.id} className="grid grid-cols-4 gap-2 p-2 bg-slate-700/50 rounded-md text-xs">
                                    <div className="col-span-2">
                                        <strong>{product?.name}</strong> en {platform?.name}
                                    </div>
                                    <div className="font-mono">{log.oldAmount?.toFixed(2) || '-'} &rarr; {log.newAmount.toFixed(2)}</div>
                                    <div className="text-cyan-400 truncate" title={log.source.name}>
                                        <Icon name="gavel" className="mr-1"/>{log.source.name}
                                    </div>
                                </div>
                            )
                        })}
                        </div>
                    </div>
                ))}
                 {filteredLogs.length === 0 && (
                    <p className="text-center text-slate-500 py-8">Selecciona plataformas o productos para ver su historial de precios.</p>
                )}
            </div>
         </CollapsibleSection>
    );
};


const FullLogPanel: FC<{ appData: AppData }> = ({ appData }) => {
    const [filters, setFilters] = useState<Record<string, string>>({});

    const sortedLogs = useMemo(() => 
        [...appData.priceHistoryLogs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
        [appData.priceHistoryLogs]
    );
    
    const filteredLogs = useMemo(() => {
        return sortedLogs.filter(log => {
            const product = appData.products.find(p => p.id === log.productId);
            const platform = appData.platforms.find(p => p.id === log.platformId);
            
            if (filters.product && !product?.name.toLowerCase().includes(filters.product.toLowerCase())) return false;
            if (filters.platform && !platform?.name.toLowerCase().includes(filters.platform.toLowerCase())) return false;
            if (filters.user && !log.userName.toLowerCase().includes(filters.user.toLowerCase())) return false;
            if (filters.date && !new Date(log.timestamp).toLocaleDateString().includes(filters.date)) return false;

            return true;
        });
    }, [sortedLogs, filters, appData]);

    const handleFilterChange = (column: string, value: string) => {
        setFilters(prev => ({ ...prev, [column]: value }));
    };

    return (
        <CollapsibleSection title="Registro Detallado de Cambios" defaultOpen>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-700">
                    <thead className="bg-slate-700/50">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-400 uppercase"><TextInput placeholder="Filtrar Fecha..." className="!text-xs" onChange={e => handleFilterChange('date', e.target.value)} /></th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-400 uppercase"><TextInput placeholder="Filtrar Usuario..." className="!text-xs" onChange={e => handleFilterChange('user', e.target.value)} /></th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-400 uppercase"><TextInput placeholder="Filtrar Producto..." className="!text-xs" onChange={e => handleFilterChange('product', e.target.value)} /></th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-400 uppercase"><TextInput placeholder="Filtrar Plataforma..." className="!text-xs" onChange={e => handleFilterChange('platform', e.target.value)} /></th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Anterior</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Nuevo</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Origen</th>
                        </tr>
                    </thead>
                    <tbody className="bg-slate-800 divide-y divide-slate-700">
                        {filteredLogs.map(log => {
                        const product = appData.products.find(p => p.id === log.productId);
                        const platform = appData.platforms.find(p => p.id === log.platformId);
                        
                        return (
                            <tr key={log.id}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-400">{new Date(log.timestamp).toLocaleString()}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-300">{log.userName}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-200">{product?.name || 'N/A'}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-300">{platform?.name || 'N/A'}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-400 font-mono">{log.oldAmount?.toFixed(2) || '-'} {log.currency}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-green-400 font-mono font-bold">{log.newAmount.toFixed(2)} {log.currency}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-cyan-400" title={log.source.name}>
                                <Icon name={log.source.type === 'rule' ? 'gavel' : 'tag'} className="mr-2" />
                                {log.source.name}
                            </td>
                            </tr>
                        );
                        })}
                    </tbody>
                </table>
                 {filteredLogs.length === 0 && (
                    <div className="text-center p-12 text-slate-500">
                        <Icon name="folder-open" className="text-4xl mb-4" />
                        <p>No se encontraron registros que coincidan con los filtros.</p>
                    </div>
                )}
            </div>
        </CollapsibleSection>
    );
};

export const PriceHistoryLogDashboard: React.FC<PriceHistoryLogDashboardProps> = ({ appData }) => {
  return (
    <div className="bg-slate-800 rounded-lg">
      <div className="p-4 sm:p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold text-slate-200">Historial de Cambios de Precios</h1>
        <p className="text-sm text-slate-400 mt-1">Auditoría y análisis de todas las modificaciones de precios.</p>
      </div>
      <div className="p-4 sm:p-6 space-y-6">
        <AnalysisPanel appData={appData} />
        <FullLogPanel appData={appData} />
      </div>
    </div>
  );
};
