import { FC } from 'react';
import type { Etiqueta, AppData, KnowledgeBaseUsage, Entity, EntityType } from '../types';
interface EtiquetaDetailViewProps {
    initialData: Etiqueta;
    onSave: (data: Etiqueta) => void;
    onDelete: (id: number | 'new') => void;
    onCancel: () => void;
    appData: AppData;
    onSelectItem: (entityType: EntityType, item: Entity) => void;
    onUsageAdd: (usage: Omit<KnowledgeBaseUsage, 'id' | 'userId' | 'usedAt'>) => void;
    setIsDirty: (isDirty: boolean) => void;
    setSaveHandler: (handler: ((onSuccess?: () => void) => void) | null) => void;
    onDuplicate: (id: number | 'new') => void;
    onEntitySave: (entityType: EntityType, data: Entity) => void;
}
export declare const EtiquetaDetailView: FC<EtiquetaDetailViewProps>;
export {};
