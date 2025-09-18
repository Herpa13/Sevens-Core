import React from 'react';
import type { Platform, AppData, Note } from '../types';
interface PlatformDetailViewProps {
    initialData: Platform;
    onSave: (data: Platform) => void;
    onDelete: (id: number | 'new') => void;
    onCancel: () => void;
    appData: AppData;
    onNoteAdd: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'authorName'>) => void;
    onNoteUpdate: (note: Note) => void;
    onNoteDelete: (noteId: number | 'new') => void;
    setIsDirty: (isDirty: boolean) => void;
    setSaveHandler: (handler: ((onSuccess?: () => void) => void) | null) => void;
}
export declare const PlatformDetailView: React.FC<PlatformDetailViewProps>;
export {};
