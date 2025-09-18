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
exports.KnowledgeBaseAssistantButton = void 0;
const react_1 = __importStar(require("react"));
const Icon_1 = require("./Icon");
const KnowledgeBaseAssistantModal_1 = require("../modals/KnowledgeBaseAssistantModal");
const KnowledgeBaseAssistantButton = ({ appData, onInsert }) => {
    const [isModalOpen, setIsModalOpen] = (0, react_1.useState)(false);
    const handleSelect = (text, entry) => {
        onInsert(text, entry);
        setIsModalOpen(false);
    };
    return (<>
            <button type="button" onClick={() => setIsModalOpen(true)} className="p-2 text-cyan-400 bg-slate-700 rounded-md hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500" title="Asistente de Contenido">
                <Icon_1.Icon name="book"/>
            </button>
            {isModalOpen && (<KnowledgeBaseAssistantModal_1.KnowledgeBaseAssistantModal appData={appData} onClose={() => setIsModalOpen(false)} onInsert={handleSelect}/>)}
        </>);
};
exports.KnowledgeBaseAssistantButton = KnowledgeBaseAssistantButton;
