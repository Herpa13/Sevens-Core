import React, { useState, useMemo } from 'react';
import type { AppData } from '../../types';
import { Icon } from './Icon';
import { TextInput } from './TextInput';

interface GlobalTranslationPanelProps {
  appData: AppData;
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalTranslationPanel: React.FC<GlobalTranslationPanelProps> = ({ appData, isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedTermId, setExpandedTermId] = useState<number | string | null>(null);

  const filteredTerms = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    if (!lowerSearch) return appData.translationTerms;
    
    return appData.translationTerms.filter(term => {
        // FIX: The `spanish` property should be used for filtering, not a translation with lang 'ES'.
        return term.spanish.toLowerCase().includes(lowerSearch);
    });
  }, [appData.translationTerms, searchTerm]);
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // Maybe show a small notification in the future
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-20 right-8 bg-slate-800/95 backdrop-blur-sm border border-slate-700 rounded-lg shadow-2xl w-full max-w-md z-40 max-h-[80vh] flex flex-col">
      <div className="p-3 border-b border-slate-700 flex justify-between items-center flex-shrink-0">
        <h3 className="text-base font-semibold text-slate-200 flex items-center">
            <Icon name="language" className="mr-2 text-cyan-400"/>
            Asistente de Traducción
        </h3>
        <button onClick={onClose} className="text-slate-400 hover:text-white"><Icon name="times" /></button>
      </div>
      <div className="p-3 flex-shrink-0">
         <TextInput 
            placeholder="Buscar término en Español..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="p-3 space-y-2 overflow-y-auto">
        {filteredTerms.map(term => {
            // FIX: The `spanish` property holds the Spanish term directly.
            const spanishTranslation = term.spanish;
            const isExpanded = expandedTermId === term.id;
            return (
                <div key={term.id} className="bg-slate-700/50 p-2 rounded-md">
                    <button 
                        onClick={() => setExpandedTermId(isExpanded ? null : term.id)} 
                        className="font-bold text-sm text-slate-200 text-left w-full flex justify-between items-center"
                    >
                        <span>{spanishTranslation}</span>
                        <Icon name={isExpanded ? 'chevron-down' : 'chevron-right'} className="text-slate-400 transition-transform" />
                    </button>
                    {isExpanded && (
                        <div className="mt-2 pt-2 border-t border-slate-600 grid grid-cols-2 gap-x-2 gap-y-1">
                            {term.translations.filter(t => t.lang !== 'ES').map(t => (
                                <div key={t.lang} className="flex items-center justify-between text-xs bg-slate-800/50 p-1 rounded">
                                    <span className="text-slate-400">{t.lang}: <span className="text-slate-300">{t.value}</span></span>
                                    <button onClick={() => copyToClipboard(t.value)} title="Copiar" className="text-cyan-400 hover:text-cyan-300 ml-2">
                                        <Icon name="copy"/>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )
        })}
      </div>
    </div>
  );
};