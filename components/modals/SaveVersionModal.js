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
exports.SaveVersionModal = void 0;
const react_1 = __importStar(require("react"));
const Icon_1 = require("../common/Icon");
const TextArea_1 = require("../common/TextArea");
const SaveVersionModal = ({ onClose, onConfirm }) => {
    const [reason, setReason] = (0, react_1.useState)('');
    const handleConfirm = () => {
        if (reason.trim()) {
            onConfirm(reason.trim());
        }
    };
    return (<div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-lg border border-slate-700">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-slate-200 flex items-center">
            <Icon_1.Icon name="history" className="mr-3 text-cyan-400"/>
            Crear Nueva Versión de Contenido
          </h3>
          <p className="text-sm text-slate-400 mt-2">
            Se han detectado cambios en el contenido versionado de Amazon. Para guardar un registro histórico, por favor introduce un motivo para este cambio.
          </p>
          <div className="mt-4">
            <TextArea_1.TextArea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Ej: Optimización SEO de título y BPs para campaña de invierno..." rows={4} autoFocus/>
          </div>
        </div>
        <div className="p-4 bg-slate-700/50 flex justify-end space-x-2 rounded-b-lg">
          <button onClick={onClose} className="px-4 py-2 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500 font-semibold">
            Cancelar
          </button>
          <button onClick={handleConfirm} disabled={!reason.trim()} className="px-4 py-2 bg-cyan-500 text-slate-900 rounded-md hover:bg-cyan-600 font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
            Guardar Nueva Versión
          </button>
        </div>
      </div>
    </div>);
};
exports.SaveVersionModal = SaveVersionModal;
