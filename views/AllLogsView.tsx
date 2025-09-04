import React, { useState, useMemo } from 'react';
import type { AppData, LoggedEntityType, LogEntry } from '../types';
import { AuditLogDisplay } from '../components/common/AuditLogDisplay';
import { CollapsibleSection } from '../components/common/CollapsibleSection';
import { FormField } from '../components/common/FormField';
import { Select } from '../components/common/Select';
import { TextInput } from '../components/common/TextInput';
import { Icon } from '../components/common/Icon';

interface AllLogsViewProps {
  appData: AppData;
}

const entityTypeOptions: { value: LoggedEntityType; label: string }[] = [
    { value: 'products', label: 'Productos' },
    { value: 'etiquetas', label: 'Etiquetas' },
    { value: 'ingredients', label: 'Ingredientes' },
    { value: 'productNotifications', label: 'Notificaciones' },
];

export const AllLogsView: React.FC<AllLogsViewProps> = ({ appData }) => {
    const [filters, setFilters] = useState({
        entityId: '',
        entityType: '',
        fieldName: '',
        actionType: [] as string[],
        startDate: '',
        endDate: '',
    });
    
    const sortedLogs = useMemo(() => 
        [...appData.logs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
        [appData.logs]
    );

    const availableEntities = useMemo(() => {
        return sortedLogs.map(log => ({ id: `${log.entityType}-${log.entityId}`, name: log.entityName, type: log.entityType }))
            .filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i);
    }, [sortedLogs]);

    const availableFields = useMemo(() => {
        const fieldSet = new Set<string>();
        sortedLogs.forEach(log => {
            log.changes?.forEach(change => fieldSet.add(change.fieldName));
        });
        return Array.from(fieldSet).sort();
    }, [sortedLogs]);

    const filteredLogs = useMemo(() => {
        return sortedLogs.filter(log => {
            if (filters.entityId) {
                const [type, id] = filters.entityId.split('-');
                if (log.entityType !== type || String(log.entityId) !== id) return false;
            }
            if (filters.entityType && log.entityType !== filters.entityType) return false;
            if (filters.fieldName && !log.changes?.some(c => c.fieldName === filters.fieldName)) return false;
            if (filters.actionType.length > 0 && !filters.actionType.includes(log.actionType)) return false;
            if (filters.startDate && new Date(log.timestamp) < new Date(filters.startDate)) return false;
            if (filters.endDate && new Date(log.timestamp) > new Date(filters.endDate)) return false;
            return true;
        });
    }, [sortedLogs, filters]);

    const handleFilterChange = (name: string, value: string | string[]) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleActionTypeChange = (action: string) => {
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
    }

  return (
    <div className="bg-slate-800 rounded-lg">
      <div className="p-4 sm:p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold text-slate-200">Centro de Auditoría y Actividad del Sistema</h1>
        <p className="text-sm text-slate-400 mt-1">Filtra y analiza todos los cambios realizados en el PIM.</p>
      </div>
      <div className="p-4 sm:p-6">
        <CollapsibleSection title="Filtros Avanados">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField label="Entidad Específica">
                    <Select value={filters.entityId} onChange={e => handleFilterChange('entityId', e.target.value)}>
                        <option value="">Todas las entidades</option>
                        {availableEntities.map(e => <option key={e.id} value={e.id}>{e.name} ({e.type})</option>)}
                    </Select>
                </FormField>
                <FormField label="Campo Modificado">
                     <Select value={filters.fieldName} onChange={e => handleFilterChange('fieldName', e.target.value)}>
                        <option value="">Todos los campos</option>
                        {availableFields.map(f => <option key={f} value={f}>{f}</option>)}
                    </Select>
                </FormField>
                <FormField label="Tipo de Entidad">
                    <Select value={filters.entityType} onChange={e => handleFilterChange('entityType', e.target.value)}>
                        <option value="">Todos los tipos</option>
                        {entityTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </Select>
                </FormField>
                <FormField label="Fecha Inicio"><TextInput type="date" value={filters.startDate} onChange={e => handleFilterChange('startDate', e.target.value)}/></FormField>
                <FormField label="Fecha Fin"><TextInput type="date" value={filters.endDate} onChange={e => handleFilterChange('endDate', e.target.value)}/></FormField>
                 <div className="lg:col-span-1">
                    <FormField label="Tipo de Acción">
                        <div className="flex space-x-4 items-center h-full">
                            {['Creación', 'Actualización', 'Eliminación'].map(action => (
                                <label key={action} className="flex items-center">
                                    <input type="checkbox" checked={filters.actionType.includes(action)} onChange={() => handleActionTypeChange(action)} className="h-4 w-4 text-cyan-500 border-slate-600 rounded bg-slate-700 focus:ring-cyan-500" />
                                    <span className="ml-2 text-sm">{action}</span>
                                </label>
                            ))}
                        </div>
                    </FormField>
                 </div>
            </div>
            <div className="mt-4 flex justify-end">
                <button onClick={clearFilters} className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center">
                    <Icon name="times-circle" className="mr-2"/>
                    Limpiar Filtros
                </button>
            </div>
        </CollapsibleSection>
        <div className="mt-6">
            <AuditLogDisplay logs={filteredLogs} highlightedField={filters.fieldName} />
        </div>
      </div>
    </div>
  );
};