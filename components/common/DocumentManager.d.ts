import React from 'react';
import type { DocumentAttachment } from '../../types';
interface DocumentManagerProps {
    documents: DocumentAttachment[];
    onDocumentsChange: (documents: DocumentAttachment[]) => void;
    title?: string;
}
export declare const DocumentManager: React.FC<DocumentManagerProps>;
export {};
