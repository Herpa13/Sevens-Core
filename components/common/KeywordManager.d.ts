import React from 'react';
interface KeywordManagerProps {
    keywords: string[];
    onChange: (keywords: string[]) => void;
    maxKeywords?: number;
    byteLimit?: number;
}
export declare const KeywordManager: React.FC<KeywordManagerProps>;
export {};
