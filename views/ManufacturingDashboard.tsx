import React from 'react';
import type { AppData, EntityType, Entity } from '../types';
import { CollapsibleSection } from '../components/common/CollapsibleSection';
import { Icon } from '../components/common/Icon';

interface ManufacturingDashboardProps {
  appData: AppData;
  onSelectItem: (entityType: EntityType, item: Entity) => void;
  onAddNew: (entityType: EntityType) => void;
}

export const ManufacturingDashboard: React.FC<ManufacturingDashboardProps> = ({ appData, onSelectItem, onAddNew }) => {
  const { purchaseOrders, products, batches, deliveryNotes, invoices } = appData;

  const sortedOrders = [...purchaseOrders].sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());

  return (
    <div className="bg-slate-800 rounded-lg">
      <div className="p-4 sm:p-6 border-b border-slate-700 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-200">Visión General de Fabricación</h1>
        <button
          onClick={() => onAddNew('purchaseOrders')}
          className="flex items-center px-4 py-2 bg-cyan-500 text-slate-900 font-semibold rounded-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500"
        >
          <Icon name="plus" className="mr-2" />
          Nuevo Pedido
        </button>
      </div>
      <div className="p-4 sm:p-6 space-y-4">
        {sortedOrders.map(order => {
          const product = products.find(p => p.id === order.productId);
          const orderBatch = batches.find(b => b.purchaseOrderId === order.id);
          const orderDeliveryNotes = deliveryNotes.filter(d => d.purchaseOrderId === order.id);
          const orderInvoices = invoices.filter(i => i.purchaseOrderId === order.id);
          const totalReceived = orderDeliveryNotes.reduce((acc, note) => acc + note.unitsReceived, 0);

          return (
            <CollapsibleSection
              key={order.id}
              title={
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center">
                    <span className="font-bold text-slate-200">{order.orderNumber}</span>
                    <span className="text-sm text-slate-400 mx-2">-</span>
                    <span className="text-sm text-cyan-400">{product?.name || 'Producto Desconocido'}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${order.status === 'Completado' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                      {order.status}
                    </span>
                    <span className="text-sm text-slate-300">{new Date(order.orderDate).toLocaleDateString()}</span>
                  </div>
                </div>
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Order Details */}
                <div className="bg-slate-700/50 p-3 rounded-md">
                  <h4 className="font-semibold text-slate-300 mb-2">Detalles del Pedido</h4>
                  <p className="text-sm text-slate-400"><strong>Unidades:</strong> {order.unitsRequested}</p>
                  <p className="text-sm text-slate-400"><strong>Coste Total:</strong> {order.totalCost.toFixed(2)}€</p>
                  <p className="text-sm text-slate-400"><strong>Fabricante:</strong> {order.manufacturerName}</p>
                  <button onClick={() => onSelectItem('purchaseOrders', order)} className="text-xs text-cyan-400 hover:underline mt-2">Ver/Editar Pedido &rarr;</button>
                </div>

                {/* Batch Details */}
                <div className="bg-slate-700/50 p-3 rounded-md">
                  <h4 className="font-semibold text-slate-300 mb-2">Lote Asociado</h4>
                  {orderBatch ? (
                    <>
                      <p className="text-sm text-slate-400"><strong>Número:</strong> {orderBatch.batchNumber}</p>
                      <p className="text-sm text-slate-400"><strong>Estado:</strong> {orderBatch.status}</p>
                      <p className="text-sm text-slate-400"><strong>Unidades:</strong> {orderBatch.unitsAvailable} / {orderBatch.unitsManufactured}</p>
                      <button onClick={() => onSelectItem('batches', orderBatch)} className="text-xs text-cyan-400 hover:underline mt-2">Ver/Editar Lote &rarr;</button>
                    </>
                  ) : <p className="text-sm text-slate-500">Sin lote generado.</p>}
                </div>

                {/* Delivery & Invoices */}
                <div className="bg-slate-700/50 p-3 rounded-md">
                   <h4 className="font-semibold text-slate-300 mb-2">Documentos</h4>
                   <p className="text-sm text-slate-400"><strong>Albaranes:</strong> {orderDeliveryNotes.length}</p>
                   <p className="text-sm text-slate-400"><strong>Facturas:</strong> {orderInvoices.length}</p>
                   <p className="text-sm text-slate-400"><strong>Unidades Recibidas:</strong> {totalReceived}</p>
                </div>
              </div>
            </CollapsibleSection>
          )
        })}
      </div>
    </div>
  );
};
