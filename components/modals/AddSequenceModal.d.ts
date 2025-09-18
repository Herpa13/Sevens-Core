import React from 'react';
import type { AppData, ProjectSequence } from '../../types';
interface AddSequenceModalProps {
    appData: AppData;
    onClose: () => void;
    onAdd: (newSequence: Omit<ProjectSequence, 'id' | 'order' | 'transitionToNext'>) => void;
}
export declare const AddSequenceModal: React.FC<AddSequenceModalProps>;
export {};
