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
exports.AllNotesListView = void 0;
const react_1 = __importStar(require("react"));
const Icon_1 = require("../components/common/Icon");
const TextInput_1 = require("../components/common/TextInput");
const Select_1 = require("../components/common/Select");
const entityTypeConfig = {
    products: { name: 'Productos', icon: 'box-open', dataKey: 'products' },
    platforms: { name: 'Plataformas', icon: 'store', dataKey: 'platforms' },
    competitorBrands: { name: 'Marcas de Competencia', icon: 'copyright', dataKey: 'competitorBrands' },
    etiquetas: { name: 'Etiquetas', icon: 'tags', dataKey: 'etiquetas' },
    ingredients: { name: 'Ingredientes', icon: 'flask-vial', dataKey: 'ingredients' },
    batches: { name: 'Lotes', icon: 'barcode', dataKey: 'batches' },
    purchaseOrders: { name: 'Pedidos de Fabricación', icon: 'file-invoice-dollar', dataKey: 'purchaseOrders' },
    countries: { name: 'Países', icon: 'globe', dataKey: 'countries' },
    envases: { name: 'Envases', icon: 'box', dataKey: 'envases' },
    competitorProducts: { name: 'Productos de Competencia', icon: 'users-viewfinder', dataKey: 'competitorProducts' },
    tasks: { name: 'Tareas', icon: 'tasks', dataKey: 'tasks' },
    videoProjects: { name: 'Proyectos de Vídeo', icon: 'film', dataKey: 'videoProjects' },
    knowledgeBaseEntries: { name: 'Base de Conocimiento', icon: 'book', dataKey: 'knowledgeBaseEntries' },
};
const TabButton = ({ title, count, isActive, onClick }) => (<button onClick={onClick} className={`px-4 py-2 text-sm font-semibold rounded-md flex items-center space-x-2 ${isActive ? 'bg-cyan-500 text-slate-900' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'}`}>
        <span>{title}</span>
        <span className="bg-slate-800/50 text-slate-300 text-xs px-2 py-0.5 rounded-full">{count}</span>
    </button>);
const AllNotesListView = ({ appData, onSelectItem, onNoteUpdate }) => {
    const [activeTab, setActiveTab] = (0, react_1.useState)('Activa');
    const [searchTerm, setSearchTerm] = (0, react_1.useState)('');
    const [entityTypeFilter, setEntityTypeFilter] = (0, react_1.useState)('');
    const notesWithEntities = (0, react_1.useMemo)(() => {
        return appData.notes.map(note => {
            const config = entityTypeConfig[note.entityType];
            if (!config)
                return { ...note, entityName: `Tipo Desconocido: ${note.entityType}`, entity: null };
            // @ts-ignore
            const entity = appData[config.dataKey]?.find(e => e.id === note.entityId);
            const entityName = entity?.name || entity?.identifier || entity?.title || `ID: ${note.entityId}`;
            return { ...note, entityName, entity };
        }).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    }, [appData]);
    const filteredNotes = (0, react_1.useMemo)(() => {
        return notesWithEntities.filter(note => {
            const tabMatch = note.status === activeTab;
            const entityTypeMatch = !entityTypeFilter || note.entityType === entityTypeFilter;
            const searchTermMatch = !searchTerm ||
                note.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                note.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                note.authorName.toLowerCase().includes(searchTerm.toLowerCase());
            return tabMatch && entityTypeMatch && searchTermMatch;
        });
    }, [notesWithEntities, activeTab, entityTypeFilter, searchTerm]);
    const handleUnarchive = (note) => {
        onNoteUpdate({ ...note, status: 'Activa', archiveReason: undefined });
    };
    return (<div className="bg-slate-800 rounded-lg">
            <div className="p-4 sm:p-6 border-b border-slate-700">
                <h1 className="text-2xl font-bold text-slate-200">Visor de Notas Global</h1>
                <div className="flex justify-between items-center mt-4">
                    <div className="flex space-x-2">
                        <TabButton title="Activas" count={notesWithEntities.filter(n => n.status === 'Activa').length} isActive={activeTab === 'Activa'} onClick={() => setActiveTab('Activa')}/>
                        <TabButton title="Archivadas" count={notesWithEntities.filter(n => n.status === 'Archivada').length} isActive={activeTab === 'Archivada'} onClick={() => setActiveTab('Archivada')}/>
                    </div>
                     <div className="flex items-center space-x-2">
                        <Select_1.Select value={entityTypeFilter} onChange={e => setEntityTypeFilter(e.target.value)}>
                            <option value="">Todos los tipos</option>
                            {Object.entries(entityTypeConfig).map(([key, config]) => (<option key={key} value={key}>{config.name}</option>))}
                        </Select_1.Select>
                        <TextInput_1.TextInput placeholder="Buscar en notas..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}/>
                    </div>
                </div>
            </div>
            <div className="p-4 space-y-3">
                {filteredNotes.length > 0 ? filteredNotes.map(note => (<div key={note.id} className="bg-slate-800/60 p-3 rounded-md border border-slate-700">
                         <div className="flex justify-between items-start">
                             <div className="flex-grow">
                                <p className="text-sm text-slate-300 whitespace-pre-wrap">{note.text}</p>
                                {note.status === 'Archivada' && (<p className="text-xs italic text-yellow-400/80 mt-1">
                                        <Icon_1.Icon name="archive" className="mr-1.5"/>
                                        Archivado por: {note.archiveReason}
                                    </p>)}
                             </div>
                             {note.status === 'Archivada' && (<button onClick={() => handleUnarchive(note)} className="ml-4 px-3 py-1 bg-yellow-500/20 text-yellow-300 text-xs font-semibold rounded-md hover:bg-yellow-500/30">
                                    <Icon_1.Icon name="undo" className="mr-1.5"/>
                                    Restaurar
                                </button>)}
                         </div>
                         <div className="mt-2 pt-2 border-t border-slate-700/50 flex justify-between items-center text-xs text-slate-400">
                            <div>
                                <span>{note.authorName} - {new Date(note.updatedAt).toLocaleString()}</span>
                            </div>
                            {note.entity && (<button onClick={() => onSelectItem(note.entityType, note.entity)} className="flex items-center space-x-1.5 text-cyan-400 hover:underline">
                                    <Icon_1.Icon name={entityTypeConfig[note.entityType].icon}/>
                                    <span>{note.entityName}</span>
                                </button>)}
                         </div>
                    </div>)) : (<div className="text-center p-12 text-slate-500">
                        <Icon_1.Icon name="folder-open" className="text-4xl mb-4"/>
                        <p>No se encontraron notas que coincidan con tus filtros.</p>
                    </div>)}
            </div>
        </div>);
};
exports.AllNotesListView = AllNotesListView;
