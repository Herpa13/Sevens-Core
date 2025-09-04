
import React, { useState, useMemo } from 'react';
import { Icon } from './Icon';
import { TextInput } from './TextInput';

interface DataTreeViewProps {
  data: object;
  onSelect: (path: string) => void;
  title: string;
}

const isObject = (value: any): value is object => value !== null && typeof value === 'object';

const getDataType = (value: any): string => {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    return typeof value;
}

const filterData = (data: any, searchTerm: string): any => {
    if (!searchTerm) {
        return data;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    
    const filterNode = (node: any): any => {
        if (Array.isArray(node)) {
            const filteredArray = node.map(item => filterNode(item)).filter(item => item !== null);
            return filteredArray.length > 0 ? filteredArray : null;
        }

        if (isObject(node)) {
            const filteredEntries = Object.entries(node).reduce((acc, [key, value]) => {
                const keyMatch = key.toLowerCase().includes(lowerCaseSearchTerm);
                
                if (isObject(value)) {
                    const filteredChild = filterNode(value);
                    if (filteredChild !== null || keyMatch) {
                        acc[key] = filteredChild !== null ? filteredChild : value; // Show full object if key matches
                    }
                } else {
                    const valueMatch = String(value).toLowerCase().includes(lowerCaseSearchTerm);
                    if (keyMatch || valueMatch) {
                        acc[key] = value;
                    }
                }
                return acc;
            }, {} as Record<string, any>);
            
            return Object.keys(filteredEntries).length > 0 ? filteredEntries : null;
        }
        return null;
    }
    
    return filterNode(data) || {};
}


const TreeItem: React.FC<{
    dataKey: string;
    value: any;
    path: string;
    onSelect: (path: string) => void;
}> = ({ dataKey, value, path, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const fullPath = path ? `${path}.${dataKey}` : dataKey;
    
    const isExpandable = isObject(value);
    const dataType = getDataType(value);

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(prev => !prev);
    };

    const handleSelect = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isExpandable) {
            onSelect(`{${fullPath}}`);
        } else {
             setIsOpen(prev => !prev);
        }
    };

    return (
        <div className="text-sm">
            <div 
                onClick={handleSelect}
                className="flex items-start p-1 rounded-md hover:bg-slate-700 cursor-pointer"
                title={isExpandable ? `Click to expand/collapse` : `Click to insert {${fullPath}}`}
            >
                {isExpandable ? (
                    <Icon name={isOpen ? 'chevron-down' : 'chevron-right'} className="w-4 mr-1 mt-1 flex-shrink-0 transition-transform" onClick={handleToggle} />
                ) : (
                    <div className="w-4 mr-1 flex-shrink-0"></div>
                )}
                <div className="flex-grow">
                    <span className="font-semibold text-slate-300">{dataKey}</span>
                    {!isExpandable && (
                        <span className="text-slate-500 ml-2">: 
                            <span className="text-cyan-400 ml-1" title={String(value)}>{String(value).length > 40 ? `${String(value).substring(0, 40)}...` : String(value)}</span>
                        </span>
                    )}
                </div>
                 <span className="text-xs text-slate-500 font-mono select-none ml-2 flex-shrink-0">{dataType}</span>
            </div>
            {isOpen && isExpandable && (
                <div className="pl-4 border-l border-slate-600 ml-2">
                    {Object.entries(value).map(([key, val]) => (
                        <TreeItem key={key} dataKey={key} value={val} path={fullPath} onSelect={onSelect} />
                    ))}
                </div>
            )}
        </div>
    );
};

export const DataTreeView: React.FC<DataTreeViewProps> = ({ data, onSelect, title }) => {
    const [searchTerm, setSearchTerm] = useState('');
    
    const filteredData = useMemo(() => filterData(data, searchTerm), [data, searchTerm]);

    return (
        <div className="bg-slate-700/50 p-3 rounded-lg border border-slate-600 h-full flex flex-col">
            <h3 className="font-semibold text-slate-200 mb-2 flex items-center text-base">
                <Icon name="sitemap" className="mr-2"/>
                {title}
            </h3>
            <div className="relative mb-2">
                 <TextInput
                    type="text"
                    placeholder="Filtrar campos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 text-xs !py-1"
                />
                <Icon name="search" className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
            </div>
             <div className="space-y-1 flex-grow overflow-y-auto pr-2">
                {Object.entries(filteredData).map(([key, value]) => (
                    <TreeItem key={key} dataKey={key} value={value} path="" onSelect={onSelect} />
                ))}
            </div>
        </div>
    );
};
    