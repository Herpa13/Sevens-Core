import React, { useMemo } from 'react';
import type { AppData, PromptTemplate } from '../../types';
import { Icon } from '../common/Icon';
import { TextArea } from '../common/TextArea';
import { resolvePrompt } from '../../services/placeholderService';
import { CollapsibleSection } from '../common/CollapsibleSection';

interface AIPreviewModalProps {
  template: PromptTemplate;
  context: object;
  appData: AppData;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export const AIPreviewModal: React.FC<AIPreviewModalProps> = ({ template, context, appData, onClose, onConfirm, isLoading }) => {
  const resolvedPrompt = useMemo(() => {
    // The placeholder service needs the full appData for things like the glossary, so we add it to the context.
    const enrichedContext = { ...context, appData };
    return resolvePrompt(template.template, enrichedContext);
  }, [template, context, appData]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-3xl border border-slate-700 max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center flex-shrink-0">
          <h3 className="text-lg font-semibold text-slate-200 flex items-center">
            <Icon name="robot" className="mr-3 text-cyan-400"/>
            Previsualización del Prompt de IA
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><Icon name="times" /></button>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto">
          <p className="text-sm text-slate-400">
            Estás a punto de ejecutar la plantilla <strong className="text-slate-200">{template.name}</strong>. Revisa el prompt final que se enviará a la IA.
          </p>
          
          <CollapsibleSection title="Prompt Final (Resuelto)" defaultOpen>
            <TextArea value={resolvedPrompt} readOnly rows={12} className="font-mono text-xs bg-slate-900/50 !text-slate-200" />
          </CollapsibleSection>
          
          <CollapsibleSection title="Plantilla Original">
            <TextArea value={template.template} readOnly rows={8} className="font-mono text-xs bg-slate-700/30 !text-slate-400" />
          </CollapsibleSection>

        </div>
        <div className="p-4 border-t border-slate-700 flex justify-end space-x-2 flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500" disabled={isLoading}>
            Cancelar
          </button>
          <button 
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-cyan-500 text-slate-900 font-semibold rounded-md hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-wait flex items-center"
          >
            {isLoading ? (
                <><Icon name="spinner" className="fa-spin mr-2" /> Generando...</>
            ) : (
                <><Icon name="paper-plane" className="mr-2" /> Confirmar y Generar</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};