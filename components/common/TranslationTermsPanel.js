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
exports.TranslationTermsPanel = void 0;
const react_1 = __importStar(require("react"));
const Icon_1 = require("./Icon");
const TextInput_1 = require("./TextInput");
const TranslationTermsPanel = ({ appData, isOpen, onClose }) => {
    const [searchTerm, setSearchTerm] = (0, react_1.useState)('');
    const filteredTerms = (0, react_1.useMemo)(() => {
        const lowerSearch = searchTerm.toLowerCase();
        if (!lowerSearch)
            return appData.translationTerms;
        return appData.translationTerms.filter(term => {
            // FIX: The `spanish` property should be used for filtering, not a translation with lang 'ES'.
            return term.spanish.toLowerCase().includes(lowerSearch);
        });
    }, [appData.translationTerms, searchTerm]);
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            // Maybe show a small notification in the future
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    };
    if (!isOpen)
        return null;
    return (<div className="fixed top-20 right-8 bg-slate-800/95 backdrop-blur-sm border border-slate-700 rounded-lg shadow-2xl w-full max-w-md z-40 max-h-[80vh] flex flex-col">
      <div className="p-3 border-b border-slate-700 flex justify-between items-center flex-shrink-0">
        <h3 className="text-base font-semibold text-slate-200 flex items-center">
            <Icon_1.Icon name="language" className="mr-2 text-cyan-400"/>
            Asistente de Traducción
        </h3>
        <button onClick={onClose} className="text-slate-400 hover:text-white"><Icon_1.Icon name="times"/></button>
      </div>
      <div className="p-3 flex-shrink-0">
         <TextInput_1.TextInput placeholder="Buscar término en Español..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
      </div>
      <div className="p-3 space-y-2 overflow-y-auto">
        {filteredTerms.map(term => {
            // FIX: The `spanish` property holds the Spanish term directly.
            const spanishTranslation = term.spanish;
            return (<div key={term.id} className="bg-slate-700/50 p-2 rounded-md">
                    <p className="font-bold text-sm text-slate-200">{spanishTranslation}</p>
                    <div className="mt-1 grid grid-cols-2 gap-x-2 gap-y-1">
                        {term.translations.filter(t => t.lang !== 'ES').map(t => (<div key={t.lang} className="flex items-center justify-between text-xs bg-slate-800/50 p-1 rounded">
                                <span className="text-slate-400">{t.lang}: <span className="text-slate-300">{t.value}</span></span>
                                <button onClick={() => copyToClipboard(t.value)} title="Copiar" className="text-cyan-400 hover:text-cyan-300 ml-2">
                                    <Icon_1.Icon name="copy"/>
                                </button>
                            </div>))}
                    </div>
                </div>);
        })}
      </div>
    </div>);
};
exports.TranslationTermsPanel = TranslationTermsPanel;
