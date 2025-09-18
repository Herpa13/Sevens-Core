import React from 'react';
import type { AppData } from '../../types';
interface GlobalTranslationPanelProps {
    appData: AppData;
    isOpen: boolean;
    onClose: () => void;
}
export declare const GlobalTranslationPanel: React.FC<GlobalTranslationPanelProps>;
export {};
