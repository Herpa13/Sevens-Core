import React, { useState, useMemo } from 'react';
import type { AppData, Etiqueta, Entity, EntityType } from '../types';
import { Icon } from '../components/common/Icon';

interface EtiquetaListViewProps {
  appData: AppData;
  onSelectItem: (entityType: EntityType, item: Entity) => void;
  onAddNew: (entityType: EntityType) => void;
}

type Grouping = 'flat' | 'product';

export const EtiquetaListView: React.FC<EtiquetaListViewProps> = ({ appData, onSelectItem, onAddNew }) => {
  const [grouping, setGrouping] = useState<Grouping>('product');
  const { etiquetas, products, batches } = appData;

  const enrichedEtiquetas = useMemo(() => {
    return etiquetas.map(etiqueta => {
      const product = products.find(p => p.id === etiqueta.productId);
      const batch = batches.find(b => b.labelId === etiqueta.id);
      return {
        ...etiqueta,
        productName: product?.name || 'N/A',
        batchNumber: batch?.batchNumber || '-',
      };
    }).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [etiquetas, products, batches]);

  const groupedData = useMemo(() => {
    if (grouping === 'flat') {
      return { 'Todas las Etiquetas': enrichedEtiquetas };
    }
    const groups: Record<string, typeof enrichedEtiquetas> = {};
    enrichedEtiquetas.forEach(etiqueta => {
      const key = etiqueta.productName;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(etiqueta);
    });
    // Sort groups by name
    return Object.keys(groups).sort().reduce(
      (obj, key) => { 
        obj[key] = groups[key]; 
        return obj;
      }, 
      {} as Record<string, typeof enrichedEtiquetas>
    );
  }, [grouping, enrichedEtiquetas]);

  const renderTableRows = (items: typeof enrichedEtiquetas) => {
    return items.map(item => (
        <tr key={item.id} className="hover:bg-slate-700/50 cursor-pointer" onClick={() => onSelectItem('etiquetas', item as unknown as Entity)}>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-200">{item.identifier}</td>
            {grouping === 'flat' && <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{item.productName}</td>}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{item.batchNumber}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{new Date(item.createdAt).toLocaleDateString()}</td>
             <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{item.status}</td>
        </tr>
    ));
  };

  const GroupingButton: React.FC<{ label: string; value: Grouping; current: Grouping; onClick: (value: Grouping) => void;}> = 
  ({ label, value, current, onClick }) => (
    <button
      onClick={() => onClick(value)}
      className={`px-3 py-1.5 text-sm font-medium rounded-md ${
        current === value
          ? 'bg-cyan-500 text-slate-900'
          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-slate-700 flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-slate-200">Gestión de Etiquetas</h1>
             <div className="flex items-center space-x-2 mt-2">
                <span className="text-sm font-medium text-slate-400">Agrupar por:</span>
                <GroupingButton label="Sin agrupar" value="flat" current={grouping} onClick={setGrouping} />
                <GroupingButton label="Producto" value="product" current={grouping} onClick={setGrouping} />
            </div>
        </div>
        <button
          onClick={() => onAddNew('etiquetas')}
          className="flex items-center px-4 py-2 bg-cyan-500 text-slate-900 font-semibold rounded-md hover:bg-cyan-600"
        >
          <Icon name="plus" className="mr-2" />
          Añadir Etiqueta
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-700">
          <thead className="bg-slate-700/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Identificador</th>
              {grouping === 'flat' && <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Producto Asociado</th>}
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Lote Asociado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Fecha Creación</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Estado</th>
            </tr>
          </thead>
          <tbody className="bg-slate-800 divide-y divide-slate-700">
            {Object.entries(groupedData).map(([groupName, items]) => (
              <React.Fragment key={groupName}>
                {grouping !== 'flat' && (
                  <tr className="bg-slate-700/70">
                    <td colSpan={4} className="px-4 py-2 text-sm font-bold text-slate-300">
                      {groupName} <span className="text-xs font-normal text-slate-400">({items.length} etiquetas)</span>
                    </td>
                  </tr>
                )}
                {renderTableRows(items)}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};