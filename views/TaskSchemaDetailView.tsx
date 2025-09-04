import React, { useState, FC, useRef, useCallback, useEffect } from 'react';
import type { TaskSchema, AppData, TemplateTask } from '../types';
import { FormField } from '../components/common/FormField';
import { TextInput } from '../components/common/TextInput';
import { TextArea } from '../components/common/TextArea';
import { Select } from '../components/common/Select';
import { Icon } from '../components/common/Icon';
import { CollapsibleSection } from '../components/common/CollapsibleSection';
import { isEqual } from 'lodash-es';

interface TaskSchemaDetailViewProps {
  initialData: TaskSchema;
  onSave: (data: TaskSchema) => void;
  onDelete: (id: number) => void;
  onCancel: () => void;
  appData: AppData;
  setIsDirty: (isDirty: boolean) => void;
  setSaveHandler: (handler: ((onSuccess?: () => void) => void) | null) => void;
}

const ENTITY_OPTIONS: { value: keyof AppData | 'none', label: string }[] = [
    { value: 'none', label: 'Proyecto Independiente' },
    { value: 'batches', label: 'Lotes' },
    { value: 'products', label: 'Productos' },
    { value: 'purchaseOrders', label: 'Pedidos de Fabricación' },
    { value: 'etiquetas', label: 'Etiquetas' },
];

interface TemplateTaskEditorHandle {
    scrollIntoView: (options: ScrollIntoViewOptions) => void;
}

const TemplateTaskEditor: React.ForwardRefRenderFunction<TemplateTaskEditorHandle, {
    task: TemplateTask;
    index: number;
    onUpdate: (index: number, updatedTask: TemplateTask) => void;
    onRemove: (index: number) => void;
    appData: AppData;
}> = ({ task, index, onUpdate, onRemove, appData }, ref) => {
    
    const [newSubtaskName, setNewSubtaskName] = useState('');
    const titleInputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    React.useImperativeHandle(ref, () => ({
        scrollIntoView: (options: ScrollIntoViewOptions) => {
             containerRef.current?.scrollIntoView(options);
             setTimeout(() => titleInputRef.current?.focus(), 100); // Delay focus slightly
        }
    }));


    const handleTaskChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'number' ? Number(value) : value;
        onUpdate(index, { ...task, [name]: val });
    };

    const handleAddSubtask = () => {
        if (newSubtaskName.trim()) {
            const newSubtasks = [...(task.templateSubtasks || []), newSubtaskName.trim()];
            onUpdate(index, { ...task, templateSubtasks: newSubtasks });
            setNewSubtaskName('');
        }
    };
    
    const handleRemoveSubtask = (subtaskIndex: number) => {
        const newSubtasks = (task.templateSubtasks || []).filter((_, i) => i !== subtaskIndex);
        onUpdate(index, { ...task, templateSubtasks: newSubtasks });
    };

    return (
        <div ref={containerRef} className="bg-slate-700/50 p-4 rounded-lg border border-slate-600 scroll-mt-6">
            <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-slate-200">Tarea Plantilla #{index + 1}</h4>
                <button onClick={() => onRemove(index)} className="text-red-400 hover:text-red-300">
                    <Icon name="trash" />
                </button>
            </div>
            <div className="space-y-4">
                <FormField label="Título de la Tarea" helpText="Puedes usar placeholders como {batch.batchNumber} o {product.name}">
                    <TextInput ref={titleInputRef} name="title" value={task.title} onChange={handleTaskChange} />
                </FormField>
                <FormField label="Descripción">
                    <TextArea name="description" value={task.description} onChange={handleTaskChange} rows={3}/>
                </FormField>
                <div className="grid grid-cols-2 gap-4">
                    <FormField label="Asignado por Defecto">
                        <Select name="defaultAssigneeId" value={task.defaultAssigneeId || ''} onChange={handleTaskChange}>
                            <option value="">Sin asignar por defecto</option>
                            {appData.users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
                        </Select>
                    </FormField>
                    <FormField label="Plazo (días desde creación)">
                        <TextInput type="number" name="dueDaysOffset" value={task.dueDaysOffset} onChange={handleTaskChange} />
                    </FormField>
                </div>
                <FormField label="Checklist de Subtareas Predefinidas">
                    <div className="space-y-2">
                        {(task.templateSubtasks || []).map((st, stIndex) => (
                            <div key={stIndex} className="flex items-center space-x-2 bg-slate-800/50 p-1.5 rounded-md">
                                <Icon name="check-square" className="text-slate-500" />
                                <span className="text-sm flex-grow text-slate-300">{st}</span>
                                <button onClick={() => handleRemoveSubtask(stIndex)} className="text-red-500 opacity-50 hover:opacity-100">
                                    <Icon name="times" />
                                </button>
                            </div>
                        ))}
                    </div>
                     <div className="mt-2 flex space-x-2">
                        <TextInput 
                            placeholder="Añadir nueva subtarea a la plantilla..."
                            value={newSubtaskName}
                            onChange={e => setNewSubtaskName(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddSubtask())}
                        />
                        <button onClick={handleAddSubtask} disabled={!newSubtaskName.trim()} className="px-4 py-2 bg-slate-600 text-slate-200 text-sm font-semibold rounded-md hover:bg-slate-500 disabled:opacity-50">
                            Añadir
                        </button>
                    </div>
                </FormField>
            </div>
        </div>
    );
};
const ForwardedTemplateTaskEditor = React.forwardRef(TemplateTaskEditor);


const SchemaSummary: FC<{ schema: TaskSchema, onTaskClick: (index: number) => void }> = ({ schema, onTaskClick }) => {
    return (
        <div className="sticky top-6 bg-slate-700/50 p-4 rounded-lg border border-slate-600">
            <h3 className="text-lg font-bold text-slate-200 mb-2">{schema.name || 'Nuevo Esquema'}</h3>
            <p className="text-sm text-slate-400 mb-4">{schema.description || 'Añade una descripción...'}</p>
            <h4 className="font-semibold text-slate-300 border-t border-slate-600 pt-3">Secuencia de Tareas ({schema.templateTasks.length})</h4>
            <ul className="mt-2 space-y-1 max-h-80 overflow-y-auto">
                {schema.templateTasks.map((task, index) => (
                    <li key={index} onClick={() => onTaskClick(index)} className="p-1.5 rounded-md hover:bg-slate-700 cursor-pointer">
                        <div className="flex items-start">
                            <Icon name="arrow-right" className="text-slate-500 mr-2 mt-1"/>
                            <div className="flex-grow">
                                <p className="text-sm text-cyan-400 truncate">{task.title || `Tarea #${index + 1}`}</p>
                                <p className="text-xs text-slate-400">Plazo: +{task.dueDaysOffset}d</p>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export const TaskSchemaDetailView: React.FC<TaskSchemaDetailViewProps> = ({ initialData, onSave, onDelete, onCancel, appData, setIsDirty, setSaveHandler }) => {
  const [data, setData] = useState<TaskSchema>(initialData);
  const taskEditorRefs = useRef<(TemplateTaskEditorHandle | null)[]>([]);

  const handleSaveClick = useCallback((onSuccess?: () => void) => {
    onSave(data);
    if (onSuccess) onSuccess();
  }, [data, onSave]);

  useEffect(() => {
    setData(initialData);
    taskEditorRefs.current = taskEditorRefs.current.slice(0, initialData.templateTasks.length);
  }, [initialData]);

  useEffect(() => {
    setIsDirty(!isEqual(initialData, data));
  }, [data, initialData, setIsDirty]);

  useEffect(() => {
    setSaveHandler(handleSaveClick);
    return () => setSaveHandler(null);
  }, [handleSaveClick, setSaveHandler]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleTemplateTaskUpdate = (index: number, updatedTask: TemplateTask) => {
      setData(prev => ({
          ...prev,
          templateTasks: prev.templateTasks.map((t, i) => i === index ? updatedTask : t)
      }));
  };

  const handleAddTask = () => {
    const newTask: TemplateTask = {
        title: '',
        description: '',
        defaultAssigneeId: appData.users[0]?.id as number,
        dueDaysOffset: 1,
    };
    setData(prev => ({...prev, templateTasks: [...prev.templateTasks, newTask]}));
    setTimeout(() => {
        taskEditorRefs.current[data.templateTasks.length]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };
  
  const handleRemoveTask = (index: number) => {
      setData(prev => ({
          ...prev,
          templateTasks: prev.templateTasks.filter((_, i) => i !== index)
      }));
  };

  const handleDeleteClick = () => (typeof data.id === 'number' ? onDelete(data.id) : undefined);
  
  const handleScrollToTask = (index: number) => {
      taskEditorRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleTriggerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    // This logic is simplified based on the UI.
    // Selecting 'none' implies a manual trigger.
    // Selecting an entity implies an entity_creation trigger.
    // The UI does not currently support 'entity_status_change'.
    const newEntityType = value === 'none' ? undefined : (value as TaskSchema['trigger']['entityType']);
    const newTriggerType = value === 'none' ? 'manual' : 'entity_creation';

    setData(prev => ({
        ...prev,
        trigger: {
            ...prev.trigger,
            type: newTriggerType,
            entityType: newEntityType
        }
    }));
};


  return (
    <div className="bg-slate-800 rounded-lg">
       <div className="p-4 sm:p-6 border-b border-slate-700 flex justify-between items-center">
         <h2 className="text-2xl font-bold text-slate-200">{data.id === 'new' ? 'Nuevo Esquema de Trabajo' : `Editando Esquema: ${initialData.name}`}</h2>
          <div className="flex space-x-2">
            {data.id !== 'new' && <button onClick={handleDeleteClick} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 font-semibold">Eliminar</button>}
            <button onClick={onCancel} className="px-4 py-2 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500 font-semibold">Cancelar</button>
            <button onClick={() => handleSaveClick()} className="px-4 py-2 bg-cyan-500 text-slate-900 rounded-md hover:bg-cyan-600 font-semibold">Guardar Esquema</button>
        </div>
      </div>
      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
            <CollapsibleSection title="Información del Esquema" defaultOpen>
                <div className="p-4 space-y-4">
                    <FormField label="Nombre del Esquema" htmlFor="name">
                        <TextInput id="name" name="name" value={data.name} onChange={handleInputChange} />
                    </FormField>
                    <FormField label="Descripción" htmlFor="description">
                        <TextArea id="description" name="description" value={data.description} onChange={handleInputChange} rows={3}/>
                    </FormField>
                    <FormField label="Se activa desde" htmlFor="triggerEntityType" helpText="Determina desde qué tipo de entidad se puede lanzar este flujo de trabajo.">
{/* Fix: Property 'triggerEntityType' does not exist on type 'TaskSchema'. Updated value and onChange to use the nested trigger object. */}
                        <Select id="triggerEntityType" name="entityType" value={data.trigger.entityType || 'none'} onChange={handleTriggerChange}>
                            {ENTITY_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </Select>
                    </FormField>
                </div>
            </CollapsibleSection>
            
            <h3 className="text-lg font-bold text-slate-200 mt-4">Constructor de Tareas</h3>
            <div className="space-y-4">
                {data.templateTasks.map((task, index) => (
                    <ForwardedTemplateTaskEditor 
                        key={index}
                        // FIX: Ensure ref callback function returns void.
                        ref={el => { taskEditorRefs.current[index] = el; }}
                        task={task} 
                        index={index} 
                        onUpdate={handleTemplateTaskUpdate} 
                        onRemove={handleRemoveTask} 
                        appData={appData}
                    />
                ))}
            </div>
            <button onClick={handleAddTask} className="mt-4 w-full px-4 py-2 text-sm border border-dashed border-slate-600 text-slate-300 rounded-md hover:bg-slate-700">
                <Icon name="plus" className="mr-2"/> Añadir Tarea al Flujo
            </button>
        </div>
        <div className="lg:col-span-1">
           <SchemaSummary schema={data} onTaskClick={handleScrollToTask} />
        </div>
      </div>
    </div>
  );
};