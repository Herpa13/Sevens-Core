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
exports.MultiSelect = void 0;
const react_1 = __importStar(require("react"));
const TextInput_1 = require("./TextInput");
const Icon_1 = require("./Icon");
const MultiSelect = ({ options, selectedIds, onSelectionChange, placeholder = "Buscar..." }) => {
    const [searchTerm, setSearchTerm] = (0, react_1.useState)('');
    const filteredOptions = (0, react_1.useMemo)(() => {
        return options.filter(option => option.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [options, searchTerm]);
    const handleToggle = (id) => {
        let newSelectedIds;
        if (selectedIds === null) {
            // If "all" is selected, toggling one item means selecting all EXCEPT this one.
            newSelectedIds = options.map(o => o.id).filter(optionId => optionId !== id);
        }
        else {
            if (selectedIds.includes(id)) {
                newSelectedIds = selectedIds.filter(selectedId => selectedId !== id);
            }
            else {
                newSelectedIds = [...selectedIds, id];
            }
        }
        // If all items are now selected, represent it as `null`
        onSelectionChange(newSelectedIds.length === options.length ? null : newSelectedIds);
    };
    const handleSelectAll = () => onSelectionChange(null);
    const handleSelectNone = () => onSelectionChange([]);
    const isAllSelected = selectedIds === null;
    const selectedCount = isAllSelected ? options.length : selectedIds.length;
    return (<div className="bg-slate-900/50 border border-slate-700 rounded-md p-2 space-y-2">
      <div className="relative">
        <TextInput_1.TextInput type="text" placeholder={placeholder} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8 text-sm !py-1"/>
        <Icon_1.Icon name="search" className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500"/>
      </div>
      <div className="flex justify-between items-center px-1">
        <span className="text-xs text-slate-400">{selectedCount} de {options.length} seleccionados</span>
        <div className="space-x-2">
            <button onClick={handleSelectAll} className="text-xs font-semibold text-cyan-400 hover:text-cyan-300">Todos</button>
            <button onClick={handleSelectNone} className="text-xs font-semibold text-cyan-400 hover:text-cyan-300">Ninguno</button>
        </div>
      </div>
      <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
        {filteredOptions.map(option => {
            const isSelected = isAllSelected || (selectedIds && selectedIds.includes(option.id));
            return (<label key={option.id} className="flex items-center p-1.5 rounded-md hover:bg-slate-700 cursor-pointer">
                    <input type="checkbox" checked={isSelected} onChange={() => handleToggle(option.id)} className="h-4 w-4 text-cyan-500 border-slate-600 rounded bg-slate-800 focus:ring-cyan-500 focus:ring-offset-slate-900"/>
                    <span className="ml-3 text-sm text-slate-300 truncate">{option.name}</span>
                </label>);
        })}
      </div>
    </div>);
};
exports.MultiSelect = MultiSelect;
