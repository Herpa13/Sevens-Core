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
exports.AllLogsView = void 0;
const react_1 = __importStar(require("react"));
const AuditLogDisplay_1 = require("../components/common/AuditLogDisplay");
const CollapsibleSection_1 = require("../components/common/CollapsibleSection");
const FormField_1 = require("../components/common/FormField");
const Select_1 = require("../components/common/Select");
const TextInput_1 = require("../components/common/TextInput");
const Icon_1 = require("../components/common/Icon");
const entityTypeOptions = [
    { value: 'products', label: 'Productos' },
    { value: 'etiquetas', label: 'Etiquetas' },
    { value: 'ingredients', label: 'Ingredientes' },
    { value: 'productNotifications', label: 'Notificaciones' },
];
const AllLogsView = ({ appData }) => {
    const [filters, setFilters] = (0, react_1.useState)({
        entityId: '',
        entityType: '',
        fieldName: '',
        actionType: [],
        startDate: '',
        endDate: '',
    });
    const sortedLogs = (0, react_1.useMemo)(() => [...appData.logs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()), [appData.logs]);
    const availableEntities = (0, react_1.useMemo)(() => {
        return sortedLogs.map(log => ({ id: `${log.entityType}-${log.entityId}`, name: log.entityName, type: log.entityType }))
            .filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i);
    }, [sortedLogs]);
    const availableFields = (0, react_1.useMemo)(() => {
        const fieldSet = new Set();
        sortedLogs.forEach(log => {
            log.changes?.forEach(change => fieldSet.add(change.fieldName));
        });
        return Array.from(fieldSet).sort();
    }, [sortedLogs]);
    const filteredLogs = (0, react_1.useMemo)(() => {
        return sortedLogs.filter(log => {
            if (filters.entityId) {
                const [type, id] = filters.entityId.split('-');
                if (log.entityType !== type || String(log.entityId) !== id)
                    return false;
            }
            if (filters.entityType && log.entityType !== filters.entityType)
                return false;
            if (filters.fieldName && !log.changes?.some(c => c.fieldName === filters.fieldName))
                return false;
            if (filters.actionType.length > 0 && !filters.actionType.includes(log.actionType))
                return false;
            if (filters.startDate && new Date(log.timestamp) < new Date(filters.startDate))
                return false;
            if (filters.endDate && new Date(log.timestamp) > new Date(filters.endDate))
                return false;
            return true;
        });
    }, [sortedLogs, filters]);
    const handleFilterChange = (name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };
    const handleActionTypeChange = (action) => {
        const newActions = filters.actionType.includes(action)
            ? filters.actionType.filter(a => a !== action)
            : [...filters.actionType, action];
        handleFilterChange('actionType', newActions);
    };
    const clearFilters = () => {
        setFilters({
            entityId: '',
            entityType: '',
            fieldName: '',
            actionType: [],
            startDate: '',
            endDate: '',
        });
    };
    return (<div className="bg-slate-800 rounded-lg">
      <div className="p-4 sm:p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold text-slate-200">Centro de Auditoría y Actividad del Sistema</h1>
        <p className="text-sm text-slate-400 mt-1">Filtra y analiza todos los cambios realizados en el PIM.</p>
      </div>
      <div className="p-4 sm:p-6">
        <CollapsibleSection_1.CollapsibleSection title="Filtros Avanados">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField_1.FormField label="Entidad Específica">
                    <Select_1.Select value={filters.entityId} onChange={e => handleFilterChange('entityId', e.target.value)}>
                        <option value="">Todas las entidades</option>
                        {availableEntities.map(e => <option key={e.id} value={e.id}>{e.name} ({e.type})</option>)}
                    </Select_1.Select>
                </FormField_1.FormField>
                <FormField_1.FormField label="Campo Modificado">
                     <Select_1.Select value={filters.fieldName} onChange={e => handleFilterChange('fieldName', e.target.value)}>
                        <option value="">Todos los campos</option>
                        {availableFields.map(f => <option key={f} value={f}>{f}</option>)}
                    </Select_1.Select>
                </FormField_1.FormField>
                <FormField_1.FormField label="Tipo de Entidad">
                    <Select_1.Select value={filters.entityType} onChange={e => handleFilterChange('entityType', e.target.value)}>
                        <option value="">Todos los tipos</option>
                        {entityTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </Select_1.Select>
                </FormField_1.FormField>
                <FormField_1.FormField label="Fecha Inicio"><TextInput_1.TextInput type="date" value={filters.startDate} onChange={e => handleFilterChange('startDate', e.target.value)}/></FormField_1.FormField>
                <FormField_1.FormField label="Fecha Fin"><TextInput_1.TextInput type="date" value={filters.endDate} onChange={e => handleFilterChange('endDate', e.target.value)}/></FormField_1.FormField>
                 <div className="lg:col-span-1">
                    <FormField_1.FormField label="Tipo de Acción">
                        <div className="flex space-x-4 items-center h-full">
                            {['Creación', 'Actualización', 'Eliminación'].map(action => (<label key={action} className="flex items-center">
                                    <input type="checkbox" checked={filters.actionType.includes(action)} onChange={() => handleActionTypeChange(action)} className="h-4 w-4 text-cyan-500 border-slate-600 rounded bg-slate-700 focus:ring-cyan-500"/>
                                    <span className="ml-2 text-sm">{action}</span>
                                </label>))}
                        </div>
                    </FormField_1.FormField>
                 </div>
            </div>
            <div className="mt-4 flex justify-end">
                <button onClick={clearFilters} className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center">
                    <Icon_1.Icon name="times-circle" className="mr-2"/>
                    Limpiar Filtros
                </button>
            </div>
        </CollapsibleSection_1.CollapsibleSection>
        <div className="mt-6">
            <AuditLogDisplay_1.AuditLogDisplay logs={filteredLogs} highlightedField={filters.fieldName}/>
        </div>
      </div>
    </div>);
};
exports.AllLogsView = AllLogsView;
