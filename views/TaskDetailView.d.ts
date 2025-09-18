import React from 'react';
import type { Task, TaskComment, AppData, User, Subtask, Note } from '../types';
interface TaskDetailViewProps {
    initialData: Task;
    onSave: (data: Task) => void;
    onDelete: (id: number | 'new') => void;
    onCancel: () => void;
    appData: AppData;
    currentUser: User;
    onCommentAdd: (comment: Omit<TaskComment, 'id' | 'createdAt'>) => void;
    onSaveSubtask: (subtask: Subtask) => void;
    onDeleteSubtask: (subtaskId: number) => void;
    setIsDirty: (isDirty: boolean) => void;
    setSaveHandler: (handler: ((onSuccess?: () => void) => void) | null) => void;
    onNoteAdd: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'authorName'>) => void;
    onNoteUpdate: (note: Note) => void;
    onNoteDelete: (noteId: number | 'new') => void;
}
export declare const TaskDetailView: React.FC<TaskDetailViewProps>;
export {};
