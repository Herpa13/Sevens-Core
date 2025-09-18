import React, { ReactNode } from 'react';
interface CollapsibleSectionProps {
    title: ReactNode;
    children: ReactNode;
    defaultOpen?: boolean;
    isOpen?: boolean;
    onToggle?: () => void;
    id?: string;
    className?: string;
}
export declare const CollapsibleSection: React.FC<CollapsibleSectionProps>;
export {};
