import React from 'react';
import type { TaskSchema, AppData } from '../types';
interface TaskSchemaDetailViewProps {
    initialData: TaskSchema;
    onSave: (data: TaskSchema) => void;
    onDelete: (id: number) => void;
    onCancel: () => void;
    appData: AppData;
    setIsDirty: (isDirty: boolean) => void;
    setSaveHandler: (handler: ((onSuccess?: () => void) => void) | null) => void;
}
export declare const TaskSchemaDetailView: React.FC<TaskSchemaDetailViewProps>;
export {};
