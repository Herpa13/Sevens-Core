import React from 'react';
import type { AmazonFlashDeal, AppData } from '../types';
interface AmazonFlashDealDetailViewProps {
    initialData: AmazonFlashDeal;
    onSave: (data: AmazonFlashDeal) => void;
    onDelete: (id: number | 'new') => void;
    onCancel: () => void;
    appData: AppData;
    setIsDirty: (isDirty: boolean) => void;
    setSaveHandler: (handler: ((onSuccess?: () => void) => void) | null) => void;
}
export declare const AmazonFlashDealDetailView: React.FC<AmazonFlashDealDetailViewProps>;
export {};
