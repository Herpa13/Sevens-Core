import React from 'react';
import type { AppData, Entity, EntityType } from '../types';
interface AmazonFlashDealDashboardProps {
    appData: AppData;
    onSelectItem: (entityType: EntityType, item: Entity) => void;
    onAddNew: (entityType: EntityType) => void;
}
export declare const AmazonFlashDealDashboard: React.FC<AmazonFlashDealDashboardProps>;
export {};
