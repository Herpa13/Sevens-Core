import React from 'react';
import type { ProductNotification, Product, Country, EntityType, Entity } from '../types';
interface ProductNotificationListViewProps {
    notifications: ProductNotification[];
    products: Product[];
    countries: Country[];
    onSelectItem: (entityType: EntityType, item: Entity) => void;
    onAddNew: (entityType: EntityType) => void;
}
export declare const ProductNotificationListView: React.FC<ProductNotificationListViewProps>;
export {};
