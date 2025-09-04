import React, { useState, useMemo, FC } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { AppData } from '../types';
import { Icon } from '../components/common/Icon';
import { CollapsibleSection } from '../components/common/CollapsibleSection';
import { TextInput } from '../components/common/TextInput';
import { FormField } from '../components/common/FormField';
import { FilterPillsSelector } from '../components/common/FilterPillsSelector';
import { calculateFinalCustomerPrice } from '../services/pricingService';

interface PricingDashboardProps {
  appData: AppData;
}

const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', 
  '#FFBB28', '#FF8042', '#a4de6c', '#d0ed57', '#ffc658'
];

const CustomTooltip: FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800/80 backdrop-blur-sm p-3 border border-slate-600 rounded-md shadow-lg text-xs">
        <p className="font-bold text-slate-200 mb-2">{label}</p>
        {payload.map((p: any, i: number) => (
          <div key={i} style={{ color: p.color }}>
            {p.name}: <strong>{p.value.toFixed(2)}€</strong>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const PricingDashboard: React.FC<PricingDashboardProps> = ({ appData }) => {
    const [priceType, setPriceType] = useState<'published' | 'final'>('published');
    const [filters, setFilters] = useState({
        productIds: null as number[] | null,
        platformIds: null as number[] | null,
        startDate: '',
        endDate: '',
    });

    const handleFilterChange = (filterName: keyof typeof filters, value: any) => {
        setFilters(prev => ({ ...prev, [filterName]: value }));
    };

    const chartData = useMemo(() => {
        const { priceHistoryLogs, pvprs, products, platforms, countries } = appData;

        let filteredLogs = priceHistoryLogs.filter(log => {
            const logDate = new Date(log.timestamp);
            if (filters.startDate && log.timestamp.split('T')[0] < filters.startDate) return false;
            if (filters.endDate && log.timestamp.split('T')[0] > filters.endDate) return false;
            if (filters.productIds && !filters.productIds.includes(log.productId)) return false;
            if (filters.platformIds && !filters.platformIds.includes(log.platformId)) return false;
            return true;
        });
        
        const dataByDate: Record<string, any> = {};

        // Process final prices
        filteredLogs.forEach(log => {
            const date = new Date(log.timestamp).toLocaleDateString('es-ES');
            if (!dataByDate[date]) dataByDate[date] = { date };

            const product = products.find(p => p.id === log.productId);
            const platform = platforms.find(p => p.id === log.platformId);
            if (product && platform) {
                const key = `${product.name} - ${platform.name}`;
                
                let valueToShow = log.newAmount;
                if (priceType === 'final') {
                    valueToShow = calculateFinalCustomerPrice(
                        log.newAmount,
                        log.newDiscountPercentage,
                        log.newCouponPercentage
                    );
                }
                dataByDate[date][key] = valueToShow;
            }
        });
        
        // Process PVPRs for comparison
        pvprs.forEach(pvpr => {
             if (filters.productIds && !filters.productIds.includes(pvpr.productId)) return;
             
             const product = products.find(p => p.id === pvpr.productId);
             const country = countries.find(c => c.id === pvpr.countryId);
             if(product && country) {
                const key = `${product.name} (${country.iso}) - PVPR`;
                // Add PVPR to all relevant dates
                Object.keys(dataByDate).forEach(date => {
                    dataByDate[date][key] = pvpr.amount;
                });
             }
        });

        // Convert to array and sort by date
        const sortedData = Object.values(dataByDate).sort((a, b) => {
            const dateA = a.date.split('/').reverse().join('-');
            const dateB = b.date.split('/').reverse().join('-');
            return new Date(dateA).getTime() - new Date(dateB).getTime();
        });

        // Forward-fill missing values
        const allKeys = new Set<string>();
        sortedData.forEach(d => Object.keys(d).forEach(k => k !== 'date' && allKeys.add(k)));
        
        const lastValues: Record<string, number> = {};
        return sortedData.map(d => {
            const filledData = { ...d };
            allKeys.forEach(key => {
                if(filledData[key] !== undefined) {
                    lastValues[key] = filledData[key];
                } else if(lastValues[key] !== undefined) {
                    filledData[key] = lastValues[key];
                }
            });
            return filledData;
        });

    }, [appData, filters, priceType]);

    const lineKeys = useMemo(() => {
        if (chartData.length === 0) return [];
        const keys = new Set<string>();
        chartData.forEach(d => Object.keys(d).forEach(k => k !== 'date' && keys.add(k)));
        return Array.from(keys);
    }, [chartData]);
    
    return (
         <div className="bg-slate-800 rounded-lg">
            <div className="p-4 sm:p-6 border-b border-slate-700">
                <h1 className="text-2xl font-bold text-slate-200">Dashboard de Precios</h1>
                <p className="text-sm text-slate-400 mt-1">Analiza la evolución de los precios de venta y PVPRs a lo largo del tiempo.</p>
            </div>
            <div className="p-4 sm:p-6 space-y-4">
                <CollapsibleSection title="Filtros y Vista" defaultOpen>
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                        <FilterPillsSelector
                            placeholder="Buscar plataformas..."
                            options={appData.platforms.map(p => ({ id: p.id as number, name: p.name }))}
                            selectedIds={filters.platformIds}
                            onSelectionChange={(ids) => handleFilterChange('platformIds', ids as number[] | null)}
                        />
                         <FilterPillsSelector
                            placeholder="Buscar productos..."
                            options={appData.products.map(p => ({ id: p.id as number, name: p.name }))}
                            selectedIds={filters.productIds}
                            onSelectionChange={(ids) => handleFilterChange('productIds', ids as number[] | null)}
                        />
                        <FormField label="Fecha Inicio">
                            <TextInput type="date" value={filters.startDate} onChange={e => handleFilterChange('startDate', e.target.value)} />
                        </FormField>
                        <FormField label="Fecha Fin">
                            <TextInput type="date" value={filters.endDate} onChange={e => handleFilterChange('endDate', e.target.value)} />
                        </FormField>
                    </div>
                </CollapsibleSection>
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 h-[60vh]">
                     <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-slate-200">Evolución de Precios en el Tiempo</h3>
                        <div className="bg-slate-800 p-1 rounded-lg flex space-x-1">
                            <button onClick={() => setPriceType('published')} className={`px-3 py-1 text-sm font-semibold rounded-md ${priceType === 'published' ? 'bg-cyan-500 text-slate-900' : 'text-slate-300'}`}>Precio Publicado</button>
                            <button onClick={() => setPriceType('final')} className={`px-3 py-1 text-sm font-semibold rounded-md ${priceType === 'final' ? 'bg-cyan-500 text-slate-900' : 'text-slate-300'}`}>Precio Final Cliente</button>
                        </div>
                    </div>
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="90%">
                            <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="date" stroke="#9ca3af" tick={{ fontSize: 12 }} />
                                <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} tickFormatter={(value) => `${value}€`} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend wrapperStyle={{fontSize: "12px"}} />
                                {lineKeys.map((key, index) => (
                                    <Line 
                                        key={key} 
                                        type="monotone" 
                                        dataKey={key} 
                                        stroke={COLORS[index % COLORS.length]} 
                                        strokeWidth={2}
                                        dot={false}
                                        strokeDasharray={key.includes('PVPR') ? "5 5" : "1"}
                                    />
                                ))}
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                         <div className="text-center p-12 text-slate-500 flex flex-col items-center justify-center h-full">
                            <Icon name="chart-line" className="text-5xl mb-4" />
                            <p>No hay datos para mostrar con los filtros seleccionados.</p>
                            <p className="text-xs mt-2">Prueba a seleccionar al menos un producto o a ampliar el rango de fechas.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}