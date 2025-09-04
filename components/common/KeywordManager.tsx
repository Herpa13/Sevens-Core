
import React, { useState, useMemo } from 'react';
import { TextInput } from './TextInput';
import { Icon } from './Icon';

interface KeywordManagerProps {
  keywords: string[];
  onChange: (keywords: string[]) => void;
  maxKeywords?: number;
  byteLimit?: number;
}

const calculateByteSize = (str: string): number => {
    // This provides a good approximation of UTF-8 byte length in the browser
    return new Blob([str]).size;
}

export const KeywordManager: React.FC<KeywordManagerProps> = ({ keywords, onChange, maxKeywords = 100, byteLimit }) => {
  const [inputValue, setInputValue] = useState('');

  const currentBytes = useMemo(() => {
    if (!byteLimit) return 0;
    // Amazon's backend keywords are space-separated, so we join with a space to get a realistic byte count.
    return calculateByteSize(keywords.join(' '));
  }, [keywords, byteLimit]);
  
  const wouldExceedByteLimit = useMemo(() => {
      if (!byteLimit || !inputValue.trim()) return false;
      const newKeywordsString = [...keywords, inputValue.trim()].join(' ');
      return calculateByteSize(newKeywordsString) > byteLimit;
  }, [keywords, inputValue, byteLimit]);

  const handleAddKeyword = () => {
    if (inputValue.trim() && !keywords.includes(inputValue.trim()) && keywords.length < maxKeywords && !wouldExceedByteLimit) {
      onChange([...keywords, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleRemoveKeyword = (keywordToRemove: string) => {
    onChange(keywords.filter(k => k !== keywordToRemove));
  };

  return (
    <div>
      <div className="flex items-center space-x-2">
        <TextInput
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
          placeholder="Añadir palabra clave..."
        />
        <button
          type="button"
          onClick={handleAddKeyword}
          className="px-4 py-2 bg-cyan-500 text-slate-900 font-semibold rounded-md hover:bg-cyan-600 disabled:bg-slate-600 disabled:text-slate-400"
          disabled={!inputValue.trim() || keywords.length >= maxKeywords || wouldExceedByteLimit}
        >
          Añadir
        </button>
      </div>
       {byteLimit && (
         <div className="mt-1 text-xs font-mono text-right">
            <span className={currentBytes > byteLimit ? 'text-red-400 font-bold' : 'text-slate-400'}>
                Bytes: {currentBytes}/{byteLimit}
            </span>
            {wouldExceedByteLimit && <p className="text-red-400">Añadir esta keyword superaría el límite de bytes.</p>}
         </div>
       )}
      <div className="mt-2 flex flex-wrap gap-2">
        {keywords.map((keyword) => (
          <span key={keyword} className="flex items-center bg-slate-600 text-slate-200 text-sm font-medium px-2.5 py-1 rounded-full">
            {keyword}
            <button
              type="button"
              onClick={() => handleRemoveKeyword(keyword)}
              className="ml-2 text-slate-400 hover:text-slate-200"
            >
              <Icon name="times-circle" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};
