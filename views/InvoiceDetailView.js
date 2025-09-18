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
exports.InvoiceDetailView = void 0;
// FIX: Add useCallback, useEffect imports
const react_1 = __importStar(require("react"));
const FormField_1 = require("../components/common/FormField");
const TextInput_1 = require("../components/common/TextInput");
const Select_1 = require("../components/common/Select");
const FileUpload_1 = require("../components/common/FileUpload");
const lodash_es_1 = require("lodash-es");
const InvoiceDetailView = ({ initialData, onSave, onDelete, onCancel, appData, setIsDirty, setSaveHandler }) => {
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
        setData(prev => ({ ...prev, [name]: isNumber ? Number(value) : value }));
    };
    const handleDeleteClick = () => onDelete(data.id);
    return (<div className="bg-slate-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-slate-200 mb-6">{data.id === 'new' ? 'Nueva Factura de Fabricante' : `Editando Factura: ${initialData.invoiceNumber}`}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField_1.FormField label="Pedido de Fabricación Asociado" htmlFor="purchaseOrderId">
          <Select_1.Select id="purchaseOrderId" name="purchaseOrderId" value={data.purchaseOrderId} onChange={handleInputChange}>
            <option value="">Seleccionar pedido</option>
            {appData.purchaseOrders.map(p => <option key={p.id} value={p.id}>{p.orderNumber} - {appData.products.find(prod => prod.id === p.productId)?.name}</option>)}
          </Select_1.Select>
        </FormField_1.FormField>
        <FormField_1.FormField label="Número de Factura" htmlFor="invoiceNumber">
          <TextInput_1.TextInput id="invoiceNumber" name="invoiceNumber" value={data.invoiceNumber} onChange={handleInputChange}/>
        </FormField_1.FormField>
        <FormField_1.FormField label="Importe" htmlFor="amount">
          <TextInput_1.TextInput type="number" step="0.01" id="amount" name="amount" value={data.amount} onChange={handleInputChange}/>
        </FormField_1.FormField>
         <FormField_1.FormField label="Moneda" htmlFor="currency">
          <TextInput_1.TextInput id="currency" name="currency" value={data.currency} onChange={handleInputChange}/>
        </FormField_1.FormField>
        <FormField_1.FormField label="Fecha de Emisión" htmlFor="issueDate">
          <TextInput_1.TextInput type="date" id="issueDate" name="issueDate" value={data.issueDate} onChange={handleInputChange}/>
        </FormField_1.FormField>
        <FormField_1.FormField label="Fecha de Vencimiento" htmlFor="dueDate">
          <TextInput_1.TextInput type="date" id="dueDate" name="dueDate" value={data.dueDate} onChange={handleInputChange}/>
        </FormField_1.FormField>
        <FormField_1.FormField label="Estado de Pago" htmlFor="status">
          <Select_1.Select id="status" name="status" value={data.status} onChange={handleInputChange}>
            <option value="Pendiente de Pago">Pendiente de Pago</option>
            <option value="Pagada">Pagada</option>
            <option value="Vencida">Vencida</option>
          </Select_1.Select>
        </FormField_1.FormField>
        <FormField_1.FormField label="Documento de la Factura" htmlFor="documentUrl" className="md:col-span-2">
            <FileUpload_1.FileUpload onFileSelect={(file) => {
            if (file)
                setData(prev => ({ ...prev, documentUrl: URL.createObjectURL(file) }));
        }} currentFileName={data.documentUrl}/>
        </FormField_1.FormField>
      </div>

      <div className="mt-8 flex justify-end space-x-4">
        {data.id !== 'new' && <button onClick={handleDeleteClick} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 font-semibold">Eliminar</button>}
        <button onClick={onCancel} className="px-4 py-2 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500 font-semibold">Cancelar</button>
        <button onClick={() => handleSaveClick()} className="px-4 py-2 bg-cyan-500 text-slate-900 rounded-md hover:bg-cyan-600 font-semibold">Guardar</button>
      </div>
    </div>);
};
exports.InvoiceDetailView = InvoiceDetailView;
