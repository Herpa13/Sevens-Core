import React from 'react';
import type { AppData, Task, User, Subtask, TaskSchema, EntityType, Entity } from '../types';
interface TaskBoardDashboardProps {
    appData: AppData;
    onSelectItem: (entityType: EntityType, item: Entity) => void;
    onAddNew: (entityType: EntityType) => void;
    currentUser: User;
    onSaveSubtask: (subtask: Subtask) => void;
    onStartProject: (schema: TaskSchema, initialContext: Record<string, string>) => void;
    onTaskUpdate?: (taskId: number, updates: Partial<Task>) => void;
    isProjectView?: boolean;
}
export declare const TaskBoardDashboard: React.FC<TaskBoardDashboardProps>;
export {};
