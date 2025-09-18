import React from 'react';
import type { AppData } from '../../types';
interface ExportModalProps {
    appData: AppData;
    onClose: () => void;
    onExport: (templateId: number, selectedIds: number[]) => void;
}
export declare const ExportModal: React.FC<ExportModalProps>;
export {};
