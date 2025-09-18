import React from 'react';
import type { AISettings } from '../types';
interface AISettingsViewProps {
    initialData: AISettings;
    onSave: (data: AISettings) => void;
    onCancel: () => void;
}
export declare const AISettingsView: React.FC<AISettingsViewProps>;
export {};
