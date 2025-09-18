import { FC } from 'react';
import type { Product, AppData, Note, Entity, EntityType } from '../types';
interface ProductDetailViewProps {
    initialData: Product;
    onSave: (data: Product) => void;
    onDelete: (id: number | 'new') => void;
    onCancel: () => void;
    appData: AppData;
    onNoteAdd: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'authorName'>) => void;
    onNoteUpdate: (note: Note) => void;
    onNoteDelete: (noteId: number | 'new') => void;
    onSelectItem: (entityType: EntityType, item: Entity) => void;
    setIsDirty: (isDirty: boolean) => void;
    setSaveHandler: (handler: ((onSuccess?: () => void) => void) | null) => void;
    onDuplicateEtiqueta: (id: number | 'new') => void;
    sidebarCollapsed: boolean;
    isDirty: boolean;
}
export declare const ProductDetailView: FC<ProductDetailViewProps>;
export {};
