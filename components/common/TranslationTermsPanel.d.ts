import React from 'react';
import type { AppData } from '../../types';
interface TranslationTermsPanelProps {
    appData: AppData;
    isOpen: boolean;
    onClose: () => void;
}
export declare const TranslationTermsPanel: React.FC<TranslationTermsPanelProps>;
export {};
