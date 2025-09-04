import React, { useState, useMemo } from 'react';
import { TextInput } from './TextInput';
import { Icon } from './Icon';

interface MultiSelectOption {
  id: number | string;
  name: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  selectedIds: (number | string)[] | null; // null represents "all"
  onSelectionChange: (selectedIds: (number | string)[] | null) => void;
  placeholder?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({ options, selectedIds, onSelectionChange, placeholder = "Buscar..." }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = useMemo(() => {
    return options.filter(option => 
      option.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  const handleToggle = (id: number | string) => {
    let newSelectedIds: (number | string)[];
    if (selectedIds === null) {
        // If "all" is selected, toggling one item means selecting all EXCEPT this one.
        newSelectedIds = options.map(o => o.id).filter(optionId => optionId !== id);
    } else {
        if (selectedIds.includes(id)) {
            newSelectedIds = selectedIds.filter(selectedId => selectedId !== id);
        } else {
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

  return (
    <div className="bg-slate-900/50 border border-slate-700 rounded-md p-2 space-y-2">
      <div className="relative">
        <TextInput
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8 text-sm !py-1"
        />
        <Icon name="search" className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
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
            return (
                <label key={option.id} className="flex items-center p-1.5 rounded-md hover:bg-slate-700 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggle(option.id)}
                        className="h-4 w-4 text-cyan-500 border-slate-600 rounded bg-slate-800 focus:ring-cyan-500 focus:ring-offset-slate-900"
                    />
                    <span className="ml-3 text-sm text-slate-300 truncate">{option.name}</span>
                </label>
            );
        })}
      </div>
    </div>
  );
};