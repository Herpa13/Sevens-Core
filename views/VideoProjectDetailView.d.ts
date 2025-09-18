import React from 'react';
import type { VideoProject, AppData, Entity, EntityType, Note } from '../types';
interface VideoProjectDetailViewProps {
    initialData: VideoProject;
    onSave: (data: VideoProject) => void;
    onDelete: (id: number) => void;
    onCancel: () => void;
    appData: AppData;
    onSelectItem: (entityType: EntityType, item: Entity) => void;
    onEntitySave: (entityType: EntityType, data: Entity) => void;
    setIsDirty: (isDirty: boolean) => void;
    setSaveHandler: (handler: ((onSuccess?: () => void) => void) | null) => void;
    onNoteAdd: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'authorName'>) => void;
    onNoteUpdate: (note: Note) => void;
    onNoteDelete: (noteId: number | 'new') => void;
}
export declare const VideoProjectDetailView: React.FC<VideoProjectDetailViewProps>;
export {};
