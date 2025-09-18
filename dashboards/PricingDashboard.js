"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricingDashboard = void 0;
const react_1 = __importStar(require("react"));
const recharts_1 = require("recharts");
const Icon_1 = require("../components/common/Icon");
const CollapsibleSection_1 = require("../components/common/CollapsibleSection");
const TextInput_1 = require("../components/common/TextInput");
const FormField_1 = require("../components/common/FormField");
const FilterPillsSelector_1 = require("../components/common/FilterPillsSelector");
const pricingService_1 = require("../services/pricingService");
const COLORS = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F',
    '#FFBB28', '#FF8042', '#a4de6c', '#d0ed57', '#ffc658'
];
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (<div className="bg-slate-800/80 backdrop-blur-sm p-3 border border-slate-600 rounded-md shadow-lg text-xs">
        <p className="font-bold text-slate-200 mb-2">{label}</p>
        {payload.map((p, i) => (<div key={i} style={{ color: p.color }}>
            {p.name}: <strong>{p.value.toFixed(2)}€</strong>
          </div>))}
      </div>);
    }
    return null;
};
const PricingDashboard = ({ appData }) => {
    const [priceType, setPriceType] = (0, react_1.useState)('published');
    const [filters, setFilters] = (0, react_1.useState)({
        productIds: null,
        platformIds: null,
        startDate: '',
        endDate: '',
    });
    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({ ...prev, [filterName]: value }));
    };
    const chartData = (0, react_1.useMemo)(() => {
        const { priceHistoryLogs, pvprs, products, platforms, countries } = appData;
        let filteredLogs = priceHistoryLogs.filter(log => {
            const logDate = new Date(log.timestamp);
            if (filters.startDate && log.timestamp.split('T')[0] < filters.startDate)
                return false;
            if (filters.endDate && log.timestamp.split('T')[0] > filters.endDate)
                return false;
            if (filters.productIds && !filters.productIds.includes(log.productId))
                return false;
            if (filters.platformIds && !filters.platformIds.includes(log.platformId))
                return false;
            return true;
        });
        const dataByDate = {};
        // Process final prices
        filteredLogs.forEach(log => {
            const date = new Date(log.timestamp).toLocaleDateString('es-ES');
            if (!dataByDate[date])
                dataByDate[date] = { date };
            const product = products.find(p => p.id === log.productId);
            const platform = platforms.find(p => p.id === log.platformId);
            if (product && platform) {
                const key = `${product.name} - ${platform.name}`;
                let valueToShow = log.newAmount;
                if (priceType === 'final') {
                    valueToShow = (0, pricingService_1.calculateFinalCustomerPrice)(log.newAmount, log.newDiscountPercentage, log.newCouponPercentage);
                }
                dataByDate[date][key] = valueToShow;
            }
        });
        // Process PVPRs for comparison
        pvprs.forEach(pvpr => {
            if (filters.productIds && !filters.productIds.includes(pvpr.productId))
                return;
            const product = products.find(p => p.id === pvpr.productId);
            const country = countries.find(c => c.id === pvpr.countryId);
            if (product && country) {
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
        const allKeys = new Set();
        sortedData.forEach(d => Object.keys(d).forEach(k => k !== 'date' && allKeys.add(k)));
        const lastValues = {};
        return sortedData.map(d => {
            const filledData = { ...d };
            allKeys.forEach(key => {
                if (filledData[key] !== undefined) {
                    lastValues[key] = filledData[key];
                }
                else if (lastValues[key] !== undefined) {
                    filledData[key] = lastValues[key];
                }
            });
            return filledData;
        });
    }, [appData, filters, priceType]);
    const lineKeys = (0, react_1.useMemo)(() => {
        if (chartData.length === 0)
            return [];
        const keys = new Set();
        chartData.forEach(d => Object.keys(d).forEach(k => k !== 'date' && keys.add(k)));
        return Array.from(keys);
    }, [chartData]);
    return (<div className="bg-slate-800 rounded-lg">
            <div className="p-4 sm:p-6 border-b border-slate-700">
                <h1 className="text-2xl font-bold text-slate-200">Dashboard de Precios</h1>
                <p className="text-sm text-slate-400 mt-1">Analiza la evolución de los precios de venta y PVPRs a lo largo del tiempo.</p>
            </div>
            <div className="p-4 sm:p-6 space-y-4">
                <CollapsibleSection_1.CollapsibleSection title="Filtros y Vista" defaultOpen>
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                        <FilterPillsSelector_1.FilterPillsSelector placeholder="Buscar plataformas..." options={appData.platforms.map(p => ({ id: p.id, name: p.name }))} selectedIds={filters.platformIds} onSelectionChange={(ids) => handleFilterChange('platformIds', ids)}/>
                         <FilterPillsSelector_1.FilterPillsSelector placeholder="Buscar productos..." options={appData.products.map(p => ({ id: p.id, name: p.name }))} selectedIds={filters.productIds} onSelectionChange={(ids) => handleFilterChange('productIds', ids)}/>
                        <FormField_1.FormField label="Fecha Inicio">
                            <TextInput_1.TextInput type="date" value={filters.startDate} onChange={e => handleFilterChange('startDate', e.target.value)}/>
                        </FormField_1.FormField>
                        <FormField_1.FormField label="Fecha Fin">
                            <TextInput_1.TextInput type="date" value={filters.endDate} onChange={e => handleFilterChange('endDate', e.target.value)}/>
                        </FormField_1.FormField>
                    </div>
                </CollapsibleSection_1.CollapsibleSection>
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 h-[60vh]">
                     <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-slate-200">Evolución de Precios en el Tiempo</h3>
                        <div className="bg-slate-800 p-1 rounded-lg flex space-x-1">
                            <button onClick={() => setPriceType('published')} className={`px-3 py-1 text-sm font-semibold rounded-md ${priceType === 'published' ? 'bg-cyan-500 text-slate-900' : 'text-slate-300'}`}>Precio Publicado</button>
                            <button onClick={() => setPriceType('final')} className={`px-3 py-1 text-sm font-semibold rounded-md ${priceType === 'final' ? 'bg-cyan-500 text-slate-900' : 'text-slate-300'}`}>Precio Final Cliente</button>
                        </div>
                    </div>
                    {chartData.length > 0 ? (<recharts_1.ResponsiveContainer width="100%" height="90%">
                            <recharts_1.LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <recharts_1.CartesianGrid strokeDasharray="3 3" stroke="#374151"/>
                                <recharts_1.XAxis dataKey="date" stroke="#9ca3af" tick={{ fontSize: 12 }}/>
                                <recharts_1.YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} tickFormatter={(value) => `${value}€`}/>
                                <recharts_1.Tooltip content={<CustomTooltip />}/>
                                <recharts_1.Legend wrapperStyle={{ fontSize: "12px" }}/>
                                {lineKeys.map((key, index) => (<recharts_1.Line key={key} type="monotone" dataKey={key} stroke={COLORS[index % COLORS.length]} strokeWidth={2} dot={false} strokeDasharray={key.includes('PVPR') ? "5 5" : "1"}/>))}
                            </recharts_1.LineChart>
                        </recharts_1.ResponsiveContainer>) : (<div className="text-center p-12 text-slate-500 flex flex-col items-center justify-center h-full">
                            <Icon_1.Icon name="chart-line" className="text-5xl mb-4"/>
                            <p>No hay datos para mostrar con los filtros seleccionados.</p>
                            <p className="text-xs mt-2">Prueba a seleccionar al menos un producto o a ampliar el rango de fechas.</p>
                        </div>)}
                </div>
            </div>
        </div>);
};
exports.PricingDashboard = PricingDashboard;
