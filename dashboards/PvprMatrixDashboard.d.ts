import React from 'react';
import type { AppData, Pvpr } from '../types';
interface PvprMatrixDashboardProps {
    appData: AppData;
    onSave: (updatedPvprs: Pvpr[]) => void;
    setIsDirty: (isDirty: boolean) => void;
    setSaveHandler: (handler: ((onSuccess?: () => void) => void) | null) => void;
}
export declare const PvprMatrixDashboard: React.FC<PvprMatrixDashboardProps>;
export {};
