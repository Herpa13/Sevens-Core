import React from 'react';
import type { SequenceTemplate } from '../types';
interface SequenceTemplateDetailViewProps {
    initialData: SequenceTemplate;
    onSave: (data: SequenceTemplate) => void;
    onDelete: (id: number) => void;
    onCancel: () => void;
    onNavigate: (view: any) => void;
    setIsDirty: (isDirty: boolean) => void;
    setSaveHandler: (handler: ((onSuccess?: () => void) => void) | null) => void;
}
export declare const SequenceTemplateDetailView: React.FC<SequenceTemplateDetailViewProps>;
export {};
