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
exports.CollapsibleSection = void 0;
const react_1 = __importStar(require("react"));
const Icon_1 = require("./Icon");
const CollapsibleSection = ({ title, children, defaultOpen = false, isOpen: controlledIsOpen, onToggle, id, className, }) => {
    const [internalIsOpen, setInternalIsOpen] = (0, react_1.useState)(defaultOpen);
    const isControlled = controlledIsOpen !== undefined;
    const isOpen = isControlled ? controlledIsOpen : internalIsOpen;
    const handleToggle = () => {
        if (onToggle) {
            onToggle();
        }
        else {
            setInternalIsOpen(prev => !prev);
        }
    };
    return (<div id={id} className={`border border-slate-700 rounded-lg mb-4 bg-slate-800/50 ${className || ''}`}>
      <button onClick={handleToggle} className="w-full flex justify-between items-center p-3 font-semibold text-left text-slate-200 bg-slate-700/50 hover:bg-slate-700 rounded-t-lg focus:outline-none">
        <span>{title}</span>
        <Icon_1.Icon name={isOpen ? 'chevron-down' : 'chevron-right'} className="transition-transform"/>
      </button>
      {isOpen && (<div className="p-4 border-t border-slate-700">
          {children}
        </div>)}
    </div>);
};
exports.CollapsibleSection = CollapsibleSection;
