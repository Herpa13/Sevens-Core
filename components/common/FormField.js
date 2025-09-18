"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormField = void 0;
const react_1 = __importDefault(require("react"));
const FormField = ({ label, htmlFor, helpText, children, className = '' }) => {
    return (<div className={`mb-4 ${className}`}>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-300 mb-1">
        {label}
      </label>
      {children}
      {helpText && <p className="mt-1 text-xs text-slate-400">{helpText}</p>}
    </div>);
};
exports.FormField = FormField;
