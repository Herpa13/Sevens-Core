import React, { useState, useMemo, FC } from 'react';
import type { AppData, KnowledgeBaseEntry, KnowledgeBaseCategory, KnowledgeBaseEntryType, KnowledgeBaseEntryStatus, Entity, EntityType } from '../types';
import { Icon } from '../components/common/Icon';
import { TextInput } from '../components/common/TextInput';
import { Select } from '../components/common/Select';

interface KnowledgeBaseViewProps {
  appData: AppData;
  onSelectItem: (entityType: EntityType, item: Entity) => void;
  onAddNew: (entityType: EntityType) => void;
}

const entryTypeConfig: Record<KnowledgeBaseEntryType, { icon: string; color: string }> = {
    'Texto': { icon: 'file-alt', color: 'text-cyan-400' },
    'Archivo': { icon: 'file-pdf', color: 'text-red-400' },
    'Enlace': { icon: 'link', color: 'text-green-400' },
};

const statusConfig: Record<KnowledgeBaseEntryStatus, { color: string, text: string }> = {
    'Borrador': { color: 'bg-slate-500/50 text-slate-300', text: 'Borrador' },
    'En Revisión': { color: 'bg-yellow-500/20 text-yellow-300', text: 'En Revisión' },
    'Aprobado': { color: 'bg-green-500/20 text-green-300', text: 'Aprobado' },
    'Archivado': { color: 'bg-gray-500/20 text-gray-400', text: 'Archivado' },
};

const CATEGORIES: KnowledgeBaseCategory[] = ['Textos Legales', 'Guías de Marca', 'Marketing', 'Certificados', 'General', 'Buenas Prácticas', 'Guías de Uso'];
const STATUSES: KnowledgeBaseEntryStatus[] = ['Borrador', 'En Revisión', 'Aprobado', 'Archivado'];

const EntryCard: FC<{ entry: KnowledgeBaseEntry; onClick: () => void }> = ({ entry, onClick }) => {
    const typeConf = entryTypeConfig[entry.entryType];
    const statusConf = statusConfig[entry.status];
    return (
        <div onClick={onClick} className={`bg-slate-800/60 p-4 rounded-lg border border-slate-700 hover:border-cyan-500 cursor-pointer flex flex-col justify-between h-full ${entry.status === 'Archivado' ? 'opacity-60' : ''}`}>
            <div>
                <div className="flex justify-between items-start">
                    <h3 className="font-bold text-slate-200 pr-2">{entry.title} <span className="text-sm font-normal text-slate-400">(v{entry.version})</span></h3>
                    <Icon name={typeConf.icon} className={`text-2xl ${typeConf.color}`} />
                </div>
                <div className="mt-2">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusConf.color}`}>{statusConf.text}</span>
                </div>
                <p className="text-sm text-slate-400 mt-2">{entry.description}</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
                 <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-full">{entry.category}</span>
                {entry.tags.map(tag => (
                    <span key={tag} className="text-xs bg-slate-600 text-slate-300 px-2 py-0.5 rounded-full">#{tag}</span>
                ))}
            </div>
        </div>
    );
};

export const KnowledgeBaseView: FC<KnowledgeBaseViewProps> = ({ appData, onSelectItem, onAddNew }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<KnowledgeBaseCategory | ''>('');
    const [typeFilter, setTypeFilter] = useState<KnowledgeBaseEntryType | ''>('');
    const [statusFilter, setStatusFilter] = useState<KnowledgeBaseEntryStatus | ''>('');
    const [showArchived, setShowArchived] = useState(false);

    const filteredEntries = useMemo(() => {
        // Filter out archived entries unless specifically requested
        const activeEntries = showArchived 
            ? appData.knowledgeBaseEntries 
            : appData.knowledgeBaseEntries.filter(entry => entry.status !== 'Archivado');

        return activeEntries.filter(entry => {
            const lowerSearch = searchTerm.toLowerCase();
            const searchMatch =
                searchTerm === '' ||
                entry.title.toLowerCase().includes(lowerSearch) ||
                entry.description.toLowerCase().includes(lowerSearch) ||
                entry.tags.some(tag => tag.toLowerCase().includes(lowerSearch));
            
            const categoryMatch = categoryFilter === '' || entry.category === categoryFilter;
            const typeMatch = typeFilter === '' || entry.entryType === typeFilter;
            const statusMatch = statusFilter === '' || entry.status === statusFilter;

            return searchMatch && categoryMatch && typeMatch && statusMatch;
        });
    }, [appData.knowledgeBaseEntries, searchTerm, categoryFilter, typeFilter, statusFilter, showArchived]);

    return (
        <div className="bg-slate-800 rounded-lg">
            <div className="p-4 sm:p-6 border-b border-slate-700 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-200">Base de Conocimiento</h1>
                    <p className="text-sm text-slate-400 mt-1">Recursos, textos y archivos centralizados para el equipo.</p>
                </div>
                <button
                    onClick={() => onAddNew('knowledgeBaseEntries')}
                    className="flex items-center px-4 py-2 bg-cyan-500 text-slate-900 font-semibold rounded-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500"
                >
                    <Icon name="plus" className="mr-2" />
                    Añadir Entrada
                </button>
            </div>
            <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <TextInput 
                        placeholder="Buscar por título, descripción o etiqueta..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="md:col-span-2"
                    />
                    <Select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value as any)}>
                        <option value="">Todas las categorías</option>
                        {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </Select>
                     <Select value={typeFilter} onChange={e => setTypeFilter(e.target.value as any)}>
                        <option value="">Todos los tipos</option>
                        {Object.keys(entryTypeConfig).map(type => <option key={type} value={type}>{type}</option>)}
                    </Select>
                     <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)}>
                        <option value="">Todos los estados</option>
                        {STATUSES.map(stat => <option key={stat} value={stat}>{stat}</option>)}
                    </Select>
                    <div className="flex items-center md:col-start-2 lg:col-start-4">
                        <input
                            id="showArchived"
                            type="checkbox"
                            checked={showArchived}
                            onChange={e => setShowArchived(e.target.checked)}
                            className="h-4 w-4 text-cyan-500 border-slate-600 rounded bg-slate-700 focus:ring-cyan-500 focus:ring-offset-slate-900"
                        />
                        <label htmlFor="showArchived" className="ml-2 text-sm text-slate-300">
                            Mostrar Archivados
                        </label>
                    </div>
                </div>
                 {filteredEntries.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredEntries.map(entry => (
                            <EntryCard 
                                key={entry.id}
                                entry={entry}
                                onClick={() => onSelectItem('knowledgeBaseEntries', entry)}
                            />
                        ))}
                    </div>
                 ) : (
                    <div className="text-center p-12 text-slate-500">
                        <Icon name="folder-open" className="text-4xl mb-4" />
                        <p>No se encontraron entradas que coincidan con tus filtros.</p>
                    </div>
                 )}
            </div>
        </div>
    );
};