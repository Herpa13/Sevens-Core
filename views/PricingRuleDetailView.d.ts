import React from 'react';
import type { PricingRule, AppData } from '../types';
interface PricingRuleDetailViewProps {
    initialData: PricingRule;
    onSave: (data: PricingRule) => void;
    onDelete: (id: number | 'new') => void;
    onCancel: () => void;
    appData: AppData;
    setIsDirty: (isDirty: boolean) => void;
    setSaveHandler: (handler: ((onSuccess?: () => void) => void) | null) => void;
}
export declare const PricingRuleDetailView: React.FC<PricingRuleDetailViewProps>;
export {};
