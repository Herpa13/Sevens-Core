import { FC } from 'react';
import type { MediaAsset, ProjectSequence } from '../../types';
interface SaveSequenceToLibraryModalProps {
    sequence: ProjectSequence;
    onClose: () => void;
    onSave: (assetData: Omit<MediaAsset, 'id'>) => void;
}
export declare const SaveSequenceToLibraryModal: FC<SaveSequenceToLibraryModalProps>;
export {};
