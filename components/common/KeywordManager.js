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
exports.KeywordManager = void 0;
const react_1 = __importStar(require("react"));
const TextInput_1 = require("./TextInput");
const Icon_1 = require("./Icon");
const calculateByteSize = (str) => {
    // This provides a good approximation of UTF-8 byte length in the browser
    return new Blob([str]).size;
};
const KeywordManager = ({ keywords, onChange, maxKeywords = 100, byteLimit }) => {
    const [inputValue, setInputValue] = (0, react_1.useState)('');
    const currentBytes = (0, react_1.useMemo)(() => {
        if (!byteLimit)
            return 0;
        // Amazon's backend keywords are space-separated, so we join with a space to get a realistic byte count.
        return calculateByteSize(keywords.join(' '));
    }, [keywords, byteLimit]);
    const wouldExceedByteLimit = (0, react_1.useMemo)(() => {
        if (!byteLimit || !inputValue.trim())
            return false;
        const newKeywordsString = [...keywords, inputValue.trim()].join(' ');
        return calculateByteSize(newKeywordsString) > byteLimit;
    }, [keywords, inputValue, byteLimit]);
    const handleAddKeyword = () => {
        if (inputValue.trim() && !keywords.includes(inputValue.trim()) && keywords.length < maxKeywords && !wouldExceedByteLimit) {
            onChange([...keywords, inputValue.trim()]);
            setInputValue('');
        }
    };
    const handleRemoveKeyword = (keywordToRemove) => {
        onChange(keywords.filter(k => k !== keywordToRemove));
    };
    return (<div>
      <div className="flex items-center space-x-2">
        <TextInput_1.TextInput type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())} placeholder="Añadir palabra clave..."/>
        <button type="button" onClick={handleAddKeyword} className="px-4 py-2 bg-cyan-500 text-slate-900 font-semibold rounded-md hover:bg-cyan-600 disabled:bg-slate-600 disabled:text-slate-400" disabled={!inputValue.trim() || keywords.length >= maxKeywords || wouldExceedByteLimit}>
          Añadir
        </button>
      </div>
       {byteLimit && (<div className="mt-1 text-xs font-mono text-right">
            <span className={currentBytes > byteLimit ? 'text-red-400 font-bold' : 'text-slate-400'}>
                Bytes: {currentBytes}/{byteLimit}
            </span>
            {wouldExceedByteLimit && <p className="text-red-400">Añadir esta keyword superaría el límite de bytes.</p>}
         </div>)}
      <div className="mt-2 flex flex-wrap gap-2">
        {keywords.map((keyword) => (<span key={keyword} className="flex items-center bg-slate-600 text-slate-200 text-sm font-medium px-2.5 py-1 rounded-full">
            {keyword}
            <button type="button" onClick={() => handleRemoveKeyword(keyword)} className="ml-2 text-slate-400 hover:text-slate-200">
              <Icon_1.Icon name="times-circle"/>
            </button>
          </span>))}
      </div>
    </div>);
};
exports.KeywordManager = KeywordManager;
