import React from 'react';
import { AppData } from '../../types';
interface FormulaEditorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (formula: string) => void;
    initialValue: string;
    appData: AppData;
}
export declare const FormulaEditorModal: React.FC<FormulaEditorModalProps>;
export {};
