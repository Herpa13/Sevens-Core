import React from 'react';
import { LogEntry } from '../../types';
interface AuditLogDisplayProps {
    logs: LogEntry[];
    highlightedField?: string;
}
export declare const AuditLogDisplay: React.FC<AuditLogDisplayProps>;
export {};
