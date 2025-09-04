
import React from 'react';
import { Icon } from '../common/Icon';
import { CollapsibleSection } from '../common/CollapsibleSection';

interface HelpModalProps {
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-3xl border border-slate-700 max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-slate-700 flex justify-between items-center flex-shrink-0">
          <h3 className="text-lg font-semibold text-slate-200 flex items-center">
            <Icon name="question-circle" className="mr-3 text-cyan-400"/>
            Guía de Uso de Publication 2.0
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><Icon name="times" /></button>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto">
          <CollapsibleSection title="Concepto Básico: Paneles y Mapeo" defaultOpen>
            <p className="text-sm text-slate-300 mb-2">
              La interfaz se divide en dos paneles principales:
            </p>
            <ul className="list-disc list-inside text-sm space-y-2">
              <li><strong>Paleta de Datos (Izquierda):</strong> Contiene todos los campos disponibles de tu producto, con datos de ejemplo para que sepas qué contiene cada campo. Puedes usar el buscador para encontrar rápidamente lo que necesitas.</li>
              <li><strong>Lienzo de Publicación (Derecha):</strong> Aquí construyes la estructura de tu fichero de exportación. Cada fila representa una columna en el CSV final.</li>
            </ul>
            <p className="text-sm text-slate-300 mt-4">
              La acción principal es <strong>arrastrar y soltar</strong>. Simplemente arrastra un campo desde la "Paleta de Datos" y suéltalo sobre una columna en el "Lienzo" para mapearlo.
            </p>
          </CollapsibleSection>

          <CollapsibleSection title="Tipos de Mapeo en las Columnas" defaultOpen>
            <p className="text-sm text-slate-300 mb-2">
              Cada columna en tu lienzo puede tener uno de tres tipos de contenido:
            </p>
            <ul className="list-disc list-inside text-sm space-y-3">
              <li>
                <strong className="text-cyan-300">Mapeado (Mapped):</strong> El valor se toma directamente de un campo del producto. Se identifica por el icono <Icon name="link"/> y el placeholder (ej: <code>{`{product.name}`}</code>). Se crea al arrastrar y soltar desde la paleta de datos.
              </li>
              <li>
                <strong className="text-slate-300">Estático (Static):</strong> El valor es un texto fijo que tú escribes. Será el mismo para todas las filas exportadas (ej: "España"). Puedes escribir directamente en el campo o usar el botón <Icon name="font"/>.
              </li>
              <li>
                <strong className="text-yellow-300">Fórmula (Formula):</strong> El valor es el resultado de una combinación de texto, placeholders y funciones. Se identifica por el icono <Icon name="calculator"/> y se edita con el botón <i>fx</i>.
              </li>
            </ul>
          </CollapsibleSection>

          <CollapsibleSection title="Editor de Fórmulas y Funciones" defaultOpen>
            <p className="text-sm text-slate-300 mb-2">
              El editor de fórmulas te permite transformar tus datos. Puedes combinar texto y placeholders, por ejemplo: <code>Mi producto se llama {`{product.name}`}</code>. Además, puedes usar las siguientes funciones:
            </p>
            <ul className="space-y-3 text-sm mt-3">
              <li className="p-2 bg-slate-700/50 rounded-md">
                <code className="font-bold text-yellow-300">TRUNCATE(texto, longitud)</code>
                <p className="text-xs text-slate-400">Acorta un texto a una longitud máxima. <strong>Ej:</strong> <code>TRUNCATE({`{product.name}`}, 50)</code></p>
              </li>
              <li className="p-2 bg-slate-700/50 rounded-md">
                <code className="font-bold text-yellow-300">UPPERCASE(texto)</code>
                <p className="text-xs text-slate-400">Convierte el texto a mayúsculas. <strong>Ej:</strong> <code>UPPERCASE({`{product.name}`})</code></p>
              </li>
              <li className="p-2 bg-slate-700/50 rounded-md">
                <code className="font-bold text-yellow-300">REPLACE(texto, buscar, reemplazar)</code>
                <p className="text-xs text-slate-400">Reemplaza una parte del texto por otra. <strong>Ej:</strong> <code>REPLACE({`{product.beneficiosGenericos}`}, ",", " | ")</code></p>
              </li>
              <li className="p-2 bg-slate-700/50 rounded-md">
                <code className="font-bold text-yellow-300">STRIP_HTML(texto_html)</code>
                <p className="text-xs text-slate-400">Elimina todas las etiquetas HTML de un texto. Muy útil para descripciones.</p>
              </li>
               <li className="p-2 bg-slate-700/50 rounded-md">
                <code className="font-bold text-yellow-300">IF(condicion, valor_si_verdadero, valor_si_falso)</code>
                <p className="text-xs text-slate-400">Permite lógica condicional. <strong>Ej:</strong> <code>IF({`{product.format}`} == "Capsula", "cápsulas", "servicios")</code></p>
              </li>
            </ul>
          </CollapsibleSection>
        </div>
        <div className="p-4 border-t border-slate-700 flex justify-end space-x-2 flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2 bg-cyan-500 text-slate-900 font-semibold rounded-md hover:bg-cyan-600">
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
