import React, { useState, useMemo, useEffect, useCallback } from 'react';
import type { Task, TaskComment, AppData, User, TaskStatus, TaskPriority, Subtask, Note, NoteAttachment, TaskRecurrenceFrequency } from '../types';
import { FormField } from '../components/common/FormField';
import { TextInput } from '../components/common/TextInput';
import { TextArea } from '../components/common/TextArea';
import { Select } from '../components/common/Select';
import { Icon } from '../components/common/Icon';
import { CollapsibleSection } from '../components/common/CollapsibleSection';
import { isEqual } from 'lodash-es';
import { NotesSection } from '../components/common/NotesSection';
import { KeywordManager } from '../components/common/KeywordManager';
import { MultiSelect } from '../components/common/MultiSelect';

interface TaskDetailViewProps {
  initialData: Task;
  onSave: (data: Task) => void;
  // FIX: Update onDelete prop to accept 'number | "new"' to resolve type error from App.tsx.
  onDelete: (id: number | 'new') => void;
  onCancel: () => void;
  appData: AppData;
  currentUser: User;
  onCommentAdd: (comment: Omit<TaskComment, 'id' | 'createdAt'>) => void;
  onSaveSubtask: (subtask: Subtask) => void;
  onDeleteSubtask: (subtaskId: number) => void;
  setIsDirty: (isDirty: boolean) => void;
  setSaveHandler: (handler: ((onSuccess?: () => void) => void) | null) => void;
  onNoteAdd: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'authorName'>) => void;
  onNoteUpdate: (note: Note) => void;
  onNoteDelete: (noteId: number | 'new') => void;
}

const TASK_STATUSES: TaskStatus[] = ['Pendiente', 'En Proceso', 'En Revisión', 'Bloqueada', 'Completada'];
const TASK_PRIORITIES: TaskPriority[] = ['Baja', 'Media', 'Alta', 'Urgente'];

const SubtaskItem: React.FC<{
    subtask: Subtask;
    users: User[];
    onUpdate: (updates: Partial<Subtask>) => void;
    onDelete: () => void;
}> = ({ subtask, users, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(subtask.name);
    const assignee = users.find(u => u.id === subtask.assigneeId);

    const handleSave = () => {
        onUpdate({ name });
        setIsEditing(false);
    }
    
    return (
        <div className="flex items-center space-x-2 p-1.5 rounded-md hover:bg-slate-700 group">
            <input
                type="checkbox"
                checked={subtask.isCompleted}
                onChange={(e) => onUpdate({ isCompleted: e.target.checked })}
                className="h-4 w-4 text-cyan-500 border-slate-600 rounded bg-slate-800 focus:ring-cyan-500 focus:ring-offset-slate-900 flex-shrink-0"
            />
            {isEditing ? (
                 <TextInput value={name} onChange={e => setName(e.target.value)} onBlur={handleSave} onKeyDown={e => e.key === 'Enter' && handleSave()} autoFocus className="!py-1 text-sm"/>
            ) : (
                <span onDoubleClick={() => setIsEditing(true)} className={`flex-grow text-sm ${subtask.isCompleted ? 'line-through text-slate-500' : 'text-slate-300'}`}>
                    {subtask.name}
                </span>
            )}
             {subtask.dueDate && <span className="text-xs text-slate-400 flex-shrink-0"><Icon name="calendar-alt" className="mr-1"/>{new Date(subtask.dueDate + 'T00:00:00').toLocaleDateString()}</span>}
             {assignee && <div title={assignee.name} className="w-5 h-5 bg-slate-600 rounded-full flex items-center justify-center text-xs font-bold text-slate-200 flex-shrink-0">{assignee.name.charAt(0)}</div>}

            <button onClick={onDelete} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                <Icon name="trash-alt" className="w-3"/>
            </button>
        </div>
    );
};

export const TaskDetailView: React.FC<TaskDetailViewProps> = ({ initialData, onSave, onDelete, onCancel, appData, currentUser, onCommentAdd, onSaveSubtask, onDeleteSubtask, setIsDirty, setSaveHandler, onNoteAdd, onNoteUpdate, onNoteDelete }) => {
  const [data, setData] = useState<Task>(initialData);
  const [newComment, setNewComment] = useState('');
  const [newSubtaskName, setNewSubtaskName] = useState('');

  const handleSaveClick = useCallback((onSuccess?: () => void) => {
    onSave({...data, updatedAt: new Date().toISOString() });
    if (onSuccess) onSuccess();
  }, [data, onSave]);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  useEffect(() => {
    setIsDirty(!isEqual(initialData, data));
  }, [data, initialData, setIsDirty]);

  useEffect(() => {
    setSaveHandler(handleSaveClick);
    return () => setSaveHandler(null);
  }, [handleSaveClick, setSaveHandler]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'number' ? (value ? Number(value) : undefined) : value;
    setData(prev => ({ ...prev, [name]: val }));
  };
  
  // FIX: Directly call onDelete with the entity ID. The parent handler in App.tsx will manage the logic for 'new' vs. existing entities.
  const handleDeleteClick = () => onDelete(data.id);

  const commentsForTask = useMemo(() => 
    appData.taskComments.filter(c => c.taskId === data.id).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [appData.taskComments, data.id]
  );
  
  const subtasks = useMemo(() => appData.subtasks.filter(s => s.taskId === data.id), [appData.subtasks, data.id]);
  
  const taskNotes = typeof data.id === 'number' ? appData.notes.filter(n => n.entityType === 'tasks' && n.entityId === data.id) : [];

  const handleAddComment = () => {
    if (newComment.trim() && typeof data.id === 'number') {
        onCommentAdd({
            taskId: data.id,
            authorId: currentUser.id as number,
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
  
  const handleAddNote = (noteText: string, attachments: File[]) => {
    if (typeof data.id !== 'number') return;
    const newAttachments: NoteAttachment[] = attachments.map(f => ({ id: `temp-${Date.now()}`, name: f.name, url: URL.createObjectURL(f) }));
    onNoteAdd({
      entityType: 'tasks',
      entityId: data.id,
      text: noteText,
      attachments: newAttachments,
    });
  };

  const handleSubtaskUpdate = (subtask: Subtask, updates: Partial<Subtask>) => {
    onSaveSubtask({ ...subtask, ...updates });
  };
  
  const creator = useMemo(() => appData.users.find(u => u.id === data.creatorId), [appData.users, data.creatorId]);
  
  const renderCommentText = (text: string) => {
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

  return (
    <div className="bg-slate-800 rounded-lg">
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
            <FormField label="Nombre de la Tarea" htmlFor="name">
                <TextInput id="name" name="name" value={data.name} onChange={handleInputChange} />
            </FormField>
            <FormField label="Descripción" htmlFor="description">
                <TextArea id="description" name="description" value={data.description} onChange={handleInputChange} rows={5}/>
            </FormField>

             <CollapsibleSection title="Subtareas / Checklist">
                <div className="p-4 space-y-2">
                    {subtasks.map(st => (
                        <SubtaskItem 
                            key={st.id} 
                            subtask={st} 
                            users={appData.users}
                            onUpdate={(updates) => handleSubtaskUpdate(st, updates)}
                            onDelete={() => onDeleteSubtask(st.id as number)}
                        />
                    ))}
                    <div className="pt-2 flex space-x-2">
                        <TextInput
                            placeholder="Añadir nueva subtarea..."
                            value={newSubtaskName}
                            onChange={(e) => setNewSubtaskName(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddSubtask())}
                        />
                        <button onClick={handleAddSubtask} disabled={!newSubtaskName.trim()} className="px-4 py-2 bg-slate-600 text-slate-200 text-sm font-semibold rounded-md hover:bg-slate-500 disabled:opacity-50">Añadir</button>
                    </div>
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Comentarios">
                <div className="p-4 space-y-4">
                    <div className="flex space-x-3">
                        <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center text-sm font-bold text-slate-200 flex-shrink-0">{currentUser.name.charAt(0)}</div>
                        <div className="flex-grow">
                             <TextArea 
                                placeholder="Añade un comentario... Usa @ para mencionar a alguien."
                                value={newComment}
                                onChange={e => setNewComment(e.target.value)}
                                rows={3}
                            />
                            <div className="flex justify-end mt-2">
                                <button onClick={handleAddComment} disabled={!newComment.trim()} className="px-4 py-2 bg-cyan-500 text-slate-900 text-sm font-semibold rounded-md hover:bg-cyan-600 disabled:opacity-50">Comentar</button>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {commentsForTask.map(comment => {
                            const author = appData.users.find(u => u.id === comment.authorId);
                            return (
                                <div key={comment.id} className="flex space-x-3">
                                    <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center text-sm font-bold text-slate-200 flex-shrink-0">{author?.name.charAt(0)}</div>
                                    <div className="bg-slate-700/50 p-3 rounded-lg flex-grow">
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-sm text-slate-200">{author?.name}</span>
                                            <span className="text-xs text-slate-400">{new Date(comment.createdAt).toLocaleString()}</span>
                                        </div>
                                        <p className="text-sm text-slate-300 mt-1">{renderCommentText(comment.text)}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </CollapsibleSection>
            
            <CollapsibleSection title="Notas Privadas">
                <div className="p-4">
                    {typeof data.id === 'number' ? (
                        <NotesSection
                            notes={taskNotes}
                            onAddNote={handleAddNote}
                            onUpdateNote={onNoteUpdate}
                            onDeleteNote={onNoteDelete}
                        />
                    ) : (
                        <p className="text-slate-500 text-center py-4">Guarda la tarea para poder añadir notas.</p>
                    )}
                </div>
            </CollapsibleSection>

        </div>
        <div className="lg:col-span-1 space-y-4">
            <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                <FormField label="Estado" htmlFor="status">
                    <Select id="status" name="status" value={data.status} onChange={handleInputChange}>
                        {TASK_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </Select>
                </FormField>
                <FormField label="Prioridad" htmlFor="priority">
                    <Select id="priority" name="priority" value={data.priority} onChange={handleInputChange}>
                        {TASK_PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                    </Select>
                </FormField>
                <FormField label="Asignado a" htmlFor="assigneeId">
                    <Select id="assigneeId" name="assigneeId" value={data.assigneeId} onChange={handleInputChange}>
                        {appData.users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
                    </Select>
                </FormField>
                <FormField label="Fecha de Vencimiento" htmlFor="dueDate">
                    <TextInput type="date" id="dueDate" name="dueDate" value={data.dueDate || ''} onChange={handleInputChange} />
                </FormField>
            </div>
             <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                 <p className="text-sm text-slate-400"><strong>Creado por:</strong> {creator?.name}</p>
                 <p className="text-sm text-slate-400"><strong>Fecha Creación:</strong> {new Date(data.createdAt).toLocaleDateString()}</p>
                 <p className="text-sm text-slate-400"><strong>Última Actualización:</strong> {new Date(data.updatedAt).toLocaleString()}</p>
             </div>
             <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                <FormField label="Etiquetas" htmlFor="tags">
                    <KeywordManager keywords={data.tags || []} onChange={tags => setData(p => ({...p, tags}))} />
                </FormField>
            </div>
             <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                 <FormField label="Bloqueada por" helpText="Tareas que deben completarse antes que esta.">
                     <MultiSelect
                        options={appData.tasks.filter(t => t.id !== data.id && t.status !== 'Completada').map(t => ({ id: t.id as number, name: t.name }))}
                        selectedIds={data.isBlockedBy || []}
                        onSelectionChange={ids => setData(p => ({...p, isBlockedBy: ids as number[]}))}
                     />
                 </FormField>
             </div>
        </div>
      </div>
    </div>
  );
};
