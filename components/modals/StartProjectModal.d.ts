import React from 'react';
import type { TaskSchema } from '../../types';
interface StartProjectModalProps {
    schemas: TaskSchema[];
    onStart: (schema: TaskSchema, initialContext: Record<string, string>) => void;
    onClose: () => void;
}
export declare const StartProjectModal: React.FC<StartProjectModalProps>;
export {};
