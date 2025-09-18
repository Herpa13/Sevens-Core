import React from 'react';
import type { Batch, AppData, TaskSchema, EntityType, Entity, Note } from '../types';
interface BatchDetailViewProps {
    initialData: Batch;
    onSave: (data: Batch) => void;
    onDelete: (id: number | 'new') => void;
    onCancel: () => void;
    appData: AppData;
    onApplySchema: (schema: TaskSchema, linkedEntity: {
        id: number;
        type: 'batches';
        name: string;
    }) => void;
    onSelectItem: (entityType: EntityType, item: Entity) => void;
    setIsDirty: (isDirty: boolean) => void;
    setSaveHandler: (handler: ((onSuccess?: () => void) => void) | null) => void;
    onNoteAdd: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'authorName'>) => void;
    onNoteUpdate: (note: Note) => void;
    onNoteDelete: (noteId: number | 'new') => void;
}
export declare const BatchDetailView: React.FC<BatchDetailViewProps>;
export {};
