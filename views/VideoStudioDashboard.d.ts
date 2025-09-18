import React from 'react';
import type { AppData, VideoProject, Entity, EntityType } from '../types';
interface VideoStudioDashboardProps {
    appData: AppData;
    onSelectItem: (entityType: EntityType, item: Entity) => void;
    onSaveProject: (entityType: 'videoProjects', data: VideoProject) => void;
}
export declare const VideoStudioDashboard: React.FC<VideoStudioDashboardProps>;
export {};
