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
exports.KnowledgeBaseAssistantModal = void 0;
const react_1 = __importStar(require("react"));
const Icon_1 = require("../common/Icon");
const TextInput_1 = require("../common/TextInput");
const KnowledgeBaseAssistantModal = ({ appData, onClose, onInsert }) => {
    const [searchTerm, setSearchTerm] = (0, react_1.useState)('');
    const textSnippets = (0, react_1.useMemo)(() => {
        return appData.knowledgeBaseEntries.filter(entry => {
            if (entry.entryType !== 'Texto' || entry.status !== 'Aprobado')
                return false;
            if (searchTerm === '')
                return true;
            const lowerSearch = searchTerm.toLowerCase();
            return (entry.title.toLowerCase().includes(lowerSearch) ||
                entry.description.toLowerCase().includes(lowerSearch) ||
                (entry.content.text && entry.content.text.toLowerCase().includes(lowerSearch)) ||
                entry.tags.some(tag => tag.toLowerCase().includes(lowerSearch)));
        });
    }, [appData.knowledgeBaseEntries, searchTerm]);
    return (<div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl border border-slate-700 max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-slate-700 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-slate-200 flex items-center">
                        <Icon_1.Icon name="book" className="mr-3 text-cyan-400"/>
                        Asistente de Contenido: Insertar Texto Aprobado
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white"><Icon_1.Icon name="times"/></button>
                </div>
                <div className="p-4">
                    <TextInput_1.TextInput placeholder="Buscar por título, contenido o etiqueta..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}/>
                </div>
                <div className="p-2 space-y-2 overflow-y-auto">
                    {textSnippets.length > 0 ? textSnippets.map(entry => (<div key={entry.id} className="p-3 rounded-md border border-slate-700 bg-slate-800/60 hover:border-cyan-500 cursor-pointer" onClick={() => onInsert(entry.content.text || '', entry)}>
                            <h4 className="font-bold text-slate-200">{entry.title} (v{entry.version})</h4>
                            <p className="text-sm text-slate-400 mt-1 whitespace-pre-wrap">{entry.content.text}</p>
                             <div className="mt-2 flex flex-wrap gap-1">
                                {entry.tags.map(tag => (<span key={tag} className="text-xs bg-slate-600 text-slate-300 px-2 py-0.5 rounded-full">{tag}</span>))}
                            </div>
                        </div>)) : (<p className="text-center text-slate-500 p-8">No se encontraron snippets de texto aprobados que coincidan.</p>)}
                </div>
            </div>
        </div>);
};
exports.KnowledgeBaseAssistantModal = KnowledgeBaseAssistantModal;
