import React from 'react';
import type { CompetitorBrand, CompetitorProduct, EntityType, Entity } from '../types';
interface CompetitorBrandListViewProps {
    brands: CompetitorBrand[];
    products: CompetitorProduct[];
    onSelectItem: (entityType: EntityType, item: Entity) => void;
    onAddNew: (entityType: EntityType) => void;
}
export declare const CompetitorBrandListView: React.FC<CompetitorBrandListViewProps>;
export {};
