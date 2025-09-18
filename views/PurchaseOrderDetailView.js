"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseOrderDetailView = void 0;
// FIX: Add useCallback, useEffect imports
const react_1 = __importStar(require("react"));
const FormField_1 = require("../components/common/FormField");
const TextInput_1 = require("../components/common/TextInput");
const Select_1 = require("../components/common/Select");
const CollapsibleSection_1 = require("../components/common/CollapsibleSection");
const Icon_1 = require("../components/common/Icon");
const lodash_es_1 = require("lodash-es");
const NotesSection_1 = require("../components/common/NotesSection");
const PurchaseOrderDetailView = ({ initialData, onSave, onDelete, onCancel, appData, onSelectItem, setIsDirty, setSaveHandler, onNoteAdd, onNoteUpdate, onNoteDelete }) => {
    const [data, setData] = (0, react_1.useState)(initialData);
    const handleSaveClick = (0, react_1.useCallback)((onSuccess) => {
        onSave(data);
        if (onSuccess)
            onSuccess();
    }, [data, onSave]);
    (0, react_1.useEffect)(() => {
        setData(initialData);
    }, [initialData]);
    (0, react_1.useEffect)(() => {
        setIsDirty(!(0, lodash_es_1.isEqual)(initialData, data));
    }, [data, initialData, setIsDirty]);
    (0, react_1.useEffect)(() => {
        setSaveHandler(handleSaveClick);
        return () => setSaveHandler(null);
    }, [handleSaveClick, setSaveHandler]);
    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        const isNumber = type === 'number';
        let val = isNumber ? (value === '' ? undefined : Number(value)) : value;
        let newData = { ...data, [name]: val };
        if (name === 'unitsRequested' || name === 'costPerUnit') {
            const units = name === 'unitsRequested' ? (val || 0) : newData.unitsRequested;
            const cost = name === 'costPerUnit' ? (val || 0) : newData.costPerUnit;
            newData.totalCost = units * cost;
        }
        setData(newData);
    };
    // FIX: Directly call onDelete with the entity ID. The parent handler in App.tsx will manage the logic for 'new' vs. existing entities.
    const handleDeleteClick = () => onDelete(data.id);
    const product = appData.products.find(p => p.id === data.productId);
    const batch = appData.batches.find(b => b.purchaseOrderId === data.id);
    const deliveryNotes = appData.deliveryNotes.filter(d => d.purchaseOrderId === data.id);
    const invoices = appData.invoices.filter(i => i.purchaseOrderId === data.id);
    const purchaseOrderNotes = typeof data.id === 'number' ? appData.notes.filter(n => n.entityType === 'purchaseOrders' && n.entityId === data.id) : [];
    const handleAddNote = (noteText, attachments) => {
        if (typeof data.id !== 'number')
            return;
        const newAttachments = attachments.map(f => ({ id: `temp-${Date.now()}`, name: f.name, url: URL.createObjectURL(f) }));
        onNoteAdd({
            entityType: 'purchaseOrders',
            entityId: data.id,
            text: noteText,
            attachments: newAttachments,
        });
    };
    return (<div className="bg-slate-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-slate-200 mb-6">{data.id === 'new' ? 'Nuevo Pedido de Fabricación' : `Editando Pedido: ${initialData.orderNumber}`}</h2>
      
      <CollapsibleSection_1.CollapsibleSection title="Información del Pedido" defaultOpen>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
            <FormField_1.FormField label="Número de Pedido" htmlFor="orderNumber"><TextInput_1.TextInput id="orderNumber" name="orderNumber" value={data.orderNumber} onChange={handleInputChange}/></FormField_1.FormField>
            <FormField_1.FormField label="Fabricante" htmlFor="manufacturerName"><TextInput_1.TextInput id="manufacturerName" name="manufacturerName" value={data.manufacturerName} onChange={handleInputChange}/></FormField_1.FormField>
            <FormField_1.FormField label="Estado" htmlFor="status">
                <Select_1.Select id="status" name="status" value={data.status} onChange={handleInputChange}>
                    <option value="Borrador">Borrador</option>
                    <option value="Enviado a Fabricante">Enviado a Fabricante</option>
                    <option value="Parcialmente Recibido">Parcialmente Recibido</option>
                    <option value="Completado">Completado</option>
                    <option value="Cancelado">Cancelado</option>
                </Select_1.Select>
            </FormField_1.FormField>
            <FormField_1.FormField label="Fecha de Pedido" htmlFor="orderDate"><TextInput_1.TextInput type="date" id="orderDate" name="orderDate" value={data.orderDate} onChange={handleInputChange}/></FormField_1.FormField>
            <FormField_1.FormField label="Fecha Entrega Prevista" htmlFor="expectedDeliveryDate"><TextInput_1.TextInput type="date" id="expectedDeliveryDate" name="expectedDeliveryDate" value={data.expectedDeliveryDate} onChange={handleInputChange}/></FormField_1.FormField>
        </div>
      </CollapsibleSection_1.CollapsibleSection>

      <CollapsibleSection_1.CollapsibleSection title="Detalles del Producto y Costes" defaultOpen>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
            <FormField_1.FormField label="Producto" htmlFor="productId" className="lg:col-span-3">
                <Select_1.Select id="productId" name="productId" value={data.productId} onChange={handleInputChange}>
                    <option value="">Seleccionar producto</option>
                    {appData.products.map(p => <option key={p.id} value={p.id}>{p.name} (SKU: {p.sku})</option>)}
                </Select_1.Select>
            </FormField_1.FormField>
            <FormField_1.FormField label="Unidades Pedidas" htmlFor="unitsRequested"><TextInput_1.TextInput type="number" id="unitsRequested" name="unitsRequested" value={data.unitsRequested} onChange={handleInputChange}/></FormField_1.FormField>
            <FormField_1.FormField label="Coste por Unidad" htmlFor="costPerUnit"><TextInput_1.TextInput type="number" step="0.01" id="costPerUnit" name="costPerUnit" value={data.costPerUnit} onChange={handleInputChange}/></FormField_1.FormField>
            <FormField_1.FormField label="Coste Total"><TextInput_1.TextInput type="number" id="totalCost" name="totalCost" value={data.totalCost} readOnly className="bg-slate-700/50"/></FormField_1.FormField>
        </div>
      </CollapsibleSection_1.CollapsibleSection>

      <CollapsibleSection_1.CollapsibleSection title="Lote Asociado" defaultOpen>
        <div className="p-4">
            {batch ? (<div onClick={() => onSelectItem('batches', batch)} className="bg-slate-700/50 p-3 rounded-md cursor-pointer hover:bg-slate-700">
                    <p>Lote: <span className="font-bold text-cyan-400">{batch.batchNumber}</span> - Estado: <span className="font-bold">{batch.status}</span></p>
                </div>) : <p className="text-slate-500">Este pedido aún no ha generado un lote.</p>}
        </div>
      </CollapsibleSection_1.CollapsibleSection>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <CollapsibleSection_1.CollapsibleSection title="Albaranes de Entrega" defaultOpen>
            <div className="p-2 space-y-2">
                {deliveryNotes.length > 0 ? deliveryNotes.map(dn => (<div key={dn.id} onClick={() => onSelectItem('deliveryNotes', dn)} className="bg-slate-700/50 p-3 rounded-md cursor-pointer hover:bg-slate-700 flex justify-between items-center">
                       <div>
                         <p className="font-semibold text-slate-300">{dn.deliveryNoteNumber}</p>
                         <p className="text-xs text-slate-400">Recibido: {new Date(dn.receivedDate).toLocaleDateString()} - Unidades: {dn.unitsReceived}</p>
                       </div>
                       <Icon_1.Icon name="chevron-right"/>
                     </div>)) : <p className="text-slate-500 p-2">No hay albaranes para este pedido.</p>}
            </div>
        </CollapsibleSection_1.CollapsibleSection>
         <CollapsibleSection_1.CollapsibleSection title="Facturas" defaultOpen>
            <div className="p-2 space-y-2">
                {invoices.length > 0 ? invoices.map(inv => (<div key={inv.id} onClick={() => onSelectItem('invoices', inv)} className="bg-slate-700/50 p-3 rounded-md cursor-pointer hover:bg-slate-700 flex justify-between items-center">
                        <div>
                            <p className="font-semibold text-slate-300">{inv.invoiceNumber}</p>
                            <p className="text-xs text-slate-400">Importe: {inv.amount} {inv.currency} - Estado: {inv.status}</p>
                        </div>
                        <Icon_1.Icon name="chevron-right"/>
                    </div>)) : <p className="text-slate-500 p-2">No hay facturas para este pedido.</p>}
            </div>
        </CollapsibleSection_1.CollapsibleSection>
      </div>

       <CollapsibleSection_1.CollapsibleSection title="Notas de Colaboración">
         <div className="p-4">
            {typeof data.id === 'number' ? (<NotesSection_1.NotesSection notes={purchaseOrderNotes} onAddNote={handleAddNote} onUpdateNote={onNoteUpdate} onDeleteNote={onNoteDelete}/>) : (<p className="text-slate-500 text-center py-4">Guarda el pedido para poder añadir notas.</p>)}
         </div>
      </CollapsibleSection_1.CollapsibleSection>

      <div className="mt-8 flex justify-end space-x-4">
        {data.id !== 'new' && <button onClick={handleDeleteClick} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 font-semibold">Eliminar</button>}
        <button onClick={onCancel} className="px-4 py-2 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500 font-semibold">Cancelar</button>
        <button onClick={() => handleSaveClick()} className="px-4 py-2 bg-cyan-500 text-slate-900 rounded-md hover:bg-cyan-600 font-semibold">Guardar</button>
      </div>
    </div>);
};
exports.PurchaseOrderDetailView = PurchaseOrderDetailView;
