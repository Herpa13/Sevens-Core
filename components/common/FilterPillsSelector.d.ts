import React from 'react';
interface FilterPillsSelectorOption {
    id: number | string;
    name: string;
}
interface FilterPillsSelectorProps {
    options: FilterPillsSelectorOption[];
    selectedIds: (number | string)[] | null;
    onSelectionChange: (selectedIds: (number | string)[] | null) => void;
    placeholder?: string;
}
export declare const FilterPillsSelector: React.FC<FilterPillsSelectorProps>;
export {};
