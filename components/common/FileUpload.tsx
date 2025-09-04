
import React from 'react';
import { Icon } from './Icon';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  currentFileName?: string;
  accept?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, currentFileName, accept }) => {
  return (
    <div className="flex items-center space-x-2">
      <label className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm text-sm font-medium text-slate-300 hover:bg-slate-600 cursor-pointer">
        <Icon name="upload" className="mr-2" />
        Seleccionar archivo
        <input type="file" className="hidden" accept={accept} onChange={(e) => onFileSelect(e.target.files ? e.target.files[0] : null)} />
      </label>
      {currentFileName && <span className="text-sm text-slate-400">{currentFileName}</span>}
    </div>
  );
};