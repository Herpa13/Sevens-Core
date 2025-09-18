import React from 'react';
interface MultiSelectOption {
    id: number | string;
    name: string;
}
interface MultiSelectProps {
    options: MultiSelectOption[];
    selectedIds: (number | string)[] | null;
    onSelectionChange: (selectedIds: (number | string)[] | null) => void;
    placeholder?: string;
}
export declare const MultiSelect: React.FC<MultiSelectProps>;
export {};
