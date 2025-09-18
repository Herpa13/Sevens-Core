import React from 'react';
import type { AppData, PromptTemplate } from '../../types';
interface SelectPromptTemplateModalProps {
    appData: AppData;
    category: PromptTemplate['category'];
    onClose: () => void;
    onSelect: (templateId: number) => void;
}
export declare const SelectPromptTemplateModal: React.FC<SelectPromptTemplateModalProps>;
export {};
