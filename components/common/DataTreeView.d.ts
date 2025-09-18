import React from 'react';
interface DataTreeViewProps {
    data: object;
    onSelect: (path: string) => void;
    title: string;
}
export declare const DataTreeView: React.FC<DataTreeViewProps>;
export {};
