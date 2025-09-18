import React from 'react';
import type { PromptTemplate, AppData } from '../types';
interface PromptTemplateDetailViewProps {
    initialData: PromptTemplate;
    onSave: (data: PromptTemplate) => void;
    onDelete: (id: number) => void;
    onCancel: () => void;
    appData: AppData;
    setIsDirty: (isDirty: boolean) => void;
    setSaveHandler: (handler: ((onSuccess?: () => void) => void) | null) => void;
}
export declare const PromptTemplateDetailView: React.FC<PromptTemplateDetailViewProps>;
export {};
