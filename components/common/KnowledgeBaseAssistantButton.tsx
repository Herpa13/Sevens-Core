import React, { useState, FC } from 'react';
import { Icon } from './Icon';
import { AppData, KnowledgeBaseEntry } from '../../types';
import { KnowledgeBaseAssistantModal } from '../modals/KnowledgeBaseAssistantModal';

interface KnowledgeBaseAssistantButtonProps {
    appData: AppData;
    onInsert: (text: string, entry: KnowledgeBaseEntry) => void;
}

export const KnowledgeBaseAssistantButton: FC<KnowledgeBaseAssistantButtonProps> = ({ appData, onInsert }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSelect = (text: string, entry: KnowledgeBaseEntry) => {
        onInsert(text, entry);
        setIsModalOpen(false);
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="p-2 text-cyan-400 bg-slate-700 rounded-md hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500"
                title="Asistente de Contenido"
            >
                <Icon name="book" />
            </button>
            {isModalOpen && (
                <KnowledgeBaseAssistantModal
                    appData={appData}
                    onClose={() => setIsModalOpen(false)}
                    onInsert={handleSelect}
                />
            )}
        </>
    );
};
