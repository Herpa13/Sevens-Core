"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogDisplay = void 0;
const react_1 = __importDefault(require("react"));
const Icon_1 = require("./Icon");
const actionConfig = {
    Creación: { color: 'green', icon: 'plus-circle' },
    Actualización: { color: 'yellow', icon: 'pencil-alt' },
    Eliminación: { color: 'red', icon: 'trash-alt' },
};
const ValueDisplay = ({ value }) => {
    if (value === null || value === undefined || value === 'vacío') {
        return <i className="text-slate-500">vacío</i>;
    }
    if (typeof value === 'boolean') {
        return <span className={`font-semibold ${value ? 'text-green-400' : 'text-red-400'}`}>{value ? 'Sí' : 'No'}</span>;
    }
    if (Array.isArray(value)) {
        return <span className="text-slate-400 text-xs bg-slate-700 p-1 rounded-md">{`[${value.join(', ')}]`}</span>;
    }
    return <span className="text-slate-300">{String(value)}</span>;
};
const ChangeItem = ({ change, isHighlighted }) => {
    return (<li className={`flex items-start p-1 rounded-md ${isHighlighted ? 'bg-cyan-500/10' : ''}`}>
      <Icon_1.Icon name="chevron-right" className="text-xs text-slate-500 mr-2 mt-1 flex-shrink-0"/>
      <div className="flex-grow">
        <span className="font-semibold text-slate-400">{change.fieldName}:</span>
        <div className="flex items-center space-x-2 text-sm">
            <ValueDisplay value={change.oldValue}/>
            <Icon_1.Icon name="long-arrow-alt-right" className="text-cyan-500"/>
            <ValueDisplay value={change.newValue}/>
        </div>
      </div>
    </li>);
};
const AuditLogDisplay = ({ logs, highlightedField }) => {
    if (!logs || logs.length === 0) {
        return (<div className="text-center p-12 text-slate-500">
        <Icon_1.Icon name="history" className="text-4xl mb-4"/>
        <p>No hay historial de cambios para mostrar.</p>
      </div>);
    }
    return (<div className="flow-root">
      <ul className="-mb-8">
        {logs.map((log, logIdx) => {
            const config = actionConfig[log.actionType];
            return (<li key={log.id}>
              <div className="relative pb-8">
                {logIdx !== logs.length - 1 ? (<span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-700" aria-hidden="true"/>) : null}
                <div className="relative flex items-start space-x-3">
                  <div>
                    <span className={`h-8 w-8 rounded-full bg-${config.color}-500/20 flex items-center justify-center ring-4 ring-slate-800`}>
                      <Icon_1.Icon name={config.icon} className={`text-${config.color}-400`}/>
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                    <div>
                      <div className="text-sm">
                        <span className="font-medium text-slate-200">{log.userName}</span>
                        <span className="text-slate-400"> {log.actionType.toLowerCase()} la entidad </span>
                        <span className="font-semibold text-cyan-400">{log.entityName}</span>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </div>
                    {log.actionType === 'Actualización' && log.changes && log.changes.length > 0 && (<div className="mt-2 text-sm text-slate-300">
                        <ul className="space-y-1">
                            {log.changes.map((change, index) => (<ChangeItem key={index} change={change} isHighlighted={highlightedField === change.fieldName}/>))}
                        </ul>
                      </div>)}
                  </div>
                </div>
              </div>
            </li>);
        })}
      </ul>
    </div>);
};
exports.AuditLogDisplay = AuditLogDisplay;
