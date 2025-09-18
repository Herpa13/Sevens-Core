import { FC } from 'react';
import { AppData, KnowledgeBaseEntry } from '../../types';
interface KnowledgeBaseAssistantModalProps {
    appData: AppData;
    onClose: () => void;
    onInsert: (text: string, entry: KnowledgeBaseEntry) => void;
}
export declare const KnowledgeBaseAssistantModal: FC<KnowledgeBaseAssistantModalProps>;
export {};
