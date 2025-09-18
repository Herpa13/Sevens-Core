import { FC } from 'react';
import type { AppData, PromptTemplate, LanguageCode } from '../../types';
interface AIAssistantButtonProps {
    appData: AppData;
    templateCategory: PromptTemplate['category'];
    context: object;
    onResult: (result: string) => void;
    entityType: PromptTemplate['entityType'];
    targetLangCode?: LanguageCode;
}
export declare const AIAssistantButton: FC<AIAssistantButtonProps>;
export {};
