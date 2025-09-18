import React from 'react';
import type { AppData } from '../../types';
interface ImportModalProps {
    appData: AppData;
    onClose: () => void;
    onImport: (templateId: number, file: File) => void;
}
export declare const ImportModal: React.FC<ImportModalProps>;
export {};
