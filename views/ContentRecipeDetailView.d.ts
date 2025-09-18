import React from 'react';
import type { ContentRecipe } from '../types';
interface ContentRecipeDetailViewProps {
    initialData: ContentRecipe;
    onSave: (data: ContentRecipe) => void;
    onDelete: (id: number | 'new') => void;
    onCancel: () => void;
    setIsDirty: (isDirty: boolean) => void;
    setSaveHandler: (handler: ((onSuccess?: () => void) => void) | null) => void;
}
export declare const ContentRecipeDetailView: React.FC<ContentRecipeDetailViewProps>;
export {};
