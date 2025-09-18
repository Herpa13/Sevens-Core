import React from 'react';
import type { User } from '../types';
interface UserDetailViewProps {
    initialData: User;
    onSave: (data: User) => void;
    onDelete: (id: number | 'new') => void;
    onCancel: () => void;
    currentUser: User;
    setIsDirty: (isDirty: boolean) => void;
    setSaveHandler: (handler: ((onSuccess?: () => void) => void) | null) => void;
}
export declare const UserDetailView: React.FC<UserDetailViewProps>;
export {};
