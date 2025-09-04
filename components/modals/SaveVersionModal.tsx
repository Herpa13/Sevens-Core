import React, { useState } from 'react';
import { Icon } from '../common/Icon';
import { TextArea } from '../common/TextArea';

interface SaveVersionModalProps {
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export const SaveVersionModal: React.FC<SaveVersionModalProps> = ({ onClose, onConfirm }) => {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    if (reason.trim()) {
      onConfirm(reason.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-lg border border-slate-700">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-slate-200 flex items-center">
            <Icon name="history" className="mr-3 text-cyan-400" />
            Crear Nueva Versión de Contenido
          </h3>
          <p className="text-sm text-slate-400 mt-2">
            Se han detectado cambios en el contenido versionado de Amazon. Para guardar un registro histórico, por favor introduce un motivo para este cambio.
          </p>
          <div className="mt-4">
            <TextArea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ej: Optimización SEO de título y BPs para campaña de invierno..."
              rows={4}
              autoFocus
            />
          </div>
        </div>
        <div className="p-4 bg-slate-700/50 flex justify-end space-x-2 rounded-b-lg">
          <button onClick={onClose} className="px-4 py-2 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500 font-semibold">
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!reason.trim()}
            className="px-4 py-2 bg-cyan-500 text-slate-900 rounded-md hover:bg-cyan-600 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Guardar Nueva Versión
          </button>
        </div>
      </div>
    </div>
  );
};
