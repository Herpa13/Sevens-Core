import React from 'react';
import type { AppData, Entity, EntityType } from '../types';
interface ProjectsDashboardProps {
    appData: AppData;
    onSelectItem: (entityType: EntityType, item: Entity) => void;
}
export declare const ProjectsDashboard: React.FC<ProjectsDashboardProps>;
export {};
