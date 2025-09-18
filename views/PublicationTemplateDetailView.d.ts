import React from 'react';
import type { ImportExportTemplate, AppData } from '../types';
interface PublicationTemplateDetailViewProps {
    initialData: ImportExportTemplate;
    onSave: (data: ImportExportTemplate) => void;
    onDelete: (id: number) => void;
    onCancel: () => void;
    appData: AppData;
    setIsDirty: (isDirty: boolean) => void;
    setSaveHandler: (handler: ((onSuccess?: () => void) => void) | null) => void;
}
export declare const PublicationTemplateDetailView: React.FC<PublicationTemplateDetailViewProps>;
export {};
