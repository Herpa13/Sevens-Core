import React from 'react';
import type { AppData, PromptTemplate } from '../../types';
import { Icon } from '../common/Icon';

interface SelectPromptTemplateModalProps {
  appData: AppData;
  category: PromptTemplate['category'];
  onClose: () => void;
  onSelect: (templateId: number) => void;
}

export const SelectPromptTemplateModal: React.FC<SelectPromptTemplateModalProps> = ({ appData, category, onClose, onSelect }) => {
  const relevantTemplates = appData.promptTemplates.filter(t => t.category === category);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl border border-slate-700 max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-slate-700 flex justify-between items-center flex-shrink-0">
          <h3 className="text-lg font-semibold text-slate-200">Seleccionar Plantilla de IA</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><Icon name="times" /></button>
        </div>
        <div className="p-6 space-y-3 overflow-y-auto">
          {relevantTemplates.length > 0 ? (
            relevantTemplates.map(template => (
              <button
                key={template.id}
                onClick={() => onSelect(template.id as number)}
                className="w-full text-left bg-slate-700/50 p-3 rounded-md border border-slate-600 hover:border-cyan-500 transition-colors"
              >
                <h4 className="font-bold text-slate-200">{template.name}</h4>
                <p className="text-sm text-slate-400">{template.description}</p>
              </button>
            ))
          ) : (
            <p className="text-center text-slate-500 p-8">No hay plantillas de IA disponibles para la categoría "{category}".</p>
          )}
        </div>
      </div>
    </div>
  );
};
