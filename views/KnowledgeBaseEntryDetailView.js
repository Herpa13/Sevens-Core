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
exports.KnowledgeBaseEntryDetailView = void 0;
const react_1 = __importStar(require("react"));
const FormField_1 = require("../components/common/FormField");
const TextInput_1 = require("../components/common/TextInput");
const TextArea_1 = require("../components/common/TextArea");
const Select_1 = require("../components/common/Select");
const KeywordManager_1 = require("../components/common/KeywordManager");
const DocumentManager_1 = require("../components/common/DocumentManager");
const Icon_1 = require("../components/common/Icon");
const lodash_es_1 = require("lodash-es");
const NotesSection_1 = require("../components/common/NotesSection");
const CATEGORIES = ['Textos Legales', 'Guías de Marca', 'Marketing', 'Certificados', 'General', 'Buenas Prácticas', 'Guías de Uso'];
const ENTRY_TYPES = ['Texto', 'Archivo', 'Enlace'];
const STATUSES = ['Borrador', 'En Revisión', 'Aprobado', 'Archivado'];
const TabButton = ({ title, icon, isActive, onClick }) => (<button onClick={onClick} className={`flex items-center space-x-2 py-2 px-4 text-sm font-medium rounded-t-lg border-b-2
            ${isActive
        ? 'border-cyan-500 text-cyan-400 bg-slate-900'
        : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600'}`}>
        <Icon_1.Icon name={icon}/>
        <span>{title}</span>
    </button>);
const KnowledgeBaseEntryDetailView = ({ initialData, onSave, onDelete, onCancel, appData, onSelectItem, setIsDirty, setSaveHandler, onNoteAdd, onNoteUpdate, onNoteDelete }) => {
    const [data, setData] = (0, react_1.useState)(initialData);
    const [activeTab, setActiveTab] = (0, react_1.useState)('main');
    const handleSaveClick = (0, react_1.useCallback)((onSuccess) => {
        onSave({ ...data, updatedAt: new Date().toISOString() });
        if (onSuccess)
            onSuccess();
    }, [data, onSave]);
    (0, react_1.useEffect)(() => {
        setData(initialData);
    }, [initialData]);
    (0, react_1.useEffect)(() => {
        setIsDirty(!(0, lodash_es_1.isEqual)(initialData, data));
    }, [data, initialData, setIsDirty]);
    (0, react_1.useEffect)(() => {
        setSaveHandler(handleSaveClick);
        return () => setSaveHandler(null);
    }, [handleSaveClick, setSaveHandler]);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    };
    const handleContentChange = (field, value) => {
        setData(prev => ({
            ...prev,
            content: { ...prev.content, [field]: value }
        }));
    };
    const handleDeleteClick = () => onDelete(data.id);
    const handleAddNote = (noteText, attachments) => {
        if (typeof data.id !== 'number')
            return;
        const newAttachments = attachments.map(f => ({ id: `temp-${Date.now()}`, name: f.name, url: URL.createObjectURL(f) }));
        onNoteAdd({
            entityType: 'knowledgeBaseEntries',
            entityId: data.id,
            text: noteText,
            attachments: newAttachments,
        });
    };
    const isArchived = data.status === 'Archivado';
    const kbNotes = typeof data.id === 'number' ? appData.notes.filter(n => n.entityType === 'knowledgeBaseEntries' && n.entityId === data.id) : [];
    const MainTab = () => (<div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField_1.FormField label="Título" htmlFor="title" className="md:col-span-2">
                    <TextInput_1.TextInput id="title" name="title" value={data.title} onChange={handleInputChange} disabled={isArchived}/>
                </FormField_1.FormField>
                <FormField_1.FormField label="Estado" htmlFor="status">
                    <Select_1.Select id="status" name="status" value={data.status} onChange={handleInputChange} disabled={isArchived}>
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </Select_1.Select>
                </FormField_1.FormField>
                <FormField_1.FormField label="Descripción" htmlFor="description" className="md:col-span-3">
                    <TextArea_1.TextArea id="description" name="description" value={data.description} onChange={handleInputChange} rows={3} disabled={isArchived}/>
                </FormField_1.FormField>
                <FormField_1.FormField label="Tipo de Entrada" htmlFor="entryType">
                    <Select_1.Select id="entryType" name="entryType" value={data.entryType} onChange={handleInputChange} disabled={isArchived || data.id !== 'new'}>
                        {ENTRY_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                    </Select_1.Select>
                </FormField_1.FormField>
                 <FormField_1.FormField label="Categoría" htmlFor="category">
                    <Select_1.Select id="category" name="category" value={data.category} onChange={handleInputChange} disabled={isArchived}>
                        {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </Select_1.Select>
                </FormField_1.FormField>
            </div>

            <div className="mt-6">
                {data.entryType === 'Texto' && (<FormField_1.FormField label="Contenido del Texto">
                        <TextArea_1.TextArea value={data.content.text || ''} onChange={(e) => handleContentChange('text', e.target.value)} rows={8} disabled={isArchived}/>
                    </FormField_1.FormField>)}
                {data.entryType === 'Archivo' && (<DocumentManager_1.DocumentManager documents={data.content.files || []} onDocumentsChange={files => setData(prev => ({ ...prev, content: { ...prev.content, files } }))}/>)}
                {data.entryType === 'Enlace' && (<FormField_1.FormField label="URL del Enlace">
                        <TextInput_1.TextInput value={data.content.url || ''} onChange={(e) => handleContentChange('url', e.target.value)} placeholder="https://..." disabled={isArchived}/>
                    </FormField_1.FormField>)}
            </div>

             <div className="mt-6">
                <FormField_1.FormField label="Etiquetas (Tags)" helpText="Ayudan a encontrar esta entrada más fácilmente.">
                    <KeywordManager_1.KeywordManager keywords={data.tags} onChange={tags => setData(prev => ({ ...prev, tags }))}/>
                </FormField_1.FormField>
            </div>
        </div>);
    const VersionHistoryTab = () => {
        const versions = (0, react_1.useMemo)(() => {
            const parentId = data.parentId || data.id;
            if (parentId === 'new')
                return [];
            return appData.knowledgeBaseEntries
                .filter(entry => entry.parentId === parentId || entry.id === parentId)
                .sort((a, b) => b.version - a.version);
        }, [data, appData.knowledgeBaseEntries]);
        if (versions.length <= 1) {
            return <p className="text-slate-500 text-center p-8">Esta es la única versión de esta entrada.</p>;
        }
        return (<div className="space-y-2">
                {versions.map(v => (<div key={v.id} onClick={() => onSelectItem('knowledgeBaseEntries', v)} className={`p-3 rounded-md border flex justify-between items-center cursor-pointer ${v.id === data.id ? 'bg-slate-700/50 border-cyan-500' : 'bg-slate-800 border-slate-700 hover:bg-slate-700/50'}`}>
                        <div>
                            <p className="font-bold text-slate-200">Versión {v.version} - <span className="font-normal">{v.status}</span></p>
                            <p className="text-xs text-slate-400">Modificado: {new Date(v.updatedAt).toLocaleString()}</p>
                        </div>
                        {v.id === data.id && <span className="text-xs font-semibold bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded-full">Viendo</span>}
                    </div>))}
            </div>);
    };
    const UsageTab = () => {
        const usages = (0, react_1.useMemo)(() => {
            if (data.id === 'new')
                return [];
            const parentId = data.parentId || data.id;
            return appData.knowledgeBaseUsages
                .filter(u => u.entryId === parentId || u.entryId === data.id)
                .sort((a, b) => new Date(b.usedAt).getTime() - new Date(a.usedAt).getTime());
        }, [data, appData.knowledgeBaseUsages]);
        if (usages.length === 0) {
            return <p className="text-slate-500 text-center p-8">Este activo no ha sido utilizado en ninguna parte todavía.</p>;
        }
        return (<table className="min-w-full text-sm">
                <thead className="border-b-2 border-slate-700">
                    <tr>
                        <th className="p-2 text-left">Entidad</th>
                        <th className="p-2 text-left">Fecha de Uso</th>
                        <th className="p-2 text-left">Usuario</th>
                        <th className="p-2 text-left">Versión Usada</th>
                    </tr>
                </thead>
                <tbody>
                    {usages.map(usage => {
                const user = appData.users.find(u => u.id === usage.userId);
                // @ts-ignore
                const entity = appData[usage.entityType]?.find(e => e.id === usage.entityId);
                const entityName = entity?.name || entity?.identifier || `ID: ${usage.entityId}`;
                return (<tr key={usage.id} className="border-b border-slate-700/50">
                                <td className="p-2">
                                    <button onClick={() => onSelectItem(usage.entityType, entity)} className="text-cyan-400 hover:underline">{entityName}</button>
                                    <span className="text-xs text-slate-500 ml-2">({usage.entityType})</span>
                                </td>
                                <td className="p-2">{new Date(usage.usedAt).toLocaleString()}</td>
                                <td className="p-2">{user?.name || `ID: ${usage.userId}`}</td>
                                <td className="p-2">v{usage.entryVersion}</td>
                            </tr>);
            })}
                </tbody>
            </table>);
    };
    const NotesTab = () => (<div>
            {typeof data.id === 'number' ? (<NotesSection_1.NotesSection notes={kbNotes} onAddNote={handleAddNote} onUpdateNote={onNoteUpdate} onDeleteNote={onNoteDelete}/>) : (<p className="text-slate-500 text-center py-4">Guarda la entrada para poder añadir notas.</p>)}
        </div>);
    return (<div className="bg-slate-800 rounded-lg">
            <div className="p-4 sm:p-6 border-b border-slate-700">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-200">
                            {data.id === 'new' ? 'Nueva Entrada' : `Editando: ${initialData.title}`}
                            {data.id !== 'new' && <span className="ml-3 text-lg font-normal text-slate-400">(v{data.version})</span>}
                        </h2>
                        {isArchived && (<div className="mt-2 text-sm text-yellow-300 bg-yellow-500/10 p-2 rounded-md border border-yellow-500/20">
                                <Icon_1.Icon name="archive" className="mr-2"/>
                                Estás viendo una versión archivada. No se puede editar.
                            </div>)}
                    </div>
                    <div className="flex space-x-2">
                        {data.id !== 'new' && !isArchived && (<button onClick={handleDeleteClick} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 font-semibold">
                                Eliminar
                            </button>)}
                        <button onClick={onCancel} className="px-4 py-2 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500 font-semibold">
                            Cancelar
                        </button>
                        {!isArchived && (<button onClick={() => handleSaveClick()} className="px-4 py-2 bg-cyan-500 text-slate-900 rounded-md hover:bg-cyan-600 font-semibold">
                                {data.status === 'Aprobado' ? 'Guardar como Nueva Versión' : 'Guardar Cambios'}
                            </button>)}
                    </div>
                </div>
            </div>

             <div className="border-b border-slate-700 bg-slate-800 px-4">
                <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                    <TabButton title="Principal" icon="file-alt" isActive={activeTab === 'main'} onClick={() => setActiveTab('main')}/>
                    <TabButton title="Notas" icon="sticky-note" isActive={activeTab === 'notes'} onClick={() => setActiveTab('notes')}/>
                    <TabButton title="Historial de Versiones" icon="history" isActive={activeTab === 'versions'} onClick={() => setActiveTab('versions')}/>
                    <TabButton title="Dónde se usa" icon="map-marker-alt" isActive={activeTab === 'usage'} onClick={() => setActiveTab('usage')}/>
                </nav>
            </div>

            <div className="p-4 sm:p-6 lg:p-8 bg-slate-900 rounded-b-lg">
                {activeTab === 'main' && <MainTab />}
                {activeTab === 'notes' && <NotesTab />}
                {activeTab === 'versions' && <VersionHistoryTab />}
                {activeTab === 'usage' && <UsageTab />}
            </div>
        </div>);
};
exports.KnowledgeBaseEntryDetailView = KnowledgeBaseEntryDetailView;
