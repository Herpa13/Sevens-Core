import React from 'react';
interface HighlightingTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    highlightedKeyword?: string;
    allKeywordsToHighlight?: Array<{
        name: string;
        total: number;
    }>;
}
export declare const HighlightingTextArea: React.FC<HighlightingTextAreaProps>;
export {};
