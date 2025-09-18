import React from 'react';
import type { Proyecto, AppData, Entity, EntityType } from '../types';
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
export declare const ProjectDetailView: React.FC<ProjectDetailViewProps>;
export {};
