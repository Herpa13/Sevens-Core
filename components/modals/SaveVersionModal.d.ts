import React from 'react';
interface SaveVersionModalProps {
    onClose: () => void;
    onConfirm: (reason: string) => void;
}
export declare const SaveVersionModal: React.FC<SaveVersionModalProps>;
export {};
