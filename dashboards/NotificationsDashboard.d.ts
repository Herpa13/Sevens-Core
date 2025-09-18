import React from 'react';
import { ProductNotification, Product, Country } from '../types';
interface NotificationsDashboardProps {
    notifications: ProductNotification[];
    products: Product[];
    countries: Country[];
    onStatusChange: (productId: number, countryId: number, status: ProductNotification['status']) => void;
    onEditDetails: (notification: ProductNotification) => void;
}
export declare const NotificationsDashboard: React.FC<NotificationsDashboardProps>;
export {};
