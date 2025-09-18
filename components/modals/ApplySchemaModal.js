"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplySchemaModal = void 0;
const react_1 = __importDefault(require("react"));
const Icon_1 = require("../common/Icon");
const ApplySchemaModal = ({ schemas, onApply, onClose, entityName }) => {
    return (<div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl border border-slate-700 max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-slate-700 flex justify-between items-center flex-shrink-0">
          <h3 className="text-lg font-semibold text-slate-200">Aplicar Esquema de Trabajo a "{entityName}"</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><Icon_1.Icon name="times"/></button>
        </div>
        <div className="p-6 space-y-3 overflow-y-auto">
          {schemas.map(schema => (<div key={schema.id} className="bg-slate-700/50 p-3 rounded-md border border-slate-600 flex justify-between items-center">
                <div>
                    <h4 className="font-bold text-slate-200">{schema.name}</h4>
                    <p className="text-sm text-slate-400">{schema.description}</p>
                    <span className="text-xs font-mono text-cyan-400 bg-slate-800 px-2 py-0.5 rounded-full mt-2 inline-block">
                        {schema.templateTasks.length} Tareas
                    </span>
                </div>
                <button onClick={() => onApply(schema)} className="px-4 py-2 bg-cyan-500 text-slate-900 font-semibold rounded-md hover:bg-cyan-600 flex-shrink-0">
                    Aplicar
                </button>
            </div>))}
        </div>
      </div>
    </div>);
};
exports.ApplySchemaModal = ApplySchemaModal;
