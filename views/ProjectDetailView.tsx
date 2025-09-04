import React, { FC, useCallback, useState, useEffect } from 'react';
import type { Proyecto, AppData, Entity, EntityType } from '../types';
import { TaskBoardDashboard } from '../dashboards/TaskBoardDashboard';
import { isEqual } from 'lodash-es';

interface ProjectDetailViewProps {
  initialData: Proyecto;
  onSave: (data: Proyecto) => void;
  onDelete: (id: number) => void;
  onCancel: () => void;
  appData: AppData;
  onTaskUpdate: (taskId: number, updates: Partial<AppData['tasks'][0]>) => void;
  onSelectItem: (entityType: EntityType, item: Entity) => void;
  setIsDirty: (isDirty: boolean) => void;
  setSaveHandler: (handler: ((onSuccess?: () => void) => void) | null) => void;
}

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({ initialData, onSave, onDelete, onCancel, appData, onTaskUpdate, onSelectItem, setIsDirty, setSaveHandler }) => {
  // For this view, we'll make it read-only for now, focusing on the Kanban board.
  // Editing project details (name, status) can be added later.
  const [data, setData] = useState(initialData);

  const handleSaveClick = useCallback((onSuccess?: () => void) => {
    onSave(data);
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


  const projectTasks = appData.tasks.filter(t => t.linkedEntity?.entityType === 'proyectos' && t.linkedEntity.entityId === initialData.id);
  const completedTasks = projectTasks.filter(t => t.status === 'Completada').length;
  const progress = projectTasks.length > 0 ? (completedTasks / projectTasks.length) * 100 : 0;
  
  const projectAppData: AppData = {
      ...appData,
      tasks: projectTasks,
  };

  return (
    <div className="bg-slate-800 rounded-lg h-full flex flex-col">
      <div className="p-4 sm:p-6 border-b border-slate-700 flex-shrink-0">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-slate-200">{initialData.name}</h2>
            <p className="text-sm text-slate-400">Gestionando las tareas del proyecto.</p>
          </div>
          <div className="flex space-x-2">
            <button onClick={onCancel} className="px-4 py-2 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500 font-semibold">
              Volver a Proyectos
            </button>
          </div>
        </div>
        <div className="mt-4">
            <div className="flex justify-between items-center text-sm text-slate-400 mb-1">
                <span>Progreso General</span>
                <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2.5">
                <div className="bg-cyan-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
        </div>
      </div>
      
      <div className="p-4 sm:p-6 flex-grow overflow-hidden">
        {/* We reuse the TaskBoardDashboard, passing a projectId to filter its tasks */}
        <TaskBoardDashboard
            appData={projectAppData}
            onSelectItem={onSelectItem} // Navigation is handled by the main app
            onAddNew={() => {}} // New tasks should be created globally for now
            currentUser={appData.users.find(u => u.role === 'Administrador')!} // Fake user for now
            onSaveSubtask={() => {}}
            onTaskUpdate={onTaskUpdate}
            onStartProject={() => {}}
            isProjectView={true} // A new prop to hide filters/buttons
        />
      </div>
    </div>
  );
};