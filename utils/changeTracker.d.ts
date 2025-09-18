import type { ChangeDetail, AppData, Entity, EntityType } from '../types';
export declare const generateChangeDetails: (entityType: EntityType, oldEntity: Entity, newEntity: Entity, appData: AppData) => ChangeDetail[];
