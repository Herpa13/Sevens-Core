import React from 'react';
import type { ChangeDetail } from '../../types';
export interface ImportError {
    rowNumber: number;
    message: string;
    rowContent: Record<string, any>;
}
export interface UpdatePreview {
    oldData: any;
    newData: any;
    changes: ChangeDetail[];
}
export interface ImportPreviewState {
    creations: any[];
    updates: UpdatePreview[];
    errors: ImportError[];
    templateId: number;
}
interface ImportPreviewModalProps {
    previewState: ImportPreviewState;
    onClose: () => void;
    onConfirm: (previewState: ImportPreviewState) => void;
}
export declare const ImportPreviewModal: React.FC<ImportPreviewModalProps>;
export {};
