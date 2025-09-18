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
exports.ProductNotificationDetailView = void 0;
// FIX: Add useCallback to imports
const react_1 = __importStar(require("react"));
const FormField_1 = require("../components/common/FormField");
const TextInput_1 = require("../components/common/TextInput");
const Select_1 = require("../components/common/Select");
const TextArea_1 = require("../components/common/TextArea");
const CountrySelector_1 = require("../components/common/CountrySelector");
const CollapsibleSection_1 = require("../components/common/CollapsibleSection");
const DocumentManager_1 = require("../components/common/DocumentManager");
const AuditLogDisplay_1 = require("../components/common/AuditLogDisplay");
const Icon_1 = require("../components/common/Icon");
const lodash_es_1 = require("lodash-es");
const TabButton = ({ title, icon, isActive, onClick }) => (<button onClick={onClick} className={`flex items-center space-x-2 py-2 px-4 text-sm font-medium rounded-t-lg border-b-2
            ${isActive
        ? 'border-cyan-500 text-cyan-400 bg-slate-900'
        : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600'}`}>
        <Icon_1.Icon name={icon}/>
        <span>{title}</span>
    </button>);
const ProductNotificationDetailView = ({ initialData, onSave, onDelete, onCancel, appData, setIsDirty, setSaveHandler }) => {
    const [data, setData] = (0, react_1.useState)(initialData);
    const [activeTab, setActiveTab] = (0, react_1.useState)('main');
    // FIX: Wrap handleSaveClick in useCallback
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
    // FIX: Add useEffect for setSaveHandler
    (0, react_1.useEffect)(() => {
        setSaveHandler(() => handleSaveClick());
        return () => setSaveHandler(null);
    }, [handleSaveClick, setSaveHandler]);
    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        setData(prev => ({ ...prev, [name]: type === 'number' ? (value === '' ? undefined : Number(value)) : value }));
    };
    // FIX: Directly call onDelete with the entity ID. The parent handler in App.tsx will manage the logic for 'new' vs. existing entities.
    const handleDeleteClick = () => onDelete(data.id);
    const getEntityName = () => {
        const productName = appData.products.find(p => p.id === data.productId)?.name || `Producto ID ${data.productId}`;
        const countryName = appData.countries.find(c => c.id === data.countryId)?.name || `País ID ${data.countryId}`;
        return `${productName} - ${countryName}`;
    };
    const MainTab = () => (<>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField_1.FormField label="Producto" htmlFor="productId">
            <Select_1.Select id="productId" name="productId" value={data.productId} onChange={handleInputChange}>
                <option value="">Seleccionar producto</option>
                {appData.products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </Select_1.Select>
            </FormField_1.FormField>
            <FormField_1.FormField label="País" htmlFor="countryId">
                <CountrySelector_1.CountrySelector countries={appData.countries} selectedCountryId={data.countryId} onChange={(id) => setData(p => ({ ...p, countryId: id }))}/>
            </FormField_1.FormField>
            <FormField_1.FormField label="Estado" htmlFor="status">
            <Select_1.Select id="status" name="status" value={data.status} onChange={handleInputChange}>
                <option value="Pendiente">Pendiente</option>
                <option value="En proceso">En proceso</option>
                <option value="Notificado">Notificado</option>
                <option value="No necesario">No necesario</option>
                <option value="Espera de decision">Espera de decisión</option>
                <option value="No Notificable">No Notificable</option>
                <option value="Pendiente nueva notificación">Pendiente nueva notificación</option>
            </Select_1.Select>
            </FormField_1.FormField>
            <FormField_1.FormField label="Notificado por" htmlFor="notifiedBy">
            <Select_1.Select id="notifiedBy" name="notifiedBy" value={data.notifiedBy} onChange={handleInputChange}>
                <option value="">Seleccionar</option>
                <option value="Interno">Interno</option>
                <option value="Agencia Externa">Agencia Externa</option>
            </Select_1.Select>
            </FormField_1.FormField>
            {data.notifiedBy === 'Agencia Externa' && (<FormField_1.FormField label="Nombre Agencia" htmlFor="agencyName">
                    <TextInput_1.TextInput id="agencyName" name="agencyName" value={data.agencyName || ''} onChange={handleInputChange}/>
                </FormField_1.FormField>)}
            <FormField_1.FormField label="Tasa Gobierno (€)" htmlFor="costGovernmentFee">
                <TextInput_1.TextInput type="number" step="0.01" id="costGovernmentFee" name="costGovernmentFee" value={data.costGovernmentFee || ''} onChange={handleInputChange}/>
            </FormField_1.FormField>
            {data.notifiedBy === 'Agencia Externa' && (<FormField_1.FormField label="Coste Agencia (€)" htmlFor="costAgencyFee">
                    <TextInput_1.TextInput type="number" step="0.01" id="costAgencyFee" name="costAgencyFee" value={data.costAgencyFee || ''} onChange={handleInputChange}/>
                </FormField_1.FormField>)}
        </div>
        <FormField_1.FormField label="Checklist / Comentarios" htmlFor="checklist">
                <TextArea_1.TextArea id="checklist" name="checklist" value={data.checklist || ''} onChange={handleInputChange}/>
            </FormField_1.FormField>
            
            <CollapsibleSection_1.CollapsibleSection title="Archivos Adjuntos" defaultOpen>
                <div className="p-4">
                    <DocumentManager_1.DocumentManager documents={data.attachedFiles || []} onDocumentsChange={docs => setData(prev => ({ ...prev, attachedFiles: docs }))}/>
                </div>
            </CollapsibleSection_1.CollapsibleSection>
    </>);
    const HistoryTab = () => {
        if (typeof data.id !== 'number') {
            return <div className="text-center text-slate-500 p-8">Guarda la notificación para ver su historial.</div>;
        }
        const logs = appData.logs
            .filter(l => l.entityType === 'productNotifications' && l.entityId === data.id)
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        return <AuditLogDisplay_1.AuditLogDisplay logs={logs}/>;
    };
    return (<div className="bg-slate-800 rounded-lg">
      <div className="p-4 sm:p-6 border-b border-slate-700 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-200">{data.id === 'new' ? 'Nueva Notificación' : `Editando Notificación: ${getEntityName()}`}</h2>
         <div className="flex space-x-2">
            {data.id !== 'new' && <button onClick={handleDeleteClick} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 font-semibold">Eliminar</button>}
            <button onClick={onCancel} className="px-4 py-2 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500 font-semibold">Cancelar</button>
            <button onClick={handleSaveClick} className="px-4 py-2 bg-cyan-500 text-slate-900 rounded-md hover:bg-cyan-600 font-semibold">Guardar</button>
        </div>
      </div>

       <div className="border-b border-slate-700 bg-slate-800 px-4">
        <nav className="-mb-px flex space-x-4" aria-label="Tabs">
            <TabButton title="Principal" icon="file-alt" isActive={activeTab === 'main'} onClick={() => setActiveTab('main')}/>
            <TabButton title="Historial" icon="history" isActive={activeTab === 'history'} onClick={() => setActiveTab('history')}/>
        </nav>
      </div>

      <div className="p-4 sm:p-6 lg:p-8 bg-slate-900 rounded-b-lg">
        <div className={activeTab === 'main' ? 'block' : 'hidden'}>
          <MainTab />
        </div>
        <div className={activeTab === 'history' ? 'block' : 'hidden'}>
          <HistoryTab />
        </div>
      </div>
    </div>);
};
exports.ProductNotificationDetailView = ProductNotificationDetailView;
