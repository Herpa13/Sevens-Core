import React from 'react';
import type { DeliveryNote, AppData } from '../types';
interface DeliveryNoteDetailViewProps {
    initialData: DeliveryNote;
    onSave: (data: DeliveryNote) => void;
    onDelete: (id: number | 'new') => void;
    onCancel: () => void;
    appData: AppData;
    setIsDirty: (isDirty: boolean) => void;
    setSaveHandler: (handler: ((onSuccess?: () => void) => void) | null) => void;
}
export declare const DeliveryNoteDetailView: React.FC<DeliveryNoteDetailViewProps>;
export {};
