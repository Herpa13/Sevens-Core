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
exports.AIAssistantButton = void 0;
const react_1 = __importStar(require("react"));
const Icon_1 = require("./Icon");
const geminiService_1 = require("../../services/geminiService");
const AIPreviewModal_1 = require("../modals/AIPreviewModal");
const AIAssistantButton = ({ appData, templateCategory, context, onResult, entityType, targetLangCode }) => {
    const [isMenuOpen, setIsMenuOpen] = (0, react_1.useState)(false);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [previewState, setPreviewState] = (0, react_1.useState)(null);
    const wrapperRef = (0, react_1.useRef)(null);
    const relevantTemplates = appData.promptTemplates.filter(t => t.category === templateCategory && (t.entityType === entityType || t.entityType === 'general'));
    (0, react_1.useEffect)(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    const handleTemplateClick = (template) => {
        setIsMenuOpen(false);
        setPreviewState(template);
    };
    const handleConfirmGeneration = async () => {
        if (!previewState)
            return;
        setIsLoading(true);
        try {
            const result = await (0, geminiService_1.generateContentFromTemplate)(previewState, context, appData, targetLangCode);
            onResult(result);
        }
        catch (error) {
            console.error(error);
            alert(error.message || "An unknown error occurred with the AI assistant.");
        }
        finally {
            setIsLoading(false);
            setPreviewState(null);
        }
    };
    if (relevantTemplates.length === 0) {
        return null;
    }
    return (<div ref={wrapperRef} className="relative inline-block">
            <button type="button" onClick={() => setIsMenuOpen(prev => !prev)} disabled={isLoading} className="p-2 text-cyan-400 bg-slate-700 rounded-md hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 disabled:opacity-50" title="Asistente de IA">
                {isLoading ? (<Icon_1.Icon name="spinner" className="fa-spin"/>) : (<Icon_1.Icon name="wand-magic-sparkles"/>)}
            </button>
            {isMenuOpen && (<div className="absolute z-20 right-0 mt-2 w-64 bg-slate-700 border border-slate-600 rounded-md shadow-lg py-1">
                    {relevantTemplates.map(template => (<button key={template.id} onClick={() => handleTemplateClick(template)} className="w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-slate-600 flex items-start">
                            <Icon_1.Icon name="robot" className="mr-3 mt-1 text-slate-400"/>
                            <div>
                                <p className="font-semibold">{template.name}</p>
                                <p className="text-xs text-slate-400">{template.description}</p>
                            </div>
                        </button>))}
                </div>)}
            {previewState && (<AIPreviewModal_1.AIPreviewModal template={previewState} context={context} appData={appData} onClose={() => setPreviewState(null)} onConfirm={handleConfirmGeneration} isLoading={isLoading}/>)}
        </div>);
};
exports.AIAssistantButton = AIAssistantButton;
