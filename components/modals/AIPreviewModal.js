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
exports.AIPreviewModal = void 0;
const react_1 = __importStar(require("react"));
const Icon_1 = require("../common/Icon");
const TextArea_1 = require("../common/TextArea");
const placeholderService_1 = require("../../services/placeholderService");
const CollapsibleSection_1 = require("../common/CollapsibleSection");
const AIPreviewModal = ({ template, context, appData, onClose, onConfirm, isLoading }) => {
    const resolvedPrompt = (0, react_1.useMemo)(() => {
        // The placeholder service needs the full appData for things like the glossary, so we add it to the context.
        const enrichedContext = { ...context, appData };
        return (0, placeholderService_1.resolvePrompt)(template.template, enrichedContext);
    }, [template, context, appData]);
    return (<div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-3xl border border-slate-700 max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center flex-shrink-0">
          <h3 className="text-lg font-semibold text-slate-200 flex items-center">
            <Icon_1.Icon name="robot" className="mr-3 text-cyan-400"/>
            Previsualización del Prompt de IA
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><Icon_1.Icon name="times"/></button>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto">
          <p className="text-sm text-slate-400">
            Estás a punto de ejecutar la plantilla <strong className="text-slate-200">{template.name}</strong>. Revisa el prompt final que se enviará a la IA.
          </p>
          
          <CollapsibleSection_1.CollapsibleSection title="Prompt Final (Resuelto)" defaultOpen>
            <TextArea_1.TextArea value={resolvedPrompt} readOnly rows={12} className="font-mono text-xs bg-slate-900/50 !text-slate-200"/>
          </CollapsibleSection_1.CollapsibleSection>
          
          <CollapsibleSection_1.CollapsibleSection title="Plantilla Original">
            <TextArea_1.TextArea value={template.template} readOnly rows={8} className="font-mono text-xs bg-slate-700/30 !text-slate-400"/>
          </CollapsibleSection_1.CollapsibleSection>

        </div>
        <div className="p-4 border-t border-slate-700 flex justify-end space-x-2 flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500" disabled={isLoading}>
            Cancelar
          </button>
          <button onClick={onConfirm} disabled={isLoading} className="px-4 py-2 bg-cyan-500 text-slate-900 font-semibold rounded-md hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-wait flex items-center">
            {isLoading ? (<><Icon_1.Icon name="spinner" className="fa-spin mr-2"/> Generando...</>) : (<><Icon_1.Icon name="paper-plane" className="mr-2"/> Confirmar y Generar</>)}
          </button>
        </div>
      </div>
    </div>);
};
exports.AIPreviewModal = AIPreviewModal;
