import { FC } from 'react';
import type { AppData, KnowledgeBaseEntry, Entity, EntityType, Note } from '../types';
interface KnowledgeBaseEntryDetailViewProps {
    initialData: KnowledgeBaseEntry;
    onSave: (data: KnowledgeBaseEntry) => void;
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
export declare const KnowledgeBaseEntryDetailView: FC<KnowledgeBaseEntryDetailViewProps>;
export {};
