import React from 'react';
import type { AppData, EntityType, Entity } from '../types';
interface ManufacturingDashboardProps {
    appData: AppData;
    onSelectItem: (entityType: EntityType, item: Entity) => void;
    onAddNew: (entityType: EntityType) => void;
}
export declare const ManufacturingDashboard: React.FC<ManufacturingDashboardProps>;
export {};
