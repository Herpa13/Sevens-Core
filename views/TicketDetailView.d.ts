import React from 'react';
import type { CustomerSupportTicket } from '../types';
interface TicketDetailViewProps {
    initialData: CustomerSupportTicket;
    onSave: (data: CustomerSupportTicket) => void;
    onDelete: (id: number | 'new') => void;
    onCancel: () => void;
    setIsDirty: (isDirty: boolean) => void;
    setSaveHandler: (handler: ((onSuccess?: () => void) => void) | null) => void;
}
export declare const TicketDetailView: React.FC<TicketDetailViewProps>;
export {};
