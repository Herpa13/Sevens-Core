import React from 'react';
import type { PurchaseOrder, AppData, EntityType, Entity, Note } from '../types';
interface PurchaseOrderDetailViewProps {
    initialData: PurchaseOrder;
    onSave: (data: PurchaseOrder) => void;
    onDelete: (id: number | 'new') => void;
    onCancel: () => void;
    appData: AppData;
    onSelectItem: (entityType: EntityType, item: Entity) => void;
    setIsDirty: (isDirty: boolean) => void;
    setSaveHandler: (handler: ((onSuccess?: () => void) => void) | null) => void;
    onNoteAdd: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'authorName'>) => void;
    onNoteUpdate: (note: Note) => void;
    onNoteDelete: (noteId: number | 'new') => void;
}
export declare const PurchaseOrderDetailView: React.FC<PurchaseOrderDetailViewProps>;
export {};
