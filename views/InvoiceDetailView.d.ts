import React from 'react';
import type { Invoice, AppData } from '../types';
interface InvoiceDetailViewProps {
    initialData: Invoice;
    onSave: (data: Invoice) => void;
    onDelete: (id: number | 'new') => void;
    onCancel: () => void;
    appData: AppData;
    setIsDirty: (isDirty: boolean) => void;
    setSaveHandler: (handler: ((onSuccess?: () => void) => void) | null) => void;
}
export declare const InvoiceDetailView: React.FC<InvoiceDetailViewProps>;
export {};
