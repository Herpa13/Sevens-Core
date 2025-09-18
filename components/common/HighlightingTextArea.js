"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HighlightingTextArea = void 0;
const react_1 = __importDefault(require("react"));
const renderHighlightedText = (text, allKeywords, hoveredKeyword) => {
    if (!text || !allKeywords || allKeywords.length === 0) {
        return <span>{text}</span>;
    }
    const keywordMap = new Map(allKeywords.map(k => [k.name.toLowerCase(), k.total]));
    const regex = new RegExp(`(${allKeywords
        .map(k => k.name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'))
        .join('|')})`, 'gi');
    const parts = text.split(regex).filter(part => part !== '');
    return (<>
            {parts.map((part, i) => {
            const partLower = part.toLowerCase();
            const count = keywordMap.get(partLower);
            if (count !== undefined) {
                const isHovered = hoveredKeyword && partLower === hoveredKeyword.toLowerCase();
                const className = isHovered
                    ? "bg-yellow-500/40 text-yellow-200 px-1 rounded"
                    : "bg-slate-700 text-slate-300 px-1 rounded";
                return (<mark key={i} className={className}>
                            {part}
                            <sup className="text-xs font-bold select-none ml-0.5 -top-1 relative">{count}</sup>
                        </mark>);
            }
            return part;
        })}
        </>);
};
const HighlightingTextArea = ({ value, highlightedKeyword, allKeywordsToHighlight = [], ...props }) => {
    return (<div className="relative">
      <div className="block w-full px-3 py-2 border border-slate-700 rounded-md shadow-sm sm:text-sm bg-slate-900 text-transparent pointer-events-none whitespace-pre-wrap" style={{ minHeight: props.rows ? `${props.rows * 1.5 + 0.5}rem` : 'auto' }} aria-hidden="true">
        <div className="text-slate-200">{renderHighlightedText(String(value || ''), allKeywordsToHighlight, highlightedKeyword)}</div>
      </div>
      <textarea value={value} {...props} className="absolute inset-0 block w-full px-3 py-2 border border-transparent rounded-md shadow-sm placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm bg-transparent text-transparent caret-cyan-400 resize-none"/>
    </div>);
};
exports.HighlightingTextArea = HighlightingTextArea;
