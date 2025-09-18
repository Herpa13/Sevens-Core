import React from 'react';
import type { AppData, Entity, EntityType } from '../types';
interface EtiquetaListViewProps {
    appData: AppData;
    onSelectItem: (entityType: EntityType, item: Entity) => void;
    onAddNew: (entityType: EntityType) => void;
}
export declare const EtiquetaListView: React.FC<EtiquetaListViewProps>;
export {};
