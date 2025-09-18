import React from 'react';
import type { ProductNotification, AppData } from '../types';
interface ProductNotificationDetailViewProps {
    initialData: ProductNotification;
    onSave: (data: ProductNotification) => void;
    onDelete: (id: number | 'new') => void;
    onCancel: () => void;
    appData: AppData;
    setIsDirty: (isDirty: boolean) => void;
    setSaveHandler: (handler: ((onSuccess?: () => void) => void) | null) => void;
}
export declare const ProductNotificationDetailView: React.FC<ProductNotificationDetailViewProps>;
export {};
