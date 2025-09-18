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
exports.TaskDetailView = void 0;
const react_1 = __importStar(require("react"));
const FormField_1 = require("../components/common/FormField");
const TextInput_1 = require("../components/common/TextInput");
const TextArea_1 = require("../components/common/TextArea");
const Select_1 = require("../components/common/Select");
const Icon_1 = require("../components/common/Icon");
const CollapsibleSection_1 = require("../components/common/CollapsibleSection");
const lodash_es_1 = require("lodash-es");
const NotesSection_1 = require("../components/common/NotesSection");
const KeywordManager_1 = require("../components/common/KeywordManager");
const MultiSelect_1 = require("../components/common/MultiSelect");
const TASK_STATUSES = ['Pendiente', 'En Proceso', 'En Revisión', 'Bloqueada', 'Completada'];
const TASK_PRIORITIES = ['Baja', 'Media', 'Alta', 'Urgente'];
const SubtaskItem = ({ subtask, users, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = (0, react_1.useState)(false);
    const [name, setName] = (0, react_1.useState)(subtask.name);
    const assignee = users.find(u => u.id === subtask.assigneeId);
    const handleSave = () => {
        onUpdate({ name });
        setIsEditing(false);
    };
    return (<div className="flex items-center space-x-2 p-1.5 rounded-md hover:bg-slate-700 group">
            <input type="checkbox" checked={subtask.isCompleted} onChange={(e) => onUpdate({ isCompleted: e.target.checked })} className="h-4 w-4 text-cyan-500 border-slate-600 rounded bg-slate-800 focus:ring-cyan-500 focus:ring-offset-slate-900 flex-shrink-0"/>
            {isEditing ? (<TextInput_1.TextInput value={name} onChange={e => setName(e.target.value)} onBlur={handleSave} onKeyDown={e => e.key === 'Enter' && handleSave()} autoFocus className="!py-1 text-sm"/>) : (<span onDoubleClick={() => setIsEditing(true)} className={`flex-grow text-sm ${subtask.isCompleted ? 'line-through text-slate-500' : 'text-slate-300'}`}>
                    {subtask.name}
                </span>)}
             {subtask.dueDate && <span className="text-xs text-slate-400 flex-shrink-0"><Icon_1.Icon name="calendar-alt" className="mr-1"/>{new Date(subtask.dueDate + 'T00:00:00').toLocaleDateString()}</span>}
             {assignee && <div title={assignee.name} className="w-5 h-5 bg-slate-600 rounded-full flex items-center justify-center text-xs font-bold text-slate-200 flex-shrink-0">{assignee.name.charAt(0)}</div>}

            <button onClick={onDelete} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                <Icon_1.Icon name="trash-alt" className="w-3"/>
            </button>
        </div>);
};
const TaskDetailView = ({ initialData, onSave, onDelete, onCancel, appData, currentUser, onCommentAdd, onSaveSubtask, onDeleteSubtask, setIsDirty, setSaveHandler, onNoteAdd, onNoteUpdate, onNoteDelete }) => {
    const [data, setData] = (0, react_1.useState)(initialData);
    const [newComment, setNewComment] = (0, react_1.useState)('');
    const [newSubtaskName, setNewSubtaskName] = (0, react_1.useState)('');
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
        const { name, value, type } = e.target;
        const val = type === 'number' ? (value ? Number(value) : undefined) : value;
        setData(prev => ({ ...prev, [name]: val }));
    };
    // FIX: Directly call onDelete with the entity ID. The parent handler in App.tsx will manage the logic for 'new' vs. existing entities.
    const handleDeleteClick = () => onDelete(data.id);
    const commentsForTask = (0, react_1.useMemo)(() => appData.taskComments.filter(c => c.taskId === data.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), [appData.taskComments, data.id]);
    const subtasks = (0, react_1.useMemo)(() => appData.subtasks.filter(s => s.taskId === data.id), [appData.subtasks, data.id]);
    const taskNotes = typeof data.id === 'number' ? appData.notes.filter(n => n.entityType === 'tasks' && n.entityId === data.id) : [];
    const handleAddComment = () => {
        if (newComment.trim() && typeof data.id === 'number') {
            onCommentAdd({
                taskId: data.id,
                authorId: currentUser.id,
                text: newComment.trim(),
            });
            setNewComment('');
        }
    };
    const handleAddSubtask = () => {
        if (newSubtaskName.trim() && typeof data.id === 'number') {
            onSaveSubtask({
                id: 'new',
                taskId: data.id,
                name: newSubtaskName.trim(),
                isCompleted: false,
            });
            setNewSubtaskName('');
        }
    };
    const handleAddNote = (noteText, attachments) => {
        if (typeof data.id !== 'number')
            return;
        const newAttachments = attachments.map(f => ({ id: `temp-${Date.now()}`, name: f.name, url: URL.createObjectURL(f) }));
        onNoteAdd({
            entityType: 'tasks',
            entityId: data.id,
            text: noteText,
            attachments: newAttachments,
        });
    };
    const handleSubtaskUpdate = (subtask, updates) => {
        onSaveSubtask({ ...subtask, ...updates });
    };
    const creator = (0, react_1.useMemo)(() => appData.users.find(u => u.id === data.creatorId), [appData.users, data.creatorId]);
    const renderCommentText = (text) => {
        const userMentions = appData.users.map(u => u.name);
        const regex = new RegExp(`@(${userMentions.join('|')})`, 'g');
        const parts = text.split(regex);
        return parts.map((part, index) => {
            if (index % 2 === 1) { // This is a matched mention
                return <strong key={index} className="text-cyan-400 bg-cyan-500/10 px-1 rounded-sm">@{part}</strong>;
            }
            return part;
        });
    };
    return (<div className="bg-slate-800 rounded-lg">
      <div className="p-4 sm:p-6 border-b border-slate-700 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-200">{data.id === 'new' ? 'Nueva Tarea' : `Editando Tarea: ${initialData.name}`}</h2>
         <div className="flex space-x-2">
            {data.id !== 'new' && <button onClick={handleDeleteClick} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 font-semibold">Eliminar</button>}
            <button onClick={onCancel} className="px-4 py-2 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500 font-semibold">Cancelar</button>
            <button onClick={() => handleSaveClick()} className="px-4 py-2 bg-cyan-500 text-slate-900 rounded-md hover:bg-cyan-600 font-semibold">Guardar Tarea</button>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
            <FormField_1.FormField label="Nombre de la Tarea" htmlFor="name">
                <TextInput_1.TextInput id="name" name="name" value={data.name} onChange={handleInputChange}/>
            </FormField_1.FormField>
            <FormField_1.FormField label="Descripción" htmlFor="description">
                <TextArea_1.TextArea id="description" name="description" value={data.description} onChange={handleInputChange} rows={5}/>
            </FormField_1.FormField>

             <CollapsibleSection_1.CollapsibleSection title="Subtareas / Checklist">
                <div className="p-4 space-y-2">
                    {subtasks.map(st => (<SubtaskItem key={st.id} subtask={st} users={appData.users} onUpdate={(updates) => handleSubtaskUpdate(st, updates)} onDelete={() => onDeleteSubtask(st.id)}/>))}
                    <div className="pt-2 flex space-x-2">
                        <TextInput_1.TextInput placeholder="Añadir nueva subtarea..." value={newSubtaskName} onChange={(e) => setNewSubtaskName(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddSubtask())}/>
                        <button onClick={handleAddSubtask} disabled={!newSubtaskName.trim()} className="px-4 py-2 bg-slate-600 text-slate-200 text-sm font-semibold rounded-md hover:bg-slate-500 disabled:opacity-50">Añadir</button>
                    </div>
                </div>
            </CollapsibleSection_1.CollapsibleSection>

            <CollapsibleSection_1.CollapsibleSection title="Comentarios">
                <div className="p-4 space-y-4">
                    <div className="flex space-x-3">
                        <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center text-sm font-bold text-slate-200 flex-shrink-0">{currentUser.name.charAt(0)}</div>
                        <div className="flex-grow">
                             <TextArea_1.TextArea placeholder="Añade un comentario... Usa @ para mencionar a alguien." value={newComment} onChange={e => setNewComment(e.target.value)} rows={3}/>
                            <div className="flex justify-end mt-2">
                                <button onClick={handleAddComment} disabled={!newComment.trim()} className="px-4 py-2 bg-cyan-500 text-slate-900 text-sm font-semibold rounded-md hover:bg-cyan-600 disabled:opacity-50">Comentar</button>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {commentsForTask.map(comment => {
            const author = appData.users.find(u => u.id === comment.authorId);
            return (<div key={comment.id} className="flex space-x-3">
                                    <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center text-sm font-bold text-slate-200 flex-shrink-0">{author?.name.charAt(0)}</div>
                                    <div className="bg-slate-700/50 p-3 rounded-lg flex-grow">
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-sm text-slate-200">{author?.name}</span>
                                            <span className="text-xs text-slate-400">{new Date(comment.createdAt).toLocaleString()}</span>
                                        </div>
                                        <p className="text-sm text-slate-300 mt-1">{renderCommentText(comment.text)}</p>
                                    </div>
                                </div>);
        })}
                    </div>
                </div>
            </CollapsibleSection_1.CollapsibleSection>
            
            <CollapsibleSection_1.CollapsibleSection title="Notas Privadas">
                <div className="p-4">
                    {typeof data.id === 'number' ? (<NotesSection_1.NotesSection notes={taskNotes} onAddNote={handleAddNote} onUpdateNote={onNoteUpdate} onDeleteNote={onNoteDelete}/>) : (<p className="text-slate-500 text-center py-4">Guarda la tarea para poder añadir notas.</p>)}
                </div>
            </CollapsibleSection_1.CollapsibleSection>

        </div>
        <div className="lg:col-span-1 space-y-4">
            <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                <FormField_1.FormField label="Estado" htmlFor="status">
                    <Select_1.Select id="status" name="status" value={data.status} onChange={handleInputChange}>
                        {TASK_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </Select_1.Select>
                </FormField_1.FormField>
                <FormField_1.FormField label="Prioridad" htmlFor="priority">
                    <Select_1.Select id="priority" name="priority" value={data.priority} onChange={handleInputChange}>
                        {TASK_PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                    </Select_1.Select>
                </FormField_1.FormField>
                <FormField_1.FormField label="Asignado a" htmlFor="assigneeId">
                    <Select_1.Select id="assigneeId" name="assigneeId" value={data.assigneeId} onChange={handleInputChange}>
                        {appData.users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
                    </Select_1.Select>
                </FormField_1.FormField>
                <FormField_1.FormField label="Fecha de Vencimiento" htmlFor="dueDate">
                    <TextInput_1.TextInput type="date" id="dueDate" name="dueDate" value={data.dueDate || ''} onChange={handleInputChange}/>
                </FormField_1.FormField>
            </div>
             <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                 <p className="text-sm text-slate-400"><strong>Creado por:</strong> {creator?.name}</p>
                 <p className="text-sm text-slate-400"><strong>Fecha Creación:</strong> {new Date(data.createdAt).toLocaleDateString()}</p>
                 <p className="text-sm text-slate-400"><strong>Última Actualización:</strong> {new Date(data.updatedAt).toLocaleString()}</p>
             </div>
             <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                <FormField_1.FormField label="Etiquetas" htmlFor="tags">
                    <KeywordManager_1.KeywordManager keywords={data.tags || []} onChange={tags => setData(p => ({ ...p, tags }))}/>
                </FormField_1.FormField>
            </div>
             <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                 <FormField_1.FormField label="Bloqueada por" helpText="Tareas que deben completarse antes que esta.">
                     <MultiSelect_1.MultiSelect options={appData.tasks.filter(t => t.id !== data.id && t.status !== 'Completada').map(t => ({ id: t.id, name: t.name }))} selectedIds={data.isBlockedBy || []} onSelectionChange={ids => setData(p => ({ ...p, isBlockedBy: ids }))}/>
                 </FormField_1.FormField>
             </div>
        </div>
      </div>
    </div>);
};
exports.TaskDetailView = TaskDetailView;
