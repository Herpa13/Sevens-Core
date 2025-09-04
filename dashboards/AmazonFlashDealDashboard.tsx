import React, { useMemo, useState, FC } from 'react';
import type { AppData, AmazonFlashDeal, AmazonFlashDealStatus, Entity, EntityType } from '../types';
import { Icon } from '../components/common/Icon';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Cell } from 'recharts';
import { CollapsibleSection } from '../components/common/CollapsibleSection';

interface AmazonFlashDealDashboardProps {
  appData: AppData;
  onSelectItem: (entityType: EntityType, item: Entity) => void;
  onAddNew: (entityType: EntityType) => void;
}

const statusConfig: Record<AmazonFlashDealStatus, { color: string; icon: string; text: string }> = {
    'Borrador': { color: 'bg-slate-500/20 text-slate-300', icon: 'edit', text: 'Borrador' },
    'Programada': { color: 'bg-blue-500/20 text-blue-300', icon: 'clock', text: 'Programada' },
    'Activa': { color: 'bg-green-500/20 text-green-300 animate-pulse', icon: 'bolt', text: 'Activa' },
    'Finalizada': { color: 'bg-gray-500/20 text-gray-400', icon: 'check-circle', text: 'Finalizada' },
    'Cancelada': { color: 'bg-red-500/20 text-red-300', icon: 'ban', text: 'Cancelada' },
};

const KPICard: React.FC<{ title: string; value: string | number; icon: string; iconColor: string }> = ({ title, value, icon, iconColor }) => (
    <div className="bg-slate-800/60 p-4 rounded-lg">
        <div className="flex items-center">
            <div className={`p-2 rounded-full mr-3 ${iconColor}/20`}>
                <Icon name={icon} className={`text-xl ${iconColor}`} />
            </div>
            <div>
                <p className="text-sm text-slate-400">{title}</p>
                <p className="text-2xl font-bold text-slate-200">{value}</p>
            </div>
        </div>
    </div>
);

const GanttTooltip: FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        if (!data.productName) return null;
        
        return (
            <div className="bg-slate-800/90 backdrop-blur-sm p-3 border border-slate-600 rounded-md shadow-lg text-xs">
                <p className="font-bold text-slate-200 mb-2">{label}</p>
                <p className="text-cyan-400">{data.productName}</p>
                <p><strong>Inicio:</strong> {new Date(data.range[0]).toLocaleString()}</p>
                <p><strong>Fin:</strong> {new Date(data.range[1]).toLocaleString()}</p>
                <p><strong>Precio:</strong> {data.dealPrice.toFixed(2)}€</p>
                <p><strong>Estado:</strong> {data.status}</p>
            </div>
        );
    }
    return null;
};

const getStartOfWeek = (d: Date): Date => {
    const date = new Date(d);
    const day = date.getDay() || 7; 
    if (day !== 1) date.setHours(-24 * (day - 1));
    date.setHours(0,0,0,0);
    return date;
}

const FlashDealTimeline: FC<{ deals: any[] }> = ({ deals }) => {
    const [timeRange, setTimeRange] = useState<'month' | 'week'>('month');

    const { chartData, domain } = useMemo(() => {
        const now = new Date();
        let startRange: Date, endRange: Date;

        if (timeRange === 'month') {
            startRange = new Date(now.getFullYear(), now.getMonth(), 1);
            endRange = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        } else { 
            startRange = getStartOfWeek(now);
            endRange = new Date(startRange);
            endRange.setDate(endRange.getDate() + 7);
        }

        const filteredDeals = deals.filter(deal => {
            const dealStart = new Date(deal.startDate);
            const dealEnd = new Date(deal.endDate);
            return dealStart < endRange && dealEnd > startRange;
        });

        const data = filteredDeals.map(deal => {
            const start = new Date(deal.startDate).getTime();
            const end = new Date(deal.endDate).getTime();
            return {
                task: `${deal.productName} - ${deal.name}`,
                start: start,
                duration: end - start,
                status: deal.status,
                productName: deal.productName,
                name: deal.name,
                dealPrice: deal.dealPrice,
                range: [start, end]
            };
        });

        const domain = [startRange.getTime(), endRange.getTime()];
        
        return { chartData: data, domain };
    }, [deals, timeRange]);

    const getColor = (status: AmazonFlashDealStatus) => {
        switch (status) {
            case 'Activa': return '#22c55e';
            case 'Programada': return '#3b82f6';
            case 'Finalizada': return '#6b7280';
            case 'Cancelada': return '#ef4444';
            case 'Borrador': return '#a8a29e';
            default: return '#6b7280';
        }
    };
    
    if (deals.length === 0) {
        return <p className="text-center text-slate-500 p-8">No hay ofertas para mostrar en el timeline.</p>;
    }

    return (
        <div className="h-[600px] w-full p-4">
             <div className="flex justify-end space-x-2 mb-2">
                <button onClick={() => setTimeRange('week')} className={`px-3 py-1 text-xs rounded ${timeRange === 'week' ? 'bg-cyan-500 text-slate-900' : 'bg-slate-700'}`}>Esta Semana</button>
                <button onClick={() => setTimeRange('month')} className={`px-3 py-1 text-xs rounded ${timeRange === 'month' ? 'bg-cyan-500 text-slate-900' : 'bg-slate-700'}`}>Este Mes</button>
            </div>
            {chartData.length === 0 ? (
                 <p className="text-center text-slate-500 p-8">No hay ofertas programadas en el rango de tiempo seleccionado.</p>
            ) : (
                <ResponsiveContainer>
                    <BarChart
                        layout="vertical"
                        data={chartData}
                        margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
                        barCategoryGap={20}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis 
                            type="number" 
                            domain={domain} 
                            tickFormatter={(time) => new Date(time).toLocaleDateString('es-ES', { day: '2-digit', month: 'short'})}
                            stroke="#9ca3af"
                            tick={{ fontSize: 10 }}
                        />
                        <YAxis 
                            type="category" 
                            dataKey="task" 
                            stroke="#9ca3af"
                            width={200}
                            tick={{ fontSize: 12 }}
                        />
                        <Tooltip content={<GanttTooltip />} />
                        <Bar dataKey="start" stackId="a" fill="transparent" />
                        <Bar dataKey="duration" stackId="a">
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getColor(entry.status)} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};


export const AmazonFlashDealDashboard: React.FC<AmazonFlashDealDashboardProps> = ({ appData, onSelectItem, onAddNew }) => {
    const [filterStatus, setFilterStatus] = useState<AmazonFlashDealStatus | ''>('');

    const enrichedDeals = useMemo(() => {
        return appData.amazonFlashDeals.map(deal => {
            const product = appData.products.find(p => p.id === deal.productId);
            const platform = appData.platforms.find(p => p.id === deal.platformId);
            return {
                ...deal,
                productName: product?.name || 'N/A',
                platformName: platform?.name || 'N/A',
            };
        }).sort((a,b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    }, [appData]);

    const filteredDeals = useMemo(() => {
        if (!filterStatus) return enrichedDeals;
        return enrichedDeals.filter(d => d.status === filterStatus);
    }, [enrichedDeals, filterStatus]);
    
    const kpis = useMemo(() => {
        const now = new Date();
        const activeDeals = enrichedDeals.filter(d => d.status === 'Activa');
        return {
            activeNow: activeDeals.length,
            revenueToday: activeDeals.reduce((sum, d) => sum + (d.totalRevenue || 0), 0),
            unitsSoldToday: activeDeals.reduce((sum, d) => sum + (d.unitsSold || 0), 0),
            upcoming24h: enrichedDeals.filter(d => d.status === 'Programada' && new Date(d.startDate) <= new Date(now.getTime() + 24 * 60 * 60 * 1000)).length,
        }
    }, [enrichedDeals]);

    return (
        <div className="bg-slate-800 rounded-lg">
            <div className="p-4 sm:p-6 border-b border-slate-700 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-200">Dashboard de Ofertas Flash</h1>
                    <p className="text-sm text-slate-400 mt-1">Gestiona y monitoriza campañas de precios tácticas.</p>
                </div>
                <button onClick={() => onAddNew('amazonFlashDeals')} className="flex items-center px-4 py-2 bg-cyan-500 text-slate-900 font-semibold rounded-md hover:bg-cyan-600">
                    <Icon name="plus" className="mr-2" /> Nueva Oferta Flash
                </button>
            </div>

            <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <KPICard title="Activas Ahora" value={kpis.activeNow} icon="bolt" iconColor="text-green-400" />
                    <KPICard title="Ingresos (Hoy)" value={`${kpis.revenueToday.toFixed(2)}€`} icon="euro-sign" iconColor="text-cyan-400" />
                    <KPICard title="Unidades (Hoy)" value={kpis.unitsSoldToday} icon="box" iconColor="text-blue-400" />
                    <KPICard title="Próximas 24h" value={kpis.upcoming24h} icon="clock" iconColor="text-yellow-400" />
                </div>
                
                <CollapsibleSection title="Timeline de Ofertas (Gantt)" defaultOpen>
                    <FlashDealTimeline deals={enrichedDeals} />
                </CollapsibleSection>

                <div className="overflow-x-auto border border-slate-700 rounded-lg mt-6">
                    <table className="min-w-full text-sm">
                        <thead className="bg-slate-700/50">
                            <tr>
                                <th className="p-3 text-left font-semibold">Nombre / Campaña</th>
                                <th className="p-3 text-left font-semibold">Producto</th>
                                <th className="p-3 text-left font-semibold">Plataforma</th>
                                <th className="p-3 text-left font-semibold">Fechas</th>
                                <th className="p-3 text-left font-semibold">Precio Oferta</th>
                                <th className="p-3 text-left font-semibold">Estado</th>
                                <th className="p-3 text-left font-semibold">Rendimiento</th>
                                <th className="p-3 text-center font-semibold">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {filteredDeals.map(deal => (
                                <tr key={deal.id} className="hover:bg-slate-700/50">
                                    <td className="p-3 font-bold text-slate-200">{deal.name}</td>
                                    <td className="p-3">{deal.productName}</td>
                                    <td className="p-3">{deal.platformName}</td>
                                    <td className="p-3 text-xs">
                                        <p><strong>Inicio:</strong> {new Date(deal.startDate).toLocaleString()}</p>
                                        <p><strong>Fin:</strong> {new Date(deal.endDate).toLocaleString()}</p>
                                    </td>
                                    <td className="p-3 font-mono font-bold">{deal.dealPrice.toFixed(2)} {deal.currency}</td>
                                    <td className="p-3">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig[deal.status].color}`}>
                                            <Icon name={statusConfig[deal.status].icon} className="mr-1.5" />
                                            {statusConfig[deal.status].text}
                                        </span>
                                    </td>
                                    <td className="p-3 text-xs">
                                        <p><strong>Vendido:</strong> {deal.unitsSold || 0} uds</p>
                                        <p><strong>Ingresos:</strong> {deal.totalRevenue?.toFixed(2) || '0.00'}€</p>
                                    </td>
                                    <td className="p-3 text-center space-x-2">
                                        <button onClick={() => onSelectItem('amazonFlashDeals', deal)} title="Editar" className="p-2 text-slate-400 hover:text-cyan-400"><Icon name="edit"/></button>
                                        <button title="Duplicar" className="p-2 text-slate-400 hover:text-indigo-400"><Icon name="copy"/></button>
                                        {(deal.status === 'Programada' || deal.status === 'Borrador') && <button title="Cancelar" className="p-2 text-slate-400 hover:text-red-400"><Icon name="ban"/></button>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};