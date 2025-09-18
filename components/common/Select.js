"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Select = void 0;
const react_1 = __importDefault(require("react"));
const Select = ({ children, ...props }) => {
    return (<select {...props} className={`block w-full pl-3 pr-10 py-2 text-base border-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm rounded-md bg-slate-200 text-slate-900 ${props.className || ''}`}>
      {children}
    </select>);
};
exports.Select = Select;
