import React from 'react';
interface CharacterCountTextInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    maxLength: number;
    criticalLength?: number;
    highlightedKeyword?: string;
    allKeywordsToHighlight?: Array<{
        name: string;
        total: number;
    }>;
}
export declare const CharacterCountTextInput: React.FC<CharacterCountTextInputProps>;
export {};
