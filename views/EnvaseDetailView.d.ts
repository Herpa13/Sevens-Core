import React from 'react';
import type { Envase, Note, AppData } from '../types';
interface EnvaseDetailViewProps {
    initialData: Envase;
    onSave: (data: Envase) => void;
    onDelete: (id: number | 'new') => void;
    onCancel: () => void;
    setIsDirty: (isDirty: boolean) => void;
    setSaveHandler: (handler: ((onSuccess?: () => void) => void) | null) => void;
    appData: AppData;
    onNoteAdd: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'authorName'>) => void;
    onNoteUpdate: (note: Note) => void;
    onNoteDelete: (noteId: number | 'new') => void;
}
export declare const EnvaseDetailView: React.FC<EnvaseDetailViewProps>;
export {};
