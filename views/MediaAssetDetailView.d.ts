import React from 'react';
import type { MediaAsset, AppData, Entity, EntityType } from '../types';
interface MediaAssetDetailViewProps {
    initialData: MediaAsset;
    onSave: (data: MediaAsset) => void;
    onDelete: (id: number | 'new') => void;
    onCancel: () => void;
    appData: AppData;
    onSelectItem: (entityType: EntityType, item: Entity) => void;
    setIsDirty: (isDirty: boolean) => void;
    setSaveHandler: (handler: ((onSuccess?: () => void) => void) | null) => void;
}
export declare const MediaAssetDetailView: React.FC<MediaAssetDetailViewProps>;
export {};
