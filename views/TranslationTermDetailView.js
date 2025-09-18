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
exports.TranslationTermDetailView = void 0;
const react_1 = __importStar(require("react"));
const languages_1 = require("../data/languages");
const FormField_1 = require("../components/common/FormField");
const TextInput_1 = require("../components/common/TextInput");
const lodash_es_1 = require("lodash-es");
const Icon_1 = require("../components/common/Icon");
const TextArea_1 = require("../components/common/TextArea");
const geminiService_1 = require("../services/geminiService");
const TranslationTermDetailView = ({ initialData, onSave, onDelete, onCancel, setIsDirty, setSaveHandler }) => {
    const [data, setData] = (0, react_1.useState)(initialData);
    const [translatingLang, setTranslatingLang] = (0, react_1.useState)(null);
    const [isTranslatingAll, setIsTranslatingAll] = (0, react_1.useState)(false);
    const handleSaveClick = (0, react_1.useCallback)((onSuccess) => {
        onSave(data);
        if (onSuccess) {
            onSuccess();
        }
    }, [data, onSave]);
    (0, react_1.useEffect)(() => {
        setData(initialData);
    }, [initialData]);
    (0, react_1.useEffect)(() => {
        setIsDirty(!(0, lodash_es_1.isEqual)(initialData, data));
    }, [data, initialData, setIsDirty]);
    (0, react_1.useEffect)(() => {
        setSaveHandler(() => handleSaveClick);
        return () => setSaveHandler(null);
    }, [handleSaveClick, setSaveHandler]);
    const handleSpanishChange = (e) => {
        setData(prev => ({ ...prev, spanish: e.target.value }));
    };
    const handleTranslationChange = (langCode, value) => {
        setData(prev => {
            const existing = prev.translations.find(t => t.lang === langCode);
            let newTranslations;
            if (existing) {
                newTranslations = prev.translations.map(t => t.lang === langCode ? { ...t, value } : t);
            }
            else {
                newTranslations = [...prev.translations, { lang: langCode, value }];
            }
            return { ...prev, translations: newTranslations };
        });
    };
    const handleTranslate = async (lang) => {
        const sourceText = data.spanish;
        if (!sourceText.trim()) {
            alert("El término en español no puede estar vacío.");
            return;
        }
        setTranslatingLang(lang.code);
        try {
            const prompt = `Traduce de forma concisa y profesional el siguiente texto de Español a ${lang.name}. Devuelve únicamente la traducción, sin explicaciones ni texto introductorio.\n\nTexto a traducir:\n"${sourceText}"`;
            // FIX: Use the recommended 'gemini-2.5-flash' model and correct 'contents' format.
            const response = await geminiService_1.ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            handleTranslationChange(lang.code, response.text.trim());
        }
        catch (error) {
            console.error(`Error translating to ${lang.name}:`, error);
            alert(`Hubo un error al traducir a ${lang.name}.`);
        }
        finally {
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
        for (const lang of languages_1.LANGUAGES) {
            if (lang.code === 'ES')
                continue;
            setTranslatingLang(lang.code);
            try {
                const prompt = `Traduce de forma concisa y profesional el siguiente texto de Español a ${lang.name}. Devuelve únicamente la traducción, sin explicaciones ni texto introductorio.\n\nTexto a traducir:\n"${sourceText}"`;
                // FIX: Use the recommended 'gemini-2.5-flash' model and correct 'contents' format.
                const response = await geminiService_1.ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
                handleTranslationChange(lang.code, response.text.trim());
            }
            catch (error) {
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
    return (<div className="bg-slate-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-slate-200 mb-6">{data.id === 'new' ? 'Nuevo Término de Traducción' : `Editando Término`}</h2>
      <FormField_1.FormField label="Término en Español (Fuente de la Verdad)" htmlFor="spanish">
        <TextArea_1.TextArea id="spanish" name="spanish" value={data.spanish} onChange={handleSpanishChange} placeholder="Escribe aquí el texto original en español..." rows={3}/>
      </FormField_1.FormField>
      
      <div className="mt-6 border-t border-slate-700 pt-4">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-300">Traducciones</h3>
            <button onClick={handleTranslateAll} disabled={isTranslatingAll || !data.spanish.trim()} className="px-4 py-2 bg-indigo-500 text-white font-semibold rounded-md hover:bg-indigo-600 disabled:opacity-50 flex items-center">
                <Icon_1.Icon name={isTranslatingAll ? 'spinner' : 'globe'} className={`mr-2 ${isTranslatingAll ? 'fa-spin' : ''}`}/>
                {isTranslatingAll ? 'Traduciendo...' : 'Traducir a todos'}
            </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {languages_1.LANGUAGES.filter(l => l.code !== 'ES').map(lang => (<FormField_1.FormField label={lang.name} htmlFor={lang.code} key={lang.code}>
                  <div className="flex items-center space-x-2">
                      <TextInput_1.TextInput id={lang.code} value={data.translations.find(t => t.lang === lang.code)?.value || ''} onChange={(e) => handleTranslationChange(lang.code, e.target.value)}/>
                      <button onClick={() => handleTranslate(lang)} disabled={translatingLang === lang.code || isTranslatingAll || !data.spanish.trim()} className="p-2 bg-slate-700 text-cyan-400 rounded-md hover:bg-slate-600 disabled:opacity-50" title={`Traducir de Español a ${lang.name}`}>
                          {translatingLang === lang.code ? <Icon_1.Icon name="spinner" className="fa-spin"/> : <Icon_1.Icon name="language"/>}
                      </button>
                  </div>
              </FormField_1.FormField>))}
        </div>
      </div>

      <div className="mt-8 flex justify-end space-x-4">
        {data.id !== 'new' && <button onClick={handleDeleteClick} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 font-semibold">Eliminar</button>}
        <button onClick={onCancel} className="px-4 py-2 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500 font-semibold">Cancelar</button>
        <button onClick={() => handleSaveClick()} className="px-4 py-2 bg-cyan-500 text-slate-900 rounded-md hover:bg-cyan-600 font-semibold">Guardar</button>
      </div>
    </div>);
};
exports.TranslationTermDetailView = TranslationTermDetailView;
