"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Icon = void 0;
const react_1 = __importDefault(require("react"));
const Icon = ({ name, className, title, onClick, ...rest }) => {
    // Use fa-brands for brand icons, fa-solid as default
    const style = className === 'fab' ? 'fa-brands' : 'fa-solid';
    // Avoid duplicating 'fab' in the class list
    const otherClasses = className === 'fab' ? '' : className;
    return <i className={`${style} fa-${name} ${otherClasses || ''}`.trim()} title={title} onClick={onClick} {...rest}></i>;
};
exports.Icon = Icon;
