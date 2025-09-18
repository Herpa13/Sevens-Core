import React from 'react';
import type { TranslationTerm } from '../types';
interface TranslationTermDetailViewProps {
    initialData: TranslationTerm;
    onSave: (data: TranslationTerm) => void;
    onDelete: (id: number | 'new') => void;
    onCancel: () => void;
    setIsDirty: (isDirty: boolean) => void;
    setSaveHandler: (handler: ((onSuccess?: () => void) => void) | null) => void;
}
export declare const TranslationTermDetailView: React.FC<TranslationTermDetailViewProps>;
export {};
