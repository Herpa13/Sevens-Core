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
exports.BatchDetailView = void 0;
// FIX: Add useCallback to imports
const react_1 = __importStar(require("react"));
const FormField_1 = require("../components/common/FormField");
const TextInput_1 = require("../components/common/TextInput");
const Select_1 = require("../components/common/Select");
const Icon_1 = require("../components/common/Icon");
const CollapsibleSection_1 = require("../components/common/CollapsibleSection");
const FileUpload_1 = require("../components/common/FileUpload");
const ApplySchemaModal_1 = require("../components/modals/ApplySchemaModal");
const lodash_es_1 = require("lodash-es");
const NotesSection_1 = require("../components/common/NotesSection");
const BatchDetailView = ({ initialData, onSave, onDelete, onCancel, appData, onApplySchema, onSelectItem, setIsDirty, setSaveHandler, onNoteAdd, onNoteUpdate, onNoteDelete }) => {
    const [data, setData] = (0, react_1.useState)(initialData);
    const [isSchemaModalOpen, setIsSchemaModalOpen] = (0, react_1.useState)(false);
    const [activeTab, setActiveTab] = (0, react_1.useState)('main');
    const handleSaveClick = (0, react_1.useCallback)((onSuccess) => {
        onSave(data);
        if (onSuccess) {
            onSuccess();
        }
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
        const isNumber = type === 'number' || ['labelId', 'productId', 'purchaseOrderId'].includes(name);
        const finalValue = isNumber ? (value ? Number(value) : undefined) : value;
        if (name === 'purchaseOrderId') {
            const order = appData.purchaseOrders.find(p => p.id === finalValue);
            setData(prev => ({
                ...prev,
                purchaseOrderId: finalValue,
                productId: order ? order.productId : 0, // Automatically set product
            }));
        }
        else {
            setData(prev => ({ ...prev, [name]: finalValue }));
        }
    };
    const handleFileChange = (file, field) => {
        if (file) {
            const newDoc = {
                name: file.name,
                url: URL.createObjectURL(file) // Placeholder for real upload
            };
            setData(prev => ({ ...prev, [field]: newDoc }));
        }
    };
    const handleFileRemove = (field) => {
        setData(prev => ({ ...prev, [field]: undefined }));
    };
    const handleDeleteClick = () => onDelete(data.id);
    const handleApplySchemaClick = (schema) => {
        onApplySchema(schema, { id: data.id, type: 'batches', name: data.batchNumber });
        setIsSchemaModalOpen(false);
    };
    const handleAddNote = (noteText, attachments) => {
        if (typeof data.id !== 'number')
            return;
        const newAttachments = attachments.map(f => ({ id: `temp-${Date.now()}`, name: f.name, url: URL.createObjectURL(f) }));
        onNoteAdd({
            entityType: 'batches',
            entityId: data.id,
            text: noteText,
            attachments: newAttachments,
        });
    };
    const associatedOrder = appData.purchaseOrders.find(p => p.id === data.purchaseOrderId);
    const availableLabels = appData.etiquetas.filter(e => e.productId === data.productId);
    // Fix: Property 'triggerEntityType' does not exist on type 'TaskSchema'. Changed to 'trigger.entityType'.
    const relevantSchemas = appData.taskSchemas.filter(s => s.trigger.entityType === 'batches');
    const linkedTasks = appData.tasks.filter(t => t.linkedEntity.entityType === 'batches' && t.linkedEntity.entityId === data.id);
    const batchNotes = typeof data.id === 'number' ? appData.notes.filter(n => n.entityType === 'batches' && n.entityId === data.id) : [];
    const TabButton = ({ title, icon, isActive, onClick }) => (<button onClick={onClick} className={`flex items-center space-x-2 py-2 px-4 text-sm font-medium rounded-t-lg border-b-2
            ${isActive
            ? 'border-cyan-500 text-cyan-400 bg-slate-900'
            : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600'}`}>
        <Icon_1.Icon name={icon}/>
        <span>{title}</span>
    </button>);
    return (<div className="bg-slate-800 rounded-lg">
      {isSchemaModalOpen && (<ApplySchemaModal_1.ApplySchemaModal schemas={relevantSchemas} onApply={handleApplySchemaClick} onClose={() => setIsSchemaModalOpen(false)} entityName={data.batchNumber}/>)}
      <div className="p-4 sm:p-6 border-b border-slate-700 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-200">{data.id === 'new' ? 'Nuevo Lote' : `Editando Lote: ${initialData.batchNumber}`}</h2>
        <div className="flex items-center space-x-2">
            {data.id !== 'new' && relevantSchemas.length > 0 && (<button onClick={() => setIsSchemaModalOpen(true)} className="flex items-center px-4 py-2 bg-indigo-500 text-white font-semibold rounded-md hover:bg-indigo-600">
                    <Icon_1.Icon name="project-diagram" className="mr-2"/>
                    Aplicar Esquema de Trabajo
                </button>)}
            {data.id !== 'new' && <button onClick={handleDeleteClick} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 font-semibold">Eliminar</button>}
            <button onClick={onCancel} className="px-4 py-2 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500 font-semibold">Cancelar</button>
            <button onClick={() => handleSaveClick()} className="px-4 py-2 bg-cyan-500 text-slate-900 rounded-md hover:bg-cyan-600 font-semibold">Guardar</button>
        </div>
      </div>

       <div className="border-b border-slate-700 bg-slate-800 px-4">
        <nav className="-mb-px flex space-x-4" aria-label="Tabs">
          <TabButton title="Principal" icon="file-alt" isActive={activeTab === 'main'} onClick={() => setActiveTab('main')}/>
          <TabButton title="Notas" icon="sticky-note" isActive={activeTab === 'notes'} onClick={() => setActiveTab('notes')}/>
        </nav>
      </div>

      <div className="p-6 bg-slate-900 rounded-b-lg">
        {activeTab === 'main' && (<div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField_1.FormField label="Pedido de Fabricación Asociado" htmlFor="purchaseOrderId">
                        <Select_1.Select id="purchaseOrderId" name="purchaseOrderId" value={data.purchaseOrderId} onChange={handleInputChange}>
                            <option value="">Seleccionar pedido</option>
                            {appData.purchaseOrders.map(po => {
                const product = appData.products.find(p => p.id === po.productId);
                return <option key={po.id} value={po.id}>{po.orderNumber} ({product?.name})</option>;
            })}
                        </Select_1.Select>
                    </FormField_1.FormField>
                    <FormField_1.FormField label="Número de Lote" htmlFor="batchNumber">
                        <TextInput_1.TextInput id="batchNumber" name="batchNumber" value={data.batchNumber} onChange={handleInputChange}/>
                    </FormField_1.FormField>
                    <FormField_1.FormField label="Estado" htmlFor="status">
                        <Select_1.Select id="status" name="status" value={data.status} onChange={handleInputChange}>
                            <option value="En producción">En producción</option>
                            <option value="En tránsito">En tránsito</option>
                            <option value="Disponible">Disponible</option>
                            <option value="Agotado">Agotado</option>
                        </Select_1.Select>
                    </FormField_1.FormField>
                    <FormField_1.FormField label="Producto (del Pedido)">
                        <TextInput_1.TextInput readOnly value={appData.products.find(p => p.id === data.productId)?.name || 'Selecciona un pedido'}/>
                    </FormField_1.FormField>
                    <FormField_1.FormField label="Fecha de Fabricación" htmlFor="manufacturingDate">
                        <TextInput_1.TextInput type="date" id="manufacturingDate" name="manufacturingDate" value={data.manufacturingDate} onChange={handleInputChange}/>
                    </FormField_1.FormField>
                    <FormField_1.FormField label="Fecha de Caducidad" htmlFor="expiryDate">
                        <TextInput_1.TextInput type="date" id="expiryDate" name="expiryDate" value={data.expiryDate || ''} onChange={handleInputChange}/>
                    </FormField_1.FormField>
                </div>
                <CollapsibleSection_1.CollapsibleSection title="Unidades y Costes">
                    <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField_1.FormField label="Unidades Fabricadas" htmlFor="unitsManufactured">
                            <TextInput_1.TextInput type="number" id="unitsManufactured" name="unitsManufactured" value={data.unitsManufactured} onChange={handleInputChange}/>
                        </FormField_1.FormField>
                        <FormField_1.FormField label="Unidades Disponibles" htmlFor="unitsAvailable">
                            <TextInput_1.TextInput type="number" id="unitsAvailable" name="unitsAvailable" value={data.unitsAvailable} onChange={handleInputChange}/>
                        </FormField_1.FormField>
                        <FormField_1.FormField label="Coste por Unidad (del Pedido)">
                            <TextInput_1.TextInput readOnly value={associatedOrder?.costPerUnit.toFixed(2) || 'N/A'}/>
                        </FormField_1.FormField>
                    </div>
                </CollapsibleSection_1.CollapsibleSection>
                <CollapsibleSection_1.CollapsibleSection title="Documentos y Etiqueta">
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField_1.FormField label="Ficha Técnica">
                            {data.technicalDataSheet ? (<div className="flex items-center justify-between bg-slate-700/50 p-2 rounded-md">
                                    <a href={data.technicalDataSheet.url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">{data.technicalDataSheet.name}</a>
                                    <button onClick={() => handleFileRemove('technicalDataSheet')} className="text-red-400 hover:text-red-300"><Icon_1.Icon name="trash"/></button>
                                </div>) : <FileUpload_1.FileUpload onFileSelect={(file) => handleFileChange(file, 'technicalDataSheet')}/>}
                        </FormField_1.FormField>
                        <FormField_1.FormField label="Certificado de Fabricación">
                            {data.manufacturingCertificate ? (<div className="flex items-center justify-between bg-slate-700/50 p-2 rounded-md">
                                    <a href={data.manufacturingCertificate.url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">{data.manufacturingCertificate.name}</a>
                                    <button onClick={() => handleFileRemove('manufacturingCertificate')} className="text-red-400 hover:text-red-300"><Icon_1.Icon name="trash"/></button>
                                </div>) : <FileUpload_1.FileUpload onFileSelect={(file) => handleFileChange(file, 'manufacturingCertificate')}/>}
                        </FormField_1.FormField>
                         <FormField_1.FormField label="Etiqueta Asociada" htmlFor="labelId" className="md:col-span-2">
                            <Select_1.Select id="labelId" name="labelId" value={data.labelId || ''} onChange={handleInputChange}>
                                <option value="">Ninguna etiqueta</option>
                                {availableLabels.map(l => <option key={l.id} value={l.id}>{l.identifier}</option>)}
                            </Select_1.Select>
                        </FormField_1.FormField>
                    </div>
                </CollapsibleSection_1.CollapsibleSection>
                <CollapsibleSection_1.CollapsibleSection title="Tareas Vinculadas">
                    <div className="p-4">
                        {linkedTasks.length > 0 ? (<ul className="space-y-2">
                                {linkedTasks.map(task => (<li key={task.id} onClick={() => onSelectItem('tasks', task)} className="bg-slate-700/50 p-2 rounded-md cursor-pointer hover:bg-slate-700">
                                        <p className="font-semibold text-slate-200">{task.name}</p>
                                        <p className="text-sm text-slate-400">{task.status}</p>
                                    </li>))}
                            </ul>) : (<p className="text-slate-500 text-center">No hay tareas vinculadas a este lote.</p>)}
                    </div>
                </CollapsibleSection_1.CollapsibleSection>
            </div>)}
        {activeTab === 'notes' && (<NotesSection_1.NotesSection notes={batchNotes} onAddNote={handleAddNote} onUpdateNote={onNoteUpdate} onDeleteNote={onNoteDelete}/>)}
      </div>
    </div>);
};
exports.BatchDetailView = BatchDetailView;
