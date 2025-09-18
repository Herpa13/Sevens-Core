import { FC } from 'react';
import type { AppData, User, EntityType, Entity } from '../../types/index';
type DashboardType = 'notifications' | 'contentMaturity' | 'importExport' | 'pvprMatrix' | 'tasks' | 'proyectos' | 'videoStudio' | 'pricesByPlatform' | 'priceHistoryLogs' | 'pricingDashboard' | 'amazonFlashDeals' | 'reports';
type SpecialViewType = 'aiSettings';
interface SidebarProps {
    appData: AppData;
    setActiveView: (view: {
        type: 'list';
        entityType: EntityType;
    } | {
        type: 'dashboard';
        entityType: DashboardType;
    } | {
        type: 'aiSettings';
    } | {
        type: 'detail';
        entityType: EntityType;
        entity: Entity;
    }) => void;
    activeEntityType?: EntityType | DashboardType | SpecialViewType;
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
    currentUser: User | null;
    onLogout: () => void;
    onBackupData: () => void;
    onSelectItem: (entityType: EntityType, item: Entity) => void;
}
export declare const Sidebar: FC<SidebarProps>;
export {};
