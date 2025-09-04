import React, { useState, useRef } from 'react';
import { AppData } from '../../types';
import { FormField } from '../common/FormField';
import { TextArea } from '../common/TextArea';
import { Icon } from '../common/Icon';
import { DataTreeView } from '../common/DataTreeView';

interface FormulaEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formula: string) => void;
  initialValue: string;
  appData: AppData;
}

export const FormulaEditorModal: React.FC<FormulaEditorModalProps> = ({ isOpen, onClose, onSave, initialValue, appData }) => {
  const [formula, setFormula] = useState(initialValue);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  if (!isOpen) return null;

  const handleInsertPlaceholder = (placeholder: string) => {
    const textarea = textareaRef.current;
    if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const newText = text.substring(0, start) + placeholder + text.substring(end);
        
        setFormula(newText);
        
        // Focus and set cursor position after state update
        setTimeout(() => {
            textarea.focus();
            textarea.selectionStart = textarea.selectionEnd = start + placeholder.length;
        }, 0);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-4xl border border-slate-700 max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-slate-700 flex justify-between items-center flex-shrink-0">
          <h3 className="text-lg font-semibold text-slate-200">Editor de Fórmulas</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><Icon name="times" /></button>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
            <div className="md:col-span-2 flex flex-col">
                 <FormField label="Fórmula" htmlFor="formula-editor" helpText='Combina texto estático y placeholders. Ej: "WellnessPro {product.name} - {product.units} Unidades"'>
                    <TextArea 
                        ref={textareaRef}
                        id="formula-editor"
                        value={formula}
                        onChange={e => setFormula(e.target.value)}
                        rows={15}
                        className="font-mono text-sm"
                    />
                </FormField>
                <div>
                    <h4 className="text-sm font-semibold mt-4 mb-2">Funciones Disponibles</h4>
                     <div className="flex flex-wrap gap-2 text-xs">
                        <code title="TRUNCATE(texto, longitud)" className="bg-slate-700 px-2 py-1 rounded cursor-help">TRUNCATE</code>
                        <code title="UPPERCASE(texto)" className="bg-slate-700 px-2 py-1 rounded cursor-help">UPPERCASE</code>
                        <code title="REPLACE(texto, buscar, reemplazar)" className="bg-slate-700 px-2 py-1 rounded cursor-help">REPLACE</code>
                        <code title="STRIP_HTML(texto_html)" className="bg-slate-700 px-2 py-1 rounded cursor-help">STRIP_HTML</code>
                        <code title="IF(condicion, valor_si_verdadero, valor_si_falso)" className="bg-slate-700 px-2 py-1 rounded cursor-help">IF</code>
                    </div>
                </div>
            </div>
            <div className="md:col-span-1 min-h-0">
                <DataTreeView 
                    data={{ product: appData.products[0] }} 
                    onSelect={handleInsertPlaceholder} 
                    title="Asistente de Placeholders"
                />
            </div>
        </div>
        <div className="p-4 border-t border-slate-700 flex justify-end space-x-2 flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500">
            Cancelar
          </button>
          <button 
            onClick={() => onSave(formula)}
            className="px-4 py-2 bg-cyan-500 text-slate-900 font-semibold rounded-md hover:bg-cyan-600"
          >
            Guardar Fórmula
          </button>
        </div>
      </div>
    </div>
  );
};