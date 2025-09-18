import React from 'react';
import type { AppData } from '../../types';
interface CreateProjectFromTemplateModalProps {
    appData: AppData;
    onClose: () => void;
    onCreate: (compositionTemplateId: number | undefined, productId: number | undefined, projectName: string) => void;
    initialBlank?: boolean;
}
export declare const CreateProjectFromTemplateModal: React.FC<CreateProjectFromTemplateModalProps>;
export {};
