import React from 'react';
interface FileUploadProps {
    onFileSelect: (file: File | null) => void;
    currentFileName?: string;
    accept?: string;
}
export declare const FileUpload: React.FC<FileUploadProps>;
export {};
