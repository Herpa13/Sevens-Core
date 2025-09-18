import React from 'react';
import type { Country, Note, AppData } from '../types';
interface CountryDetailViewProps {
    initialData: Country;
    onSave: (data: Country) => void;
    onDelete: (id: number | 'new') => void;
    onCancel: () => void;
    setIsDirty: (isDirty: boolean) => void;
    setSaveHandler: (handler: ((onSuccess?: () => void) => void) | null) => void;
    appData: AppData;
    onNoteAdd: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'authorName'>) => void;
    onNoteUpdate: (note: Note) => void;
    onNoteDelete: (noteId: number | 'new') => void;
}
export declare const CountryDetailView: React.FC<CountryDetailViewProps>;
export {};
