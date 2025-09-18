import { FC } from 'react';
import { AppData, KnowledgeBaseEntry } from '../../types';
interface KnowledgeBaseAssistantButtonProps {
    appData: AppData;
    onInsert: (text: string, entry: KnowledgeBaseEntry) => void;
}
export declare const KnowledgeBaseAssistantButton: FC<KnowledgeBaseAssistantButtonProps>;
export {};
