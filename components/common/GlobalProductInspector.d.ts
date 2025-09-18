import React from 'react';
import type { AppData } from '../../types';
interface GlobalProductInspectorProps {
    appData: AppData;
    isOpen: boolean;
    onClose: () => void;
}
export declare const GlobalProductInspector: React.FC<GlobalProductInspectorProps>;
export {};
