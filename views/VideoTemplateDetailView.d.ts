import React from 'react';
import type { VideoCompositionTemplate, AppData } from '../types';
interface VideoCompositionTemplateDetailViewProps {
    initialData: VideoCompositionTemplate;
    onSave: (data: VideoCompositionTemplate) => void;
    onDelete: (id: number) => void;
    onCancel: () => void;
    appData: AppData;
    setIsDirty: (isDirty: boolean) => void;
    setSaveHandler: (handler: ((onSuccess?: () => void) => void) | null) => void;
}
export declare const VideoCompositionTemplateDetailView: React.FC<VideoCompositionTemplateDetailViewProps>;
export {};
