import React from 'react';
import { Note } from '../../types';
interface NotesSectionProps {
    notes: Note[];
    onAddNote: (noteText: string, attachments: File[]) => void;
    onUpdateNote: (note: Note) => void;
    onDeleteNote: (noteId: number | 'new') => void;
}
export declare const NotesSection: React.FC<NotesSectionProps>;
export {};
