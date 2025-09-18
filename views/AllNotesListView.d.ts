import React from 'react';
import type { AppData, Note, Entity, EntityType } from '../types';
interface AllNotesListViewProps {
    appData: AppData;
    onSelectItem: (entityType: EntityType, item: Entity) => void;
    onNoteUpdate: (note: Note) => void;
}
export declare const AllNotesListView: React.FC<AllNotesListViewProps>;
export {};
