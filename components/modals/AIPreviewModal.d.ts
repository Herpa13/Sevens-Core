import React from 'react';
import type { AppData, PromptTemplate } from '../../types';
interface AIPreviewModalProps {
    template: PromptTemplate;
    context: object;
    appData: AppData;
    onClose: () => void;
    onConfirm: () => void;
    isLoading: boolean;
}
export declare const AIPreviewModal: React.FC<AIPreviewModalProps>;
export {};
