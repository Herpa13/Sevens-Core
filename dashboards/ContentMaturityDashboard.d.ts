import React from 'react';
import { AppData, EntityType, Entity } from '../types';
interface ContentMaturityDashboardProps {
    appData: AppData;
    onSelectItem: (entityType: EntityType, item: Entity) => void;
}
export declare const ContentMaturityDashboard: React.FC<ContentMaturityDashboardProps>;
export {};
