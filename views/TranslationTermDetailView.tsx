import React, { useState, useEffect, useCallback } from 'react';
import type { TranslationTerm, LanguageCode } from '../types';
import { DEMO_LANGUAGES } from '../data/demoData';
import { FormField } from '../components/common/FormField';
import { TextInput } from '../components/common/TextInput';
import { isEqual } from 'lodash-es';
import { Icon } from '../components/common/Icon';
import { TextArea } from '../components/common/TextArea';
import { ai } from '../services/geminiService';

interface TranslationTermDetailViewProps {
  initialData: TranslationTerm;
  onSave: (data: TranslationTerm) => void;
  // FIX: Update `onDelete` prop to accept 'new' and adjust `handleDeleteClick`.
  onDelete: (id: number | 'new') => void;
  onCancel: () => void;
  setIsDirty: (isDirty: boolean) => void;
  setSaveHandler: (handler: ((onSuccess?: () => void) => void) | null) => void;
}

export const TranslationTermDetailView: React.FC<TranslationTermDetailViewProps> = ({ initialData, onSave, onDelete, onCancel, setIsDirty, setSaveHandler }) => {
  const [data, setData] = useState<TranslationTerm>(initialData);
  const [translatingLang, setTranslatingLang] = useState<LanguageCode | null>(null);
  const [isTranslatingAll, setIsTranslatingAll] = useState(false);

  const handleSaveClick = useCallback((onSuccess?: () => void) => {
    onSave(data);
    if (onSuccess) {
      onSuccess();
    }
  }, [data, onSave]);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  useEffect(() => {
    setIsDirty(!isEqual(initialData, data));
  }, [data, initialData, setIsDirty]);

  useEffect(() => {
    setSaveHandler(() => handleSaveClick);
    return () => setSaveHandler(null);
  }, [handleSaveClick, setSaveHandler]);


  const handleSpanishChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setData(prev => ({...prev, spanish: e.target.value }));
  };

  const handleTranslationChange = (langCode: LanguageCode, value: string) => {
    setData(prev => {
        const existing = prev.translations.find(t => t.lang === langCode);
        let newTranslations;
        if (existing) {
            newTranslations = prev.translations.map(t => t.lang === langCode ? {...t, value} : t);
        } else {
            newTranslations = [...prev.translations, { lang: langCode, value }];
        }
        return {...prev, translations: newTranslations};
    });
  };

  const handleTranslate = async (lang: (typeof DEMO_LANGUAGES)[0]) => {
    const sourceText = data.spanish;
    if (!sourceText.trim()) {
      alert("El término en español no puede estar vacío.");
      return;
    }
    setTranslatingLang(lang.code);
    try {
      const prompt = `Traduce de forma concisa y profesional el siguiente texto de Español a ${lang.name}. Devuelve únicamente la traducción, sin explicaciones ni texto introductorio.\n\nTexto a traducir:\n"${sourceText}"`;
      // FIX: Use the recommended 'gemini-2.5-flash' model and correct 'contents' format.
      const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
      handleTranslationChange(lang.code, response.text.trim());
    } catch (error) {
      console.error(`Error translating to ${lang.name}:`, error);
      alert(`Hubo un error al traducir a ${lang.name}.`);
    } finally {
      setTranslatingLang(null);
    }
  };

  const handleTranslateAll = async () => {
    const sourceText = data.spanish;
    if (!sourceText.trim()) {
      alert("El término en español no puede estar vacío.");
      return;
    }
    setIsTranslatingAll(true);
    for (const lang of DEMO_LANGUAGES) {
      if (lang.code === 'ES') continue;
      setTranslatingLang(lang.code);
      try {
        const prompt = `Traduce de forma concisa y profesional el siguiente texto de Español a ${lang.name}. Devuelve únicamente la traducción, sin explicaciones ni texto introductorio.\n\nTexto a traducir:\n"${sourceText}"`;
        // FIX: Use the recommended 'gemini-2.5-flash' model and correct 'contents' format.
        const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
        handleTranslationChange(lang.code, response.text.trim());
      } catch (error) {
        console.error(`Error translating to ${lang.name}:`, error);
        alert(`Hubo un error al traducir a ${lang.name}. Se detendrá la traducción masiva.`);
        break; // Stop on error
      }
    }
    setTranslatingLang(null);
    setIsTranslatingAll(false);
  };
  
  // FIX: Update `onDelete` prop to accept 'new' and adjust `handleDeleteClick`.
  const handleDeleteClick = () => onDelete(data.id);

  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-slate-200 mb-6">{data.id === 'new' ? 'Nuevo Término de Traducción' : `Editando Término`}</h2>
      <FormField label="Término en Español (Fuente de la Verdad)" htmlFor="spanish">
        <TextArea id="spanish" name="spanish" value={data.spanish} onChange={handleSpanishChange} placeholder="Escribe aquí el texto original en español..." rows={3}/>
      </FormField>
      
      <div className="mt-6 border-t border-slate-700 pt-4">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-300">Traducciones</h3>
            <button
                onClick={handleTranslateAll}
                disabled={isTranslatingAll || !data.spanish.trim()}
                className="px-4 py-2 bg-indigo-500 text-white font-semibold rounded-md hover:bg-indigo-600 disabled:opacity-50 flex items-center"
            >
                <Icon name={isTranslatingAll ? 'spinner' : 'globe'} className={`mr-2 ${isTranslatingAll ? 'fa-spin' : ''}`} />
                {isTranslatingAll ? 'Traduciendo...' : 'Traducir a todos'}
            </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {DEMO_LANGUAGES.filter(l => l.code !== 'ES').map(lang => (
              <FormField label={lang.name} htmlFor={lang.code} key={lang.code}>
                  <div className="flex items-center space-x-2">
                      <TextInput 
                          id={lang.code} 
                          value={data.translations.find(t => t.lang === lang.code)?.value || ''}
                          onChange={(e) => handleTranslationChange(lang.code, e.target.value)} 
                      />
                      <button
                          onClick={() => handleTranslate(lang)}
                          disabled={translatingLang === lang.code || isTranslatingAll || !data.spanish.trim()}
                          className="p-2 bg-slate-700 text-cyan-400 rounded-md hover:bg-slate-600 disabled:opacity-50"
                          title={`Traducir de Español a ${lang.name}`}
                      >
                          {translatingLang === lang.code ? <Icon name="spinner" className="fa-spin"/> : <Icon name="language"/>}
                      </button>
                  </div>
              </FormField>
          ))}
        </div>
      </div>

      <div className="mt-8 flex justify-end space-x-4">
        {data.id !== 'new' && <button onClick={handleDeleteClick} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 font-semibold">Eliminar</button>}
        <button onClick={onCancel} className="px-4 py-2 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500 font-semibold">Cancelar</button>
        <button onClick={() => handleSaveClick()} className="px-4 py-2 bg-cyan-500 text-slate-900 rounded-md hover:bg-cyan-600 font-semibold">Guardar</button>
      </div>
    </div>
  );
};