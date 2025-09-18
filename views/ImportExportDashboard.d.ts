import React from 'react';
import type { AppData } from '../types';
interface ImportExportDashboardProps {
    appData: AppData;
    onNewExport: () => void;
    onNewImport: () => void;
    onUndoImport: (jobId: number) => void;
    onManageTemplates: () => void;
}
export declare const ImportExportDashboard: React.FC<ImportExportDashboardProps>;
export {};
