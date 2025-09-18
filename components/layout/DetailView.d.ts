import type { AppData, Entity, EntityType } from '../../types/index';
interface DetailViewProps<T extends Entity> {
    entityType: EntityType;
    items: T[];
    onSelectItem: (entityType: EntityType, item: T) => void;
    onAddNew: (entityType: EntityType) => void;
    onExecuteRule?: (id: number) => void;
    onDeleteItem?: (entityType: EntityType, id: number | 'new') => void;
    pricingJobLog?: string[] | null;
    isPricingJobDone?: boolean;
    onPricingJobClose?: () => void;
    appData: AppData;
}
export declare function DetailView<T extends Entity>({ entityType, items, onAddNew, onSelectItem, onExecuteRule, onDeleteItem, pricingJobLog, isPricingJobDone, onPricingJobClose, appData }: DetailViewProps<T>): any;
export {};
