import React from 'react';
import type { TaskSchema } from '../../types';
interface ApplySchemaModalProps {
    schemas: TaskSchema[];
    onApply: (schema: TaskSchema) => void;
    onClose: () => void;
    entityName: string;
}
export declare const ApplySchemaModal: React.FC<ApplySchemaModalProps>;
export {};
