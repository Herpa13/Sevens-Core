import React from 'react';
import type { Ingredient, AppData, Note } from '../types';
interface IngredientDetailViewProps {
    initialData: Ingredient;
    onSave: (data: Ingredient) => void;
    onDelete: (id: number | 'new') => void;
    onCancel: () => void;
    appData: AppData;
    setIsDirty: (isDirty: boolean) => void;
    setSaveHandler: (handler: ((onSuccess?: () => void) => void) | null) => void;
    onNoteAdd: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'authorName'>) => void;
    onNoteUpdate: (note: Note) => void;
    onNoteDelete: (noteId: number | 'new') => void;
}
export declare const IngredientDetailView: React.FC<IngredientDetailViewProps>;
export {};
