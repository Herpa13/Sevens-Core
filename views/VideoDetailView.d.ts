import React from 'react';
import type { Video, AppData, EntityType, Entity } from '../types';
interface VideoDetailViewProps {
    initialData: Video;
    onSave: (data: Video) => void;
    onDelete: (id: number | 'new') => void;
    onCancel: () => void;
    appData: AppData;
    setIsDirty: (isDirty: boolean) => void;
    setSaveHandler: (handler: ((onSuccess?: () => void) => void) | null) => void;
    onSelectItem: (entityType: EntityType, item: Entity) => void;
}
export declare const VideoDetailView: React.FC<VideoDetailViewProps>;
export {};
