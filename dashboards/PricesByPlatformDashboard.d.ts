import React from 'react';
import type { AppData, Price } from '../types';
interface PricesByPlatformDashboardProps {
    appData: AppData;
    onSave: (updatedPrices: Price[]) => void;
    setIsDirty: (isDirty: boolean) => void;
    setSaveHandler: (handler: ((onSuccess?: () => void) => void) | null) => void;
}
export declare const PricesByPlatformDashboard: React.FC<PricesByPlatformDashboardProps>;
export {};
