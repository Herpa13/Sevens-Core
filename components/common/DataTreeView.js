"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataTreeView = void 0;
const react_1 = __importStar(require("react"));
const Icon_1 = require("./Icon");
const TextInput_1 = require("./TextInput");
const isObject = (value) => value !== null && typeof value === 'object';
const getDataType = (value) => {
    if (value === null)
        return 'null';
    if (Array.isArray(value))
        return 'array';
    return typeof value;
};
const filterData = (data, searchTerm) => {
    if (!searchTerm) {
        return data;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filterNode = (node) => {
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
                }
                else {
                    const valueMatch = String(value).toLowerCase().includes(lowerCaseSearchTerm);
                    if (keyMatch || valueMatch) {
                        acc[key] = value;
                    }
                }
                return acc;
            }, {});
            return Object.keys(filteredEntries).length > 0 ? filteredEntries : null;
        }
        return null;
    };
    return filterNode(data) || {};
};
const TreeItem = ({ dataKey, value, path, onSelect }) => {
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const fullPath = path ? `${path}.${dataKey}` : dataKey;
    const isExpandable = isObject(value);
    const dataType = getDataType(value);
    const handleToggle = (e) => {
        e.stopPropagation();
        setIsOpen(prev => !prev);
    };
    const handleSelect = (e) => {
        e.stopPropagation();
        if (!isExpandable) {
            onSelect(`{${fullPath}}`);
        }
        else {
            setIsOpen(prev => !prev);
        }
    };
    return (<div className="text-sm">
            <div onClick={handleSelect} className="flex items-start p-1 rounded-md hover:bg-slate-700 cursor-pointer" title={isExpandable ? `Click to expand/collapse` : `Click to insert {${fullPath}}`}>
                {isExpandable ? (<Icon_1.Icon name={isOpen ? 'chevron-down' : 'chevron-right'} className="w-4 mr-1 mt-1 flex-shrink-0 transition-transform" onClick={handleToggle}/>) : (<div className="w-4 mr-1 flex-shrink-0"></div>)}
                <div className="flex-grow">
                    <span className="font-semibold text-slate-300">{dataKey}</span>
                    {!isExpandable && (<span className="text-slate-500 ml-2">: 
                            <span className="text-cyan-400 ml-1" title={String(value)}>{String(value).length > 40 ? `${String(value).substring(0, 40)}...` : String(value)}</span>
                        </span>)}
                </div>
                 <span className="text-xs text-slate-500 font-mono select-none ml-2 flex-shrink-0">{dataType}</span>
            </div>
            {isOpen && isExpandable && (<div className="pl-4 border-l border-slate-600 ml-2">
                    {Object.entries(value).map(([key, val]) => (<TreeItem key={key} dataKey={key} value={val} path={fullPath} onSelect={onSelect}/>))}
                </div>)}
        </div>);
};
const DataTreeView = ({ data, onSelect, title }) => {
    const [searchTerm, setSearchTerm] = (0, react_1.useState)('');
    const filteredData = (0, react_1.useMemo)(() => filterData(data, searchTerm), [data, searchTerm]);
    return (<div className="bg-slate-700/50 p-3 rounded-lg border border-slate-600 h-full flex flex-col">
            <h3 className="font-semibold text-slate-200 mb-2 flex items-center text-base">
                <Icon_1.Icon name="sitemap" className="mr-2"/>
                {title}
            </h3>
            <div className="relative mb-2">
                 <TextInput_1.TextInput type="text" placeholder="Filtrar campos..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8 text-xs !py-1"/>
                <Icon_1.Icon name="search" className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500"/>
            </div>
             <div className="space-y-1 flex-grow overflow-y-auto pr-2">
                {Object.entries(filteredData).map(([key, value]) => (<TreeItem key={key} dataKey={key} value={value} path="" onSelect={onSelect}/>))}
            </div>
        </div>);
};
exports.DataTreeView = DataTreeView;
