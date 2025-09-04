

import React from 'react';
import type { ChangeDetail } from '../../types';
import { Icon } from '../common/Icon';
import { CollapsibleSection } from '../common/CollapsibleSection';

// -- START LOCAL INTERFACES --
// These interfaces define the detailed structure for the preview
export interface ImportError {
  rowNumber: number;
  message: string;
  rowContent: Record<string, any>;
}

export interface UpdatePreview {
  oldData: any;
  newData: any;
  changes: ChangeDetail[];
}

export interface ImportPreviewState {
  creations: any[];
  updates: UpdatePreview[];
  errors: ImportError[];
  templateId: number;
}
// -- END LOCAL INTERFACES --

interface ImportPreviewModalProps {
  previewState: ImportPreviewState;
  onClose: () => void;
  onConfirm: (previewState: ImportPreviewState) => void;
}

// -- START LOCAL COMPONENTS --
// Helper components to render the detailed preview information

const ValueDisplay: React.FC<{ value: any }> = ({ value }) => {
    if (value === null || value === undefined || value === 'vacío' || value === '') {
        return <i className="text-slate-500">vacío</i>;
    }
    if (typeof value === 'boolean') {
        return <span className={`font-semibold ${value ? 'text-green-400' : 'text-red-400'}`}>{value ? 'Sí' : 'No'}</span>;
    }
    if (Array.isArray(value)) {
        const displayValue = `[${value.join(', ')}]`;
        return <span className="text-slate-400 text-xs bg-slate-700 p-1 rounded-md" title={displayValue}>{displayValue.length > 50 ? `${displayValue.substring(0, 50)}...` : displayValue}</span>;
    }
    const strValue = String(value);
    if (strValue.length > 50) {
        return <span className="text-slate-300" title={strValue}>{strValue.substring(0, 50)}...</span>;
    }
    return <span className="text-slate-300">{strValue}</span>;
};

const ErrorDetailItem: React.FC<{ error: ImportError }> = ({ error }) => (
    <CollapsibleSection title={`Fila ${error.rowNumber}: ${error.message}`}>
      <div className="bg-slate-900 p-2 rounded-md">
        <h5 className="text-xs font-bold text-slate-400 mb-1">Datos de la Fila con Error:</h5>
        <pre className="text-xs text-slate-300 overflow-x-auto">
            {JSON.stringify(error.rowContent, null, 2)}
        </pre>
      </div>
    </CollapsibleSection>
);

const UpdateDetailItem: React.FC<{ update: UpdatePreview }> = ({ update }) => (
    <CollapsibleSection title={update.oldData.name || update.oldData.batchNumber || `ID: ${update.oldData.id}`}>
        <table className="min-w-full text-sm">
            <thead className="border-b-2 border-slate-700">
                <tr>
                    <th className="text-left font-semibold p-2 w-1/3">Campo</th>
                    <th className="text-left font-semibold p-2 w-1/3">Valor Anterior</th>
                    <th className="text-left font-semibold p-2 w-1/3">Nuevo Valor</th>
                </tr>
            </thead>
            <tbody>
                {update.changes.map((change, i) => (
                    <tr key={i} className="border-b border-slate-700/50">
                        <td className="p-2 text-slate-400 font-medium">{change.fieldName}</td>
                        <td className="p-2 font-mono"><ValueDisplay value={change.oldValue} /></td>
                        <td className="p-2 font-mono"><ValueDisplay value={change.newValue} /></td>
                    </tr>
                ))}
            </tbody>
        </table>
    </CollapsibleSection>
);
// -- END LOCAL COMPONENTS --

export const ImportPreviewModal: React.FC<ImportPreviewModalProps> = ({ previewState, onClose, onConfirm }) => {
  const { creations, updates, errors } = previewState;
  const hasErrors = errors.length > 0;
  const hasChanges = creations.length > 0 || updates.length > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-4xl border border-slate-700 max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center flex-shrink-0">
          <h3 className="text-lg font-semibold text-slate-200">Previsualización de Importación</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><Icon name="times" /></button>
        </div>
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto">
          {hasErrors && (
            <CollapsibleSection title={`Se encontraron ${errors.length} Errores`} defaultOpen>
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <p className="text-xs text-red-400/70 mb-3">Las filas con errores serán ignoradas. Por favor, revisa tu fichero para corregirlas.</p>
                    <div className="space-y-2">
                        {errors.map((error, i) => <ErrorDetailItem key={i} error={error} />)}
                    </div>
                </div>
            </CollapsibleSection>
          )}
          
          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <h4 className="font-bold text-blue-300 flex items-center"><Icon name="info-circle" className="mr-2"/> Resumen de Cambios</h4>
            <p className="text-sm mt-2">Se van a realizar las siguientes operaciones:</p>
            <ul className="list-disc list-inside mt-2 text-sm">
                {creations.length > 0 && <li><strong className="text-green-300">{creations.length}</strong> registros a crear.</li>}
                {updates.length > 0 && <li><strong className="text-yellow-300">{updates.length}</strong> registros a actualizar.</li>}
                {errors.length > 0 && <li><strong className="text-red-300">{errors.length}</strong> filas con errores serán ignoradas.</li>}
                {!hasChanges && <li>No se detectaron cambios para importar.</li>}
            </ul>
          </div>

          {updates.length > 0 && (
            <CollapsibleSection title={`Detalle de Actualizaciones (${updates.length})`}>
                <div className="space-y-2">
                    {updates.map((upd, i) => (
                        <UpdateDetailItem key={i} update={upd} />
                    ))}
                </div>
            </CollapsibleSection>
          )}

        </div>
        <div className="p-4 border-t border-slate-700 flex justify-end space-x-2 flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500">
            Cancelar
          </button>
          <button 
            onClick={() => onConfirm(previewState)}
            disabled={!hasChanges}
            className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon name="check" className="mr-2" />
            Confirmar e Importar {hasChanges ? `(${creations.length + updates.length})` : ''}
          </button>
        </div>
      </div>
    </div>
  );
};