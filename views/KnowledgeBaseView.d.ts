import { FC } from 'react';
import type { AppData, Entity, EntityType } from '../types';
interface KnowledgeBaseViewProps {
    appData: AppData;
    onSelectItem: (entityType: EntityType, item: Entity) => void;
    onAddNew: (entityType: EntityType) => void;
}
export declare const KnowledgeBaseView: FC<KnowledgeBaseViewProps>;
export {};
